import { motion } from 'motion/react';
import { Award, Leaf, Star, Users } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { useSEO } from '../hooks/useSEO';

export default function About() {
  useSEO({
    title: 'About',
    path: '/about',
    description:
      'Read the story, culinary philosophy, and craft decisions behind the Saffron & Spice restaurant showcase.',
    keywords: ['about restaurant website', 'brand story page', 'restaurant portfolio case study', 'culinary philosophy'],
  });

  return (
    <div className="space-y-24 pb-24 pt-28 sm:pt-32">
      <section className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-6 text-center sm:space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl leading-tight sm:text-5xl md:text-7xl"
          >
            A Legacy of <span className="text-saffron italic">Taste &amp; Tradition</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base leading-relaxed opacity-70 sm:text-lg md:text-xl"
          >
            This story page blends heritage-inspired brand language with practical portfolio goals: trust, clarity, and a premium visual rhythm across desktop and mobile.
          </motion.p>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl">The Culinary Philosophy</h2>
            <p className="text-base leading-relaxed opacity-80 sm:text-lg">
              At Saffron &amp; Spice, food is presented as both experience design and cultural storytelling. The result is a polished case-study style page that still feels warm, human, and celebratory.
            </p>
            <ul className="space-y-6">
              {[
                {
                  title: 'Authenticity',
                  desc: 'Traditional techniques like tandoor roasting and house spice grinding shape the brand narrative.',
                  icon: <Star />,
                },
                {
                  title: 'Freshness',
                  desc: 'Ingredient quality and local sourcing reinforce the premium positioning across both copy and visuals.',
                  icon: <Leaf />,
                },
                {
                  title: 'Innovation',
                  desc: 'Modern interaction design gives the experience a portfolio-ready edge without losing warmth.',
                  icon: <Award />,
                },
              ].map((item, index) => (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-saffron/10 text-saffron">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="mb-1 text-xl font-serif">{item.title}</h4>
                    <p className="opacity-60">{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl motion-card" data-tilt>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000"
              alt="Chef preparing food"
              className="h-full w-full object-cover"
              data-parallax
              data-parallax-speed="0.05"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      <section className="bg-card/50 py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto mb-14 max-w-3xl space-y-4 text-center sm:mb-16">
            <h2 className="text-sm font-medium uppercase tracking-widest text-saffron">Our Team</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl">The Masters of Spice</h3>
            <p className="opacity-60">A personality-rich team section gives the project more warmth and makes the brand feel lived in.</p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
            {[
              {
                name: 'Chef Rajesh Kumar',
                role: 'Executive Chef',
                image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800',
              },
              {
                name: 'Chef Meera Iyer',
                role: 'Head of Pastry',
                image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&q=80&w=800',
              },
              {
                name: 'Chef Amit Sharma',
                role: 'Tandoor Specialist',
                image: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?auto=format&fit=crop&q=80&w=800',
              },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="space-y-4 rounded-2xl text-center group motion-card"
                data-tilt
              >
                <div className="mb-6 aspect-[3/4] overflow-hidden rounded-2xl shadow-xl">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    fallbackSrc="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="text-2xl font-serif">{member.name}</h4>
                <p className="text-xs font-medium uppercase tracking-widest text-saffron">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {[
            { label: 'Happy Diners', value: '50k+', icon: <Users /> },
            { label: 'Signature Dishes', value: '25+', icon: <Star /> },
            { label: 'Awards Won', value: '12', icon: <Award /> },
            { label: 'Cities', value: '3', icon: <Leaf /> },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="space-y-2 rounded-2xl border border-subtle bg-card p-5 text-center md:p-6 motion-card"
              data-tilt
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-saffron/10 text-saffron">
                {stat.icon}
              </div>
              <h4 className="text-3xl font-serif text-saffron sm:text-4xl">{stat.value}</h4>
              <p className="text-xs uppercase tracking-widest opacity-60 sm:text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
