import { motion } from 'motion/react';
import { Star, Leaf, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchSignatureItems, fetchTestimonials } from '../lib/db';
import { useSupabase } from '../hooks/useSupabase';
import { ImageWithFallback } from '../components/ImageWithFallback';

export default function Home() {
  const { data: signatureItems } = useSupabase(fetchSignatureItems);
  const { data: testimonials } = useSupabase(fetchTestimonials);

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-parallax" data-parallax data-parallax-speed="0.08">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=2000"
            alt="Indian Royal Thali"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="motion-reveal"
          >
            <h1 className="text-6xl md:text-8xl font-serif mb-6 leading-tight">
              A Royal Journey Through <br />
              <span className="text-saffron italic">Indian Flavors</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 font-light">
              Where centuries-old tradition meets modern elegance in every bite. Experience the finest regional Indian cuisine.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/menu" className="w-full sm:w-auto px-10 py-4 bg-saffron hover:bg-saffron-dark text-white rounded-full font-medium transition-all transform hover:scale-105 shadow-xl shadow-saffron/20 magnetic-button" data-magnetic>
                Order Now
              </Link>
              <Link to="/menu" className="w-full sm:w-auto px-10 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-medium transition-all transform hover:scale-105 magnetic-button" data-magnetic>
                Explore Menu
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* Brief About Section */}
      <section className="py-24 relative overflow-hidden mandala-bg">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl motion-card" data-tilt>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000"
                  alt="Luxurious Restaurant Interior"
                  className="w-full h-full object-cover"
                  data-parallax
                  data-parallax-speed="0.04"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-maroon rounded-2xl p-8 text-white hidden md:flex flex-col justify-center shadow-2xl motion-card" data-tilt>
                <h3 className="text-3xl font-serif mb-2">15+ Years</h3>
                <p className="text-sm text-white/70">Of culinary excellence and royal hospitality in every dish we serve.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-saffron font-medium tracking-widest uppercase text-sm">Our Heritage</h2>
                <h3 className="text-4xl md:text-5xl font-serif leading-tight">Crafting Memories Through Authentic Spices</h3>
              </div>
              <p className="text-lg opacity-80 leading-relaxed">
                Founded in the heart of India, Saffron & Spice brings together centuries-old family recipes with contemporary presentation. Our chefs craft authentic regional Indian cuisine using the finest spices sourced directly from Rajasthan, Kerala, and Kashmir.
              </p>
              <Link to="/about" className="inline-block px-8 py-4 border border-saffron text-saffron hover:bg-saffron hover:text-white rounded-full font-medium transition-all magnetic-button" data-magnetic>
                Our Full Story
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Signature Items */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-saffron font-medium tracking-widest uppercase text-sm">Chef's Recommendations</h2>
            <h3 className="text-4xl md:text-5xl font-serif">Signature Flavors</h3>
            <p className="opacity-60">A glimpse into our royal menu. Hand-picked by our master chefs.</p>
          </div>

          {!signatureItems ? (
            <div className="flex justify-center py-16 opacity-60">
              <Loader2 size={24} className="animate-spin text-saffron" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {signatureItems.map(item => (
                <div key={item.id} className="group motion-card bg-card rounded-2xl overflow-hidden border border-subtle hover:border-saffron/50 transition-all hover:shadow-2xl" data-tilt>
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-maroon text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Signature</div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-serif mb-2">{item.name}</h4>
                    <p className="text-sm opacity-60 line-clamp-2 mb-4">{item.description}</p>
                    <span className="text-lg font-bold text-saffron">₹{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/menu" className="inline-flex items-center gap-2 px-8 py-4 bg-saffron text-white rounded-full font-medium hover:bg-saffron-dark transition-all magnetic-button" data-magnetic>
              View Full Menu <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="py-24 bg-card/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-saffron font-medium tracking-widest uppercase text-sm">Kind Words</h2>
            <h3 className="text-4xl md:text-5xl font-serif">What Our Diners Say</h3>
          </div>

          {!testimonials ? (
            <div className="flex justify-center py-16 opacity-60">
              <Loader2 size={24} className="animate-spin text-saffron" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 motion-card bg-card rounded-2xl border border-subtle space-y-6 relative"
                  data-tilt
                >
                  <div className="flex gap-1 text-gold">
                    {[...Array(t.rating)].map((_, i) => <Star key={`star-${t.id}-${i}`} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-lg italic opacity-80">"{t.review}"</p>
                  <div className="flex items-center gap-4">
                    <ImageWithFallback src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-serif font-bold">{t.name}</h4>
                      <p className="text-xs opacity-50">{t.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/testimonials" className="inline-flex items-center gap-2 px-8 py-4 border border-saffron text-saffron hover:bg-saffron hover:text-white rounded-full font-medium transition-all magnetic-button" data-magnetic>
              View All Testimonials <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <h2 className="text-saffron font-medium tracking-widest uppercase text-sm">Visual Journey</h2>
              <h3 className="text-4xl md:text-5xl font-serif">A Glimpse of Royalty</h3>
            </div>
            <Link to="/gallery" className="px-8 py-4 bg-maroon text-white rounded-full font-medium hover:bg-red-900 transition-all flex items-center gap-2 magnetic-button" data-magnetic>
              View Gallery <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800',
              'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800',
            ].map(img => (
              <div key={img} className="aspect-square rounded-2xl overflow-hidden group motion-card" data-tilt>
                <ImageWithFallback src={img} alt="Gallery Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
