import { motion } from 'motion/react';
import { Award, ChevronRight, Leaf, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { useSEO } from '../hooks/useSEO';

const experiences = [
  {
    title: 'Private Dining',
    description:
      'An intimate setting for celebrations, featuring bespoke menus, dedicated service, and a layout that highlights premium hospitality.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: "Chef's Table",
    description:
      'A storytelling-led tasting experience that turns menu discovery into a memorable guided journey for guests and portfolio viewers alike.',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: 'Spice Workshop',
    description:
      'A hands-on concept built around education, flavor, and craft, giving the page variety beyond standard reservation and ordering flows.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000',
  },
  {
    title: 'Festival Menus',
    description:
      'Seasonal menus and celebratory plating that reinforce the brand identity and help the project feel dynamic rather than static.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=1000',
  },
];

export default function Experiences() {
  useSEO({
    title: 'Experiences',
    path: '/experiences',
    description:
      'Explore the immersive dining experiences that round out the Saffron & Spice restaurant showcase.',
    keywords: ['restaurant experiences page', 'private dining website', 'chef table showcase', 'premium restaurant portfolio'],
  });

  return (
    <div className="space-y-24 pb-24 pt-28 sm:pt-32">
      <section className="container mx-auto px-4 text-center space-y-6 sm:px-6 sm:space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl leading-tight sm:text-5xl md:text-7xl"
        >
          Curated <span className="text-saffron italic">Dining Moments</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-3xl text-base leading-relaxed opacity-70 sm:text-lg md:text-xl"
        >
          Beyond a menu and checkout flow, this project uses experience-led storytelling to make the brand feel elevated, memorable, and ready for portfolio presentation.
        </motion.p>
      </section>

      <section className="container mx-auto space-y-24 px-4 sm:px-6 lg:space-y-32">
        {experiences.map((experience, index) => (
          <motion.div
            key={experience.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col items-center gap-10 lg:gap-16 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
          >
            <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-2xl lg:w-1/2 group motion-card" data-tilt>
              <ImageWithFallback
                src={experience.image}
                alt={experience.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                data-parallax
                data-parallax-speed="0.04"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="w-full space-y-6 lg:w-1/2 lg:space-y-8">
              <div className="space-y-4">
                <h2 className="text-sm font-medium uppercase tracking-widest text-saffron">Experience {index + 1}</h2>
                <h3 className="text-3xl sm:text-4xl md:text-5xl">{experience.title}</h3>
              </div>
              <p className="text-base leading-relaxed opacity-80 sm:text-lg">
                {experience.description}
              </p>
              <div className="grid grid-cols-3 gap-4 sm:flex sm:flex-wrap sm:gap-8">
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
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-maroon px-8 py-4 font-medium text-white transition-all hover:bg-red-900 magnetic-button"
                data-magnetic
              >
                Inquire Now <ChevronRight size={18} />
              </Link>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="container mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-subtle bg-card p-8 text-center sm:p-12 md:p-20 motion-card" data-tilt>
          <div className="absolute inset-0 scale-150 opacity-5 mandala-bg" />
          <div className="relative z-10 space-y-6 sm:space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-6xl">Ready for a Royal Feast?</h2>
            <p className="mx-auto max-w-2xl text-base opacity-70 sm:text-lg md:text-xl">
              Book your table now and explore the full guest journey, from polished landing pages to reservation and ordering flows.
            </p>
            <Link
              to="/contact"
              className="inline-flex rounded-full bg-saffron px-10 py-4 font-medium text-white shadow-xl shadow-saffron/20 transition-all hover:scale-105 hover:bg-saffron-dark magnetic-button"
              data-magnetic
            >
              Reserve Your Table
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
