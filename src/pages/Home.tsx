import { motion } from 'motion/react';
import { ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ErrorState } from '../components/AsyncState';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { CardGridSkeleton, TestimonialGridSkeleton } from '../components/Skeleton';
import { useSEO } from '../hooks/useSEO';
import { useSupabase } from '../hooks/useSupabase';
import { fetchSignatureItems, fetchTestimonials } from '../lib/db';

const restaurantSchema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Saffron & Spice',
  servesCuisine: ['Indian'],
  priceRange: '$$',
  image: `${import.meta.env.VITE_SITE_URL || 'http://localhost:3000'}/og-image.svg`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Royal Palace Road',
    addressLocality: 'Silchar',
    addressRegion: 'Assam',
    postalCode: '788001',
    addressCountry: 'IN',
  },
  telephone: '+91 3842 245 678',
};

export default function Home() {
  useSEO({
    title: 'Home',
    path: '/',
    description:
      'Discover a refined Indian restaurant portfolio with cinematic storytelling, signature dishes, smooth ordering, and reservation-ready interactions.',
    keywords: ['restaurant portfolio', 'Indian restaurant website', 'fine dining showcase', 'React portfolio project'],
    structuredData: restaurantSchema,
  });

  const {
    data: signatureItems,
    loading: signatureLoading,
    error: signatureError,
    retry: retrySignature,
  } = useSupabase(fetchSignatureItems);
  const {
    data: testimonials,
    loading: testimonialsLoading,
    error: testimonialsError,
    retry: retryTestimonials,
  } = useSupabase(fetchTestimonials);

  return (
    <div className="space-y-0">
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-parallax" data-parallax data-parallax-speed="0.08">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=2000"
            alt="Indian royal thali presentation"
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/85" />
        </div>

        <div className="container relative z-10 mx-auto px-4 pt-28 pb-16 text-center text-white sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="motion-reveal mx-auto max-w-5xl"
          >
            <p className="mb-5 text-xs uppercase tracking-[0.38em] text-white/65 sm:text-sm">Modern Indian Fine Dining</p>
            <h1 className="text-4xl leading-tight sm:text-5xl md:text-7xl lg:text-8xl">
              A Royal Journey Through <br />
              <span className="text-saffron italic">Indian Flavors</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg md:text-2xl">
              A portfolio-ready dining experience where heritage recipes, immersive motion, and polished guest journeys come together.
            </p>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
              <Link
                to="/menu"
                className="w-full rounded-full bg-saffron px-8 py-4 font-medium text-white shadow-xl shadow-saffron/20 transition-all hover:scale-105 hover:bg-saffron-dark sm:w-auto magnetic-button"
                data-magnetic
              >
                Order Now
              </Link>
              <Link
                to="/experiences"
                className="w-full rounded-full border border-white/30 bg-white/10 px-8 py-4 font-medium text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 sm:w-auto magnetic-button"
                data-magnetic
              >
                Explore Experiences
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/50 sm:flex"
        >
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="h-12 w-px bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      <section className="relative overflow-hidden py-20 sm:py-24 mandala-bg">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl motion-card" data-tilt>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000"
                  alt="Luxurious restaurant interior"
                  className="h-full w-full object-cover"
                  data-parallax
                  data-parallax-speed="0.04"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 right-0 hidden w-56 rounded-2xl bg-maroon p-6 text-white shadow-2xl md:flex md:flex-col md:justify-center lg:-right-8 motion-card" data-tilt>
                <h3 className="mb-2 text-3xl font-serif">15+ Years</h3>
                <p className="text-sm text-white/70">Of culinary excellence and warm hospitality layered into every course.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-sm font-medium uppercase tracking-widest text-saffron">Our Heritage</h2>
                <h3 className="text-3xl leading-tight sm:text-4xl md:text-5xl">Crafting Memories Through Authentic Spices</h3>
              </div>
              <p className="text-base leading-relaxed opacity-80 sm:text-lg">
                Saffron & Spice blends centuries-old family recipes with a modern presentation layer, creating a portfolio piece that feels both luxurious and usable. Every page is designed to showcase storytelling, motion, and practical full-stack polish.
              </p>
              <Link
                to="/about"
                className="inline-block rounded-full border border-saffron px-8 py-4 font-medium text-saffron transition-all hover:bg-saffron hover:text-white magnetic-button"
                data-magnetic
              >
                Our Full Story
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-card/50 py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto mb-14 max-w-3xl space-y-4 text-center sm:mb-16">
            <h2 className="text-sm font-medium uppercase tracking-widest text-saffron">Chef&apos;s Recommendations</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl">Signature Flavors</h3>
            <p className="opacity-60">A snapshot of the menu experience, designed to stay resilient even when the content source is offline.</p>
          </div>

          {signatureLoading && <CardGridSkeleton count={4} />}

          {signatureError && !signatureLoading && (
            <ErrorState
              title="Unable to load signature dishes"
              message={signatureError}
              onRetry={retrySignature}
              className="max-w-3xl mx-auto"
            />
          )}

          {!signatureLoading && !signatureError && (
            <div className="mb-12 grid grid-cols-[repeat(auto-fit,minmax(260px,320px))] justify-center gap-8">
              {(signatureItems ?? []).map(item => (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-subtle bg-card transition-all hover:border-saffron/50 hover:shadow-2xl motion-card"
                  data-tilt
                >
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-maroon px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                      Signature
                    </div>
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="space-y-2">
                      <h4 className="text-xl font-serif">{item.name}</h4>
                      <p className="line-clamp-2 text-sm opacity-60">{item.description}</p>
                    </div>
                    <span className="text-lg font-bold text-saffron">Rs. {item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-saffron px-8 py-4 font-medium text-white transition-all hover:bg-saffron-dark magnetic-button"
              data-magnetic
            >
              View Full Menu <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-card/30 py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto mb-14 max-w-3xl space-y-4 text-center sm:mb-16">
            <h2 className="text-sm font-medium uppercase tracking-widest text-saffron">Kind Words</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl">What Our Diners Say</h3>
          </div>

          {testimonialsLoading && <TestimonialGridSkeleton count={3} />}

          {testimonialsError && !testimonialsLoading && (
            <ErrorState
              title="Unable to load testimonials"
              message={testimonialsError}
              onRetry={retryTestimonials}
              className="max-w-3xl mx-auto"
            />
          )}

          {!testimonialsLoading && !testimonialsError && (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {(testimonials ?? []).slice(0, 3).map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative space-y-6 rounded-2xl border border-subtle bg-card p-8 motion-card"
                  data-tilt
                >
                  <div className="flex gap-1 text-gold">
                    {[...Array(testimonial.rating)].map((_, starIndex) => (
                      <Star key={`${testimonial.id}-${starIndex}`} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-lg italic opacity-80">&quot;{testimonial.review}&quot;</p>
                  <div className="flex items-center gap-4">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-serif font-bold">{testimonial.name}</h4>
                      <p className="text-xs opacity-50">{testimonial.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/testimonials"
              className="inline-flex items-center gap-2 rounded-full border border-saffron px-8 py-4 font-medium text-saffron transition-all hover:bg-saffron hover:text-white magnetic-button"
              data-magnetic
            >
              View All Testimonials <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-14 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <h2 className="text-sm font-medium uppercase tracking-widest text-saffron">Visual Journey</h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl">A Glimpse of Royalty</h3>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 self-start rounded-full bg-maroon px-8 py-4 font-medium text-white transition-all hover:bg-red-900 magnetic-button"
              data-magnetic
            >
              View Gallery <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800',
            ].map(image => (
              <div key={image} className="aspect-square overflow-hidden rounded-2xl group motion-card" data-tilt>
                <ImageWithFallback
                  src={image}
                  alt="Gallery preview"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
