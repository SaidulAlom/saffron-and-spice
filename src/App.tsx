import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Menu from './pages/Menu';
import Experiences from './pages/Experiences';
import Testimonials from './pages/Testimonials';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import { MenuItem } from './constants';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './pages/NotFound';
import { trackPageView } from './lib/analytics';

function AnimatedRoutes({ addToCart }: { addToCart: (item: MenuItem) => void }) {
  const location = useLocation();

  useEffect(() => { trackPageView(location.pathname); }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="motion-page-shell"
        initial={{ opacity: 0, y: 18, scale: 0.985, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -14, scale: 0.99, filter: 'blur(6px)' }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu onAddToCart={addToCart} />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light') return false;
      if (saved === 'dark') return true;
      return true;
    } catch {
      return true;
    }
  });
  const [cartItems, setCartItems] = useState<{ item: MenuItem; quantity: number }[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(i => {
      if (i.item.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(i => i.item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <ErrorBoundary>
    <Router>
      <Layout 
        cartItems={cartItems} 
        updateQuantity={updateQuantity} 
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      >
        <AnimatedRoutes addToCart={addToCart} />
      </Layout>
    </Router>
    </ErrorBoundary>
  );
}
