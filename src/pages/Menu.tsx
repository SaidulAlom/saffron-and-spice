import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Flame, ShoppingBag } from 'lucide-react';
import { ErrorState } from '../components/AsyncState';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { MenuGridSkeleton } from '../components/Skeleton';
import { useSEO } from '../hooks/useSEO';
import { useSupabase } from '../hooks/useSupabase';
import { fetchMenuItems } from '../lib/db';
import { MenuItem } from '../constants';

interface MenuProps {
  onAddToCart: (item: MenuItem) => void;
}

export default function Menu({ onAddToCart }: MenuProps) {
  useSEO({
    title: 'Menu',
    path: '/menu',
    description:
      'Browse the signature dishes, breads, biryanis, desserts, and mocktails that power this restaurant portfolio showcase.',
    keywords: ['Indian restaurant menu', 'restaurant ordering UI', 'portfolio menu page', 'fine dining menu showcase'],
  });

  const [activeCategory, setActiveCategory] = useState('All');
  const { data: menuItems, loading, error, retry } = useSupabase(fetchMenuItems);

  const items = menuItems ?? [];
  const categories = ['All', ...new Set(items.map(item => item.category))];
  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="space-y-16 pb-24 pt-28 sm:pt-32">
      <section className="container mx-auto px-4 text-center space-y-6 sm:px-6 sm:space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl leading-tight sm:text-5xl md:text-7xl"
        >
          Our <span className="text-saffron italic">Signature Menu</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-3xl text-base leading-relaxed opacity-70 sm:text-lg md:text-xl"
        >
          Explore a curated selection of India&apos;s most beloved dishes, prepared with royal precision and resilient enough to demo beautifully even if the CMS is offline.
        </motion.p>
      </section>

      <section className="container mx-auto px-4 sm:px-6">
        {loading && <MenuGridSkeleton count={8} />}

        {error && !loading && (
          <ErrorState
            title="Unable to load the menu"
            message={error}
            onRetry={retry}
            className="mx-auto max-w-3xl"
          />
        )}

        {!loading && !error && (
          <>
            <div className="mb-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all micro-button ${
                    activeCategory === category
                      ? 'bg-saffron text-white shadow-lg shadow-saffron/20'
                      : 'border border-subtle bg-card hover:border-saffron'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {filteredItems.length === 0 ? (
              <ErrorState
                title="No dishes in this section yet"
                message="Switch categories or check back later for updated menu content."
              />
            ) : (
              <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout">
                  {filteredItems.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="group overflow-hidden rounded-2xl border border-subtle bg-card transition-all hover:-translate-y-2 hover:border-saffron/50 hover:shadow-2xl motion-card"
                      data-tilt
                    >
                      <div className="relative h-64 overflow-hidden">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        {item.isSignature && (
                          <div className="absolute left-4 top-4 rounded-full bg-maroon px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                            Signature
                          </div>
                        )}
                        <div className="absolute bottom-4 right-4 flex gap-1">
                          {[...Array(item.spiceLevel)].map((_, index) => (
                            <Flame key={`${item.id}-${index}`} size={14} className="fill-saffron text-saffron" />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4 p-6">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-xl font-serif transition-colors group-hover:text-saffron">{item.name}</h4>
                          <span className="shrink-0 text-lg font-bold text-saffron">Rs. {item.price}</span>
                        </div>
                        <p className="line-clamp-2 text-sm opacity-60">{item.description}</p>
                        <button
                          onClick={() => onAddToCart(item)}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-subtle bg-card py-3 text-sm font-medium transition-all hover:border-saffron hover:bg-saffron hover:text-white magnetic-button"
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
            )}
          </>
        )}
      </section>
    </div>
  );
}
