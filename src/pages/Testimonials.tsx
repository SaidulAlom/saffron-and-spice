import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';
import { ErrorState } from '../components/AsyncState';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { TestimonialGridSkeleton } from '../components/Skeleton';
import { useSEO } from '../hooks/useSEO';
import { useSupabase } from '../hooks/useSupabase';
import { fetchTestimonials } from '../lib/db';

export default function Testimonials() {
  useSEO({
    title: 'Testimonials',
    path: '/testimonials',
    description:
      'Browse guest stories and social proof for the Saffron & Spice portfolio showcase.',
    keywords: ['restaurant testimonials', 'social proof UI', 'portfolio review cards', 'guest stories page'],
  });

  const { data: testimonials, loading, error, retry } = useSupabase(fetchTestimonials);

  return (
    <div className="space-y-24 pb-24 pt-28 sm:pt-32">
      <section className="container mx-auto px-4 text-center space-y-6 sm:px-6 sm:space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl leading-tight sm:text-5xl md:text-7xl"
        >
          Voices of our <span className="text-saffron italic">Guests</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-3xl text-base leading-relaxed opacity-70 sm:text-lg md:text-xl"
        >
          The strongest showcase projects feel trustworthy at a glance. These testimonial cards help sell the atmosphere, quality, and hospitality story behind the brand.
        </motion.p>
      </section>

      <section className="container mx-auto px-4 sm:px-6">
        {loading && <TestimonialGridSkeleton count={6} />}

        {error && !loading && (
          <ErrorState
            title="Unable to load testimonials"
            message={error}
            onRetry={retry}
            className="mx-auto max-w-3xl"
          />
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(testimonials ?? []).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group relative space-y-8 rounded-3xl border border-subtle bg-card p-8 transition-all hover:border-saffron/30 hover:shadow-2xl md:p-10 motion-card"
                data-tilt
              >
                <div className="absolute right-6 top-6 text-saffron/10 transition-colors group-hover:text-saffron/20 md:right-8 md:top-8">
                  <Quote size={58} />
                </div>
                <div className="flex gap-1 text-gold">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star key={`${testimonial.id}-${starIndex}`} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="relative z-10 text-lg leading-relaxed italic sm:text-xl">&quot;{testimonial.review}&quot;</p>
                <div className="flex items-center gap-4 border-t border-subtle pt-4">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-14 w-14 rounded-full border-2 border-saffron object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-lg font-serif font-bold">{testimonial.name}</h4>
                    <p className="text-sm opacity-50">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 sm:px-6">
        <div className="relative grid grid-cols-2 gap-6 overflow-hidden rounded-3xl bg-maroon p-8 text-center text-white sm:gap-8 sm:p-10 md:grid-cols-4 md:p-16">
          <div className="absolute inset-0 scale-150 opacity-10 mandala-bg" />
          {[
            { label: 'Happy Guests', value: '50k+' },
            { label: 'Reviews', value: '5k+' },
            { label: 'Average Rating', value: '4.9/5' },
            { label: 'Awards', value: '12' },
          ].map(stat => (
            <div key={stat.label} className="relative z-10 rounded-2xl p-4 motion-card" data-tilt>
              <p className="text-3xl font-serif text-gold sm:text-4xl md:text-5xl">{stat.value}</p>
              <p className="mt-2 text-xs uppercase tracking-widest opacity-70 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
