import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router-dom';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function MotionEffects() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 950);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const reducedMotion = prefersReducedMotion();
    document.documentElement.classList.toggle('motion-reduced', reducedMotion);
    document.documentElement.classList.toggle('motion-enhanced', !reducedMotion);

    if (reducedMotion) return;

    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-reveal], main section, main .motion-card, main .motion-reveal, footer .container',
      ),
    );

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );

    revealTargets.forEach((target, index) => {
      target.setAttribute('data-reveal', target.dataset.reveal || 'fade-up');
      if (!target.style.getPropertyValue('--reveal-delay')) {
        target.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 70}ms`);
      }
      observer.observe(target);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const parallaxTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    let frame = 0;

    const updateParallax = () => {
      frame = 0;
      const viewportCenter = window.innerHeight / 2;

      parallaxTargets.forEach(target => {
        const rect = target.getBoundingClientRect();
        const speed = Number(target.dataset.parallaxSpeed || 0.1);
        const distanceFromCenter = rect.top + rect.height / 2 - viewportCenter;
        const y = clamp(distanceFromCenter * -speed, -90, 90);

        target.style.setProperty('--parallax-y', `${y.toFixed(2)}px`);
      });
    };

    const requestParallax = () => {
      if (!frame) frame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener('scroll', requestParallax, { passive: true });
    window.addEventListener('resize', requestParallax);

    return () => {
      window.removeEventListener('scroll', requestParallax);
      window.removeEventListener('resize', requestParallax);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let activeTilt: HTMLElement | null = null;

    const resetTilt = (target: HTMLElement | null) => {
      if (!target) return;
      target.classList.remove('is-tilting');
      target.style.setProperty('--tilt-x', '0deg');
      target.style.setProperty('--tilt-y', '0deg');
      target.style.setProperty('--glare-x', '50%');
      target.style.setProperty('--glare-y', '50%');
      if (target.dataset.tiltBaseTransform !== undefined) {
        target.style.transform = target.dataset.tiltBaseTransform;
        delete target.dataset.tiltBaseTransform;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>('[data-tilt]')
        : null;

      if (!target) {
        resetTilt(activeTilt);
        activeTilt = null;
        return;
      }

      if (activeTilt && activeTilt !== target) resetTilt(activeTilt);
      activeTilt = target;

      const rect = target.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = clamp((x - 0.5) * 14, -8, 8);
      const rotateX = clamp((0.5 - y) * 14, -8, 8);

      if (target.dataset.tiltBaseTransform === undefined) {
        target.dataset.tiltBaseTransform = target.style.transform;
      }

      const baseTransform = target.dataset.tiltBaseTransform;
      const tiltTransform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-0.45rem) scale(1.01)`;

      target.classList.add('is-tilting');
      target.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
      target.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
      target.style.setProperty('--glare-x', `${(x * 100).toFixed(0)}%`);
      target.style.setProperty('--glare-y', `${(y * 100).toFixed(0)}%`);
      target.style.transform = baseTransform && baseTransform !== 'none'
        ? `${baseTransform} ${tiltTransform}`
        : tiltTransform;
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (!activeTilt || activeTilt.contains(event.relatedTarget as Node | null)) return;
      resetTilt(activeTilt);
      activeTilt = null;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerout', handlePointerOut);

    return () => {
      resetTilt(activeTilt);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', handlePointerOut);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;

    let activeMagnet: HTMLElement | null = null;

    const resetMagnet = (target: HTMLElement | null) => {
      if (!target) return;
      target.style.setProperty('--magnet-x', '0px');
      target.style.setProperty('--magnet-y', '0px');
    };

    const handlePointerMove = (event: PointerEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>('[data-magnetic]')
        : null;

      if (!target) {
        resetMagnet(activeMagnet);
        activeMagnet = null;
        return;
      }

      if (activeMagnet && activeMagnet !== target) resetMagnet(activeMagnet);
      activeMagnet = target;

      const rect = target.getBoundingClientRect();
      const x = (event.clientX - (rect.left + rect.width / 2)) * 0.16;
      const y = (event.clientY - (rect.top + rect.height / 2)) * 0.16;

      target.style.setProperty('--magnet-x', `${clamp(x, -10, 10).toFixed(2)}px`);
      target.style.setProperty('--magnet-y', `${clamp(y, -8, 8).toFixed(2)}px`);
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (!activeMagnet || activeMagnet.contains(event.relatedTarget as Node | null)) return;
      resetMagnet(activeMagnet);
      activeMagnet = null;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerout', handlePointerOut);

    return () => {
      resetMagnet(activeMagnet);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', handlePointerOut);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>('button, a, [data-ripple]')
        : null;

      if (!target || target.hasAttribute('disabled')) return;

      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');

      ripple.className = 'motion-ripple';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

      target.classList.add('has-motion-ripple');
      target.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 650);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="site-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
            aria-live="polite"
            aria-label="Loading Saffron and Spice"
          >
            <motion.div
              className="loader-card"
              initial={{ y: 18, scale: 0.96, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="loader-emblem">S&S</div>
              <div className="loader-copy">
                <span>Preparing your royal table</span>
                <strong>Saffron & Spice</strong>
              </div>
              <div className="loader-track">
                <motion.span
                  initial={{ x: '-100%' }}
                  animate={{ x: '120%' }}
                  transition={{ duration: 0.95, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
