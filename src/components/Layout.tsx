import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu as MenuIcon, 
  X, 
  ShoppingBag, 
  Moon, 
  Sun, 
  Leaf,
  Instagram,
  Facebook,
  Youtube,
  ArrowUp,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight
} from 'lucide-react';
import CartSidebar from './CartSidebar';
import ReservationModal from './ReservationModal';
import MotionEffects from './MotionEffects';
import { MenuItem } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  cartItems: { item: MenuItem; quantity: number }[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export default function Layout({ children, cartItems, updateQuantity, removeFromCart, clearCart, isDarkMode, setIsDarkMode }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Experiences', path: '/experiences' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const footerLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Signature Menu', path: '/menu' },
    { name: 'Dining Experiences', path: '/experiences' },
    { name: 'Guest Stories', path: '/testimonials' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/saffronspice_royal', Icon: Instagram },
    { name: 'Facebook', href: 'https://facebook.com/saffronspiceroyal', Icon: Facebook },
    { name: 'YouTube', href: 'https://youtube.com/@saffronspiceroyal', Icon: Youtube },
  ];

  return (
    <div className="min-h-screen selection:bg-saffron/30 overflow-x-hidden">
      <MotionEffects />
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 bg-black/70 backdrop-blur-xl border-b border-white/10 shadow-lg text-white ${scrolled ? 'py-4' : 'py-6'}`}>
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer nav-logo" data-cursor="hover">
            <div className="w-10 h-10 bg-saffron rounded-lg flex items-center justify-center text-white transform group-hover:rotate-12 transition-transform logo-mark">
              <Leaf size={24} />
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight">Saffron & Spice</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`text-sm font-medium hover:text-saffron transition-colors relative group nav-link ${location.pathname === link.path ? 'text-saffron' : ''}`}
                data-cursor="hover"
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-saffron transition-all ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors micro-button" aria-label="Toggle color theme">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors micro-button" aria-label="Open cart">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-saffron text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-card cart-pulse">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsReserveOpen(true)} className="hidden md:block px-6 py-2.5 bg-maroon text-white rounded-full text-sm font-medium hover:bg-red-900 transition-all shadow-lg hover:shadow-maroon/20 magnetic-button" data-magnetic>
              Reserve Table
            </button>
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors micro-button" aria-label="Open menu">
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl text-white z-[60] lg:hidden flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-subtle">
              <span className="text-xl font-serif font-bold">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full micro-button" aria-label="Close menu">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block text-3xl sm:text-4xl font-serif hover:text-saffron transition-colors nav-link-mobile ${location.pathname === link.path ? 'text-saffron' : ''}`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="p-8 border-t border-subtle space-y-4">
              <button onClick={() => { setIsReserveOpen(true); setIsMenuOpen(false); }} className="w-full py-4 bg-maroon text-white rounded-xl font-medium magnetic-button" data-magnetic>
                Reserve a Table
              </button>
              <button onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }} className="w-full py-4 bg-saffron text-white rounded-xl font-medium magnetic-button" data-magnetic>
                Order Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-0">
        {children}
      </main>

      {/* Back to Top */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-saffron text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-saffron-dark transition-all hover:scale-110 micro-button"
            aria-label="Back to top"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative border-t border-subtle bg-card/95 overflow-hidden">
        <div className="absolute inset-0 opacity-5 mandala-bg scale-150" />
        <div className="container mx-auto px-4 sm:px-6 py-16 relative" data-reveal>
          <div className="mb-12 rounded-3xl border border-subtle bg-gradient-to-r from-maroon to-saffron text-white p-8 md:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 motion-card">
            <div className="space-y-3 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.35em] text-white/70">Reserve Tonight</p>
              <h2 className="text-3xl md:text-4xl font-serif">Plan your next memorable dinner.</h2>
              <p className="text-white/80">
                Reserve a table, explore the signature menu, or plan a private dining evening with the Saffron & Spice team.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsReserveOpen(true)}
                className="px-6 py-3 rounded-full bg-white text-maroon font-medium flex items-center justify-center gap-2 magnetic-button"
                data-magnetic
              >
                Reserve Table <ChevronRight size={18} />
              </button>
              <Link
                to="/menu"
                className="px-6 py-3 rounded-full border border-white/40 text-white font-medium flex items-center justify-center gap-2 magnetic-button"
                data-magnetic
              >
                Explore Menu <ChevronRight size={18} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-saffron rounded-xl flex items-center justify-center text-white shadow-lg shadow-saffron/20">
                  <Leaf size={22} />
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold">Saffron & Spice</p>
                  <p className="text-sm opacity-60">Royal Indian dining in Silchar</p>
                </div>
              </div>
              <p className="opacity-70 leading-relaxed max-w-sm">
                A warm fine-dining destination inspired by India&apos;s royal kitchens, layered spices, and memorable hospitality.
              </p>
              <div className="flex gap-3">
                {socialLinks.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-11 h-11 bg-white/10 hover:bg-saffron hover:text-white rounded-full flex items-center justify-center transition-all micro-button"
                    aria-label={name}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-lg font-serif">Quick Links</h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                {footerLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="opacity-70 hover:opacity-100 hover:text-saffron transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-lg font-serif">Contact</h3>
              <div className="space-y-4 text-sm opacity-75">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-saffron mt-0.5 shrink-0" />
                  <span>123 Royal Palace Road, Silchar, Assam 788001, India</span>
                </div>
                <a href="tel:+913842245678" className="flex items-center gap-3 hover:text-saffron transition-colors">
                  <Phone size={18} className="text-saffron shrink-0" />
                  <span>+91 3842 245 678</span>
                </a>
                <a href="mailto:hello@saffronspice.com" className="flex items-center gap-3 hover:text-saffron transition-colors">
                  <Mail size={18} className="text-saffron shrink-0" />
                  <span>hello@saffronspice.com</span>
                </a>
              </div>
            </div>

            <div className="space-y-5">
              <h3 className="text-lg font-serif">Opening Hours</h3>
              <div className="space-y-4 text-sm opacity-75">
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-saffron mt-0.5 shrink-0" />
                  <div className="space-y-2 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-subtle/60 pb-2 gap-1 sm:gap-4">
                      <span>Mon - Thu</span>
                      <span>12:00 PM - 11:00 PM</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-subtle/60 pb-2 gap-1 sm:gap-4">
                      <span>Fri - Sun</span>
                      <span>12:00 PM - 12:00 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-subtle flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-60">
            <p>&copy; 2026 Saffron & Spice. Crafted with care in India.</p>
            <div className="flex items-center gap-6">
              <Link to="/contact" className="hover:text-saffron transition-colors">Reservations & Events</Link>
              <Link to="/gallery" className="hover:text-saffron transition-colors">See the Space</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Overlays */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onClearCart={clearCart}
      />
      <ReservationModal 
        isOpen={isReserveOpen} 
        onClose={() => setIsReserveOpen(false)} 
      />
    </div>
  );
}
