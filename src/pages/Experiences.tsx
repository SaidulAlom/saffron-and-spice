import { motion } from 'motion/react';
import { ChevronRight, Star, Leaf, Award } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';

export default function Experiences() {
  const experiences = [
    { title: 'Private Dining', desc: 'An intimate setting for your special celebrations. Our private dining rooms offer a secluded space where you can enjoy a bespoke menu tailored to your preferences, accompanied by dedicated service.', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000' },
    { title: 'Chef\'s Table', desc: 'A front-row seat to culinary artistry. Experience a multi-course tasting menu prepared right before your eyes by our Executive Chef, complete with storytelling about the origin of each dish.', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000' },
    { title: 'Spice Workshop', desc: 'Learn the secrets of Indian spices. Join our master chefs for a hands-on workshop where you will discover the art of blending spices and the science behind the perfect curry.', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000' },
    { title: 'Festival Menus', desc: 'Celebrate Indian festivals with royal feasts. From Diwali to Holi, we craft special menus that capture the spirit of the season with traditional delicacies and festive decor.', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=1000' }
  ];

  return (
    <div className="pt-32 pb-24 space-y-24">
      {/* Hero Section */}
      <section className="container mx-auto px-6 text-center space-y-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-serif leading-tight"
        >
          Curated <span className="text-saffron italic">Dining Moments</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl opacity-70 leading-relaxed max-w-2xl mx-auto"
        >
          Beyond just a meal, we offer experiences that linger in your memory. Discover the art of royal Indian hospitality.
        </motion.p>
      </section>

      {/* Experience List */}
      <section className="container mx-auto px-6 space-y-32">
        {experiences.map((exp, i) => (
          <motion.div 
            key={exp.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}
          >
            <div className="lg:w-1/2 aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl group motion-card" data-tilt>
              <ImageWithFallback src={exp.img} alt={exp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" data-parallax data-parallax-speed="0.04" referrerPolicy="no-referrer" />
            </div>
            <div className="lg:w-1/2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-saffron font-medium tracking-widest uppercase text-sm">Experience {i + 1}</h2>
                <h3 className="text-4xl md:text-5xl font-serif">{exp.title}</h3>
              </div>
              <p className="text-lg opacity-80 leading-relaxed">
                {exp.desc}
              </p>
              <div className="flex gap-8">
                <div className="space-y-1">
                  <div className="text-saffron"><Star size={20} /></div>
                  <p className="text-xs font-bold uppercase tracking-widest">Premium</p>
                </div>
                <div className="space-y-1">
                  <div className="text-saffron"><Leaf size={20} /></div>
                  <p className="text-xs font-bold uppercase tracking-widest">Authentic</p>
                </div>
                <div className="space-y-1">
                  <div className="text-saffron"><Award size={20} /></div>
                  <p className="text-xs font-bold uppercase tracking-widest">Exclusive</p>
                </div>
              </div>
              <button className="px-8 py-4 bg-maroon text-white rounded-full font-medium hover:bg-red-900 transition-all flex items-center gap-2 magnetic-button" data-magnetic>
                Inquire Now <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-6">
        <div className="bg-card rounded-3xl p-12 md:p-24 text-center space-y-8 border border-subtle relative overflow-hidden motion-card" data-tilt>
          <div className="absolute inset-0 opacity-5 mandala-bg scale-150" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-serif">Ready for a Royal Feast?</h2>
            <p className="text-xl opacity-70 max-w-2xl mx-auto">Book your table now and experience the finest Indian hospitality in Silchar.</p>
            <button className="px-10 py-4 bg-saffron text-white rounded-full font-medium hover:bg-saffron-dark transition-all transform hover:scale-105 shadow-xl shadow-saffron/20 magnetic-button" data-magnetic>
              Reserve Your Table
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
