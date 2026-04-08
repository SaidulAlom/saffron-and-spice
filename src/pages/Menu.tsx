import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Flame, Loader2 } from 'lucide-react';
import { MenuItem } from '../constants';
import { fetchMenuItems } from '../lib/db';
import { useSupabase } from '../hooks/useSupabase';
import { ImageWithFallback } from '../components/ImageWithFallback';

interface MenuProps {
  onAddToCart: (item: MenuItem) => void;
}

export default function Menu({ onAddToCart }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const { data: menuItems, loading, error } = useSupabase(fetchMenuItems);

  const items = menuItems ?? [];
  const categories = ['All', ...new Set(items.map(item => item.category))];
  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="pt-32 pb-24 space-y-16">
      <section className="container mx-auto px-6 text-center space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-serif leading-tight"
        >
          Our <span className="text-saffron italic">Signature Menu</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl opacity-70 leading-relaxed max-w-2xl mx-auto"
        >
          Explore a curated selection of India's most beloved dishes, prepared with royal precision and authentic spices.
        </motion.p>
      </section>

      <section className="container mx-auto px-6">
        {loading && (
          <div className="flex items-center justify-center py-32 gap-3 opacity-60">
            <Loader2 size={24} className="animate-spin text-saffron" />
            <span>Loading menu...</span>
          </div>
        )}

        {error && (
          <div className="text-center py-32 space-y-2">
            <p className="text-red-500 font-medium">Failed to load menu</p>
            <p className="text-sm opacity-50">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all micro-button ${activeCategory === cat ? 'bg-saffron text-white shadow-lg shadow-saffron/20' : 'bg-card border border-subtle hover:border-saffron'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredItems.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group motion-card bg-card rounded-2xl overflow-hidden border border-subtle hover:border-saffron/50 transition-all hover:shadow-2xl hover:-translate-y-2"
                    data-tilt
                  >
                    <div className="relative h-64 overflow-hidden">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      {item.isSignature && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-maroon text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                          Signature
                        </div>
                      )}
                      <div className="absolute bottom-4 right-4 flex gap-1">
                        {[...Array(item.spiceLevel)].map((_, i) => (
                          <Flame key={`flame-${item.id}-${i}`} size={14} className="text-saffron fill-saffron" />
                        ))}
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xl font-serif group-hover:text-saffron transition-colors">{item.name}</h4>
                        <span className="text-lg font-bold text-saffron">₹{item.price}</span>
                      </div>
                      <p className="text-sm opacity-60 line-clamp-2">{item.description}</p>
                      <button
                        onClick={() => onAddToCart(item)}
                        className="w-full py-3 bg-card border border-subtle hover:bg-saffron hover:border-saffron hover:text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 magnetic-button"
                        data-magnetic
                      >
                        <ShoppingBag size={16} />
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </section>
    </div>
  );
}
