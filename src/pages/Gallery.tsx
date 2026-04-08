import { motion } from 'motion/react';
import { ErrorState } from '../components/AsyncState';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { GalleryGridSkeleton } from '../components/Skeleton';
import { useSEO } from '../hooks/useSEO';
import { useSupabase } from '../hooks/useSupabase';
import { fetchGalleryImages } from '../lib/db';

export default function Gallery() {
  useSEO({
    title: 'Gallery',
    path: '/gallery',
    description:
      'See the ambience, plating, and design language behind the Saffron & Spice portfolio experience.',
    keywords: ['restaurant gallery', 'food photography showcase', 'portfolio gallery page', 'fine dining visuals'],
  });

  const { data: images, loading, error, retry } = useSupabase(fetchGalleryImages);

  return (
    <div className="space-y-24 pb-24 pt-28 sm:pt-32">
      <section className="container mx-auto px-4 text-center space-y-6 sm:px-6 sm:space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl leading-tight sm:text-5xl md:text-7xl"
        >
          Visual <span className="text-saffron italic">Feast</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-3xl text-base leading-relaxed opacity-70 sm:text-lg md:text-xl"
        >
          Take a closer look at the atmosphere, craftsmanship, and presentation that make the experience feel cinematic on every screen size.
        </motion.p>
      </section>

      <section className="container mx-auto px-4 sm:px-6">
        {loading && <GalleryGridSkeleton count={6} />}

        {error && !loading && (
          <ErrorState
            title="Unable to load the gallery"
            message={error}
            onRetry={retry}
            className="mx-auto max-w-3xl"
          />
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(images ?? []).map((image, index) => (
              <motion.div
                key={image.url}
                initial={{ opacity: 0, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-3xl shadow-2xl motion-card"
                data-tilt
              >
                <ImageWithFallback
                  src={image.url}
                  alt={image.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:p-8">
                  <div className="translate-y-4 space-y-2 transition-transform duration-500 group-hover:translate-y-0">
                    <h4 className="text-xl font-serif text-white sm:text-2xl">{image.title}</h4>
                    <div className="h-1 w-12 rounded-full bg-saffron" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 text-center space-y-10 sm:px-6 sm:space-y-12">
        <div className="space-y-4">
          <h3 className="text-3xl font-serif">Follow our Journey</h3>
          <p className="opacity-60">Shareable visuals, warm branding, and polished micro-interactions make this project presentation-ready.</p>
        </div>
        <div className="flex justify-center">
          <a
            href="https://instagram.com/saffronspice_royal"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-4 font-medium text-white shadow-xl shadow-pink-500/20 transition-all hover:scale-105 magnetic-button"
            data-magnetic
          >
            @saffronspice_royal
          </a>
        </div>
      </section>
    </div>
  );
}
