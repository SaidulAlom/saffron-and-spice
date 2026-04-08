import { motion } from 'motion/react';
import { Star, Quote, Loader2 } from 'lucide-react';
import { fetchTestimonials } from '../lib/db';
import { useSupabase } from '../hooks/useSupabase';
import { ImageWithFallback } from '../components/ImageWithFallback';

export default function Testimonials() {
  const { data: testimonials, loading, error } = useSupabase(fetchTestimonials);

  return (
    <div className="pt-32 pb-24 space-y-24">
      <section className="container mx-auto px-6 text-center space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-serif leading-tight"
        >
          Voices of our <span className="text-saffron italic">Guests</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl opacity-70 leading-relaxed max-w-2xl mx-auto"
        >
          The greatest reward for our culinary passion is the joy of our diners. Read what our guests have to say about their royal journey.
        </motion.p>
      </section>

      <section className="container mx-auto px-6">
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3 opacity-60">
            <Loader2 size={24} className="animate-spin text-saffron" />
            <span>Loading testimonials...</span>
          </div>
        )}
        {error && (
          <div className="text-center py-24">
            <p className="text-red-500 font-medium">Failed to load testimonials</p>
            <p className="text-sm opacity-50 mt-1">{error}</p>
          </div>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(testimonials ?? []).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 motion-card bg-card rounded-3xl border border-subtle space-y-8 relative group hover:border-saffron/30 transition-all hover:shadow-2xl"
                data-tilt
              >
                <div className="absolute top-8 right-8 text-saffron/10 group-hover:text-saffron/20 transition-colors">
                  <Quote size={64} />
                </div>
                <div className="flex gap-1 text-gold">
                  {[...Array(t.rating)].map((_, i) => <Star key={`star-${t.id}-${i}`} size={18} fill="currentColor" />)}
                </div>
                <p className="text-xl font-serif italic leading-relaxed relative z-10">"{t.review}"</p>
                <div className="flex items-center gap-4 pt-4 border-t border-subtle">
                  <ImageWithFallback
                    src={t.image}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-saffron"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-lg">{t.name}</h4>
                    <p className="text-sm opacity-50">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto px-6">
        <div className="bg-maroon rounded-3xl p-12 md:p-20 text-white grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 mandala-bg scale-150" />
          {[
            { label: 'Happy Guests', value: '50k+' },
            { label: 'Reviews', value: '5k+' },
            { label: 'Rating', value: '4.9/5' },
            { label: 'Awards', value: '12' },
          ].map((stat) => (
            <div key={stat.label} className="space-y-2 relative z-10 motion-card rounded-2xl p-4" data-tilt>
              <p className="text-4xl md:text-5xl font-serif text-gold">{stat.value}</p>
              <p className="text-sm uppercase tracking-widest opacity-70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
