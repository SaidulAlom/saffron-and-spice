import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { fetchGalleryImages } from '../lib/db';
import { useSupabase } from '../hooks/useSupabase';
import { ImageWithFallback } from '../components/ImageWithFallback';

export default function Gallery() {
  const { data: images, loading, error } = useSupabase(fetchGalleryImages);

  return (
    <div className="pt-32 pb-24 space-y-24">
      <section className="container mx-auto px-6 text-center space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-serif leading-tight"
        >
          Visual <span className="text-saffron italic">Feast</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl opacity-70 leading-relaxed max-w-2xl mx-auto"
        >
          Take a glimpse into the royal ambiance and culinary artistry of Saffron & Spice.
        </motion.p>
      </section>

      <section className="container mx-auto px-6">
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3 opacity-60">
            <Loader2 size={24} className="animate-spin text-saffron" />
            <span>Loading gallery...</span>
          </div>
        )}
        {error && (
          <div className="text-center py-24">
            <p className="text-red-500 font-medium">Failed to load gallery</p>
            <p className="text-sm opacity-50 mt-1">{error}</p>
          </div>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(images ?? []).map((img, i) => (
              <motion.div
                key={img.url}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group motion-card relative aspect-square rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
                data-tilt
              >
                <ImageWithFallback
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <div className="space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h4 className="text-2xl font-serif text-white">{img.title}</h4>
                    <div className="w-12 h-1 bg-saffron rounded-full" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto px-6 text-center space-y-12">
        <div className="space-y-4">
          <h3 className="text-3xl font-serif">Follow our Journey</h3>
          <p className="opacity-60">Join our community on Instagram for daily culinary inspiration.</p>
        </div>
        <div className="flex justify-center">
          <a
            href="#"
            className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:scale-105 transition-all shadow-xl shadow-pink-500/20 magnetic-button"
            data-magnetic
          >
            @saffronspice_royal
          </a>
        </div>
      </section>
    </div>
  );
}
