import { motion } from 'motion/react';
import { Star, Leaf, Award, Users } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';

export default function About() {
  return (
    <div className="pt-32 pb-24 space-y-24">
      {/* Hero Section */}
      <section className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif leading-tight"
          >
            A Legacy of <span className="text-saffron italic">Taste & Tradition</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl opacity-70 leading-relaxed"
          >
            Saffron & Spice was born from a simple yet profound desire: to bring the authentic, royal flavors of regional India to the modern table. Our journey began over 15 years ago in the vibrant streets of Silchar, Assam.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-serif">The Culinary Philosophy</h2>
            <p className="text-lg opacity-80 leading-relaxed">
              At Saffron & Spice, we believe that food is more than just sustenance; it's a bridge between cultures and a celebration of heritage. Our culinary philosophy is rooted in three core principles:
            </p>
            <ul className="space-y-6">
              {[
                { title: 'Authenticity', desc: 'We use traditional cooking methods, including slow-cooking in clay ovens (tandoors) and hand-grinding our spice blends.', icon: <Star /> },
                { title: 'Freshness', desc: 'Our ingredients are sourced daily from local farmers, ensuring that every dish is as fresh as it is flavorful.', icon: <Leaf /> },
                { title: 'Innovation', desc: 'While we respect tradition, we are not afraid to innovate, presenting classic dishes with a contemporary flair.', icon: <Award /> }
              ].map((item, i) => (
                <motion.li 
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 bg-saffron/10 rounded-full flex items-center justify-center text-saffron flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-serif text-xl mb-1">{item.title}</h4>
                    <p className="opacity-60">{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl motion-card" data-tilt>
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000" 
              alt="Chef preparing food" 
              className="w-full h-full object-cover"
              data-parallax
              data-parallax-speed="0.05"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-card/50 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-saffron font-medium tracking-widest uppercase text-sm">Our Team</h2>
            <h3 className="text-4xl md:text-5xl font-serif">The Masters of Spice</h3>
            <p className="opacity-60">Meet the talented individuals who bring the magic of Saffron & Spice to your table every day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { name: 'Chef Rajesh Kumar', role: 'Executive Chef', img: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800' },
              { name: 'Chef Meera Iyer', role: 'Head of Pastry', img: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&q=80&w=800' },
              { name: 'Chef Amit Sharma', role: 'Tandoor Specialist', img: 'https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?auto=format&fit=crop&q=80&w=800' }
            ].map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-4 group motion-card rounded-2xl"
                data-tilt
              >
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl mb-6">
                  <ImageWithFallback 
                    src={member.img} 
                    alt={member.name} 
                    fallbackSrc="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <h4 className="text-2xl font-serif">{member.name}</h4>
                <p className="text-saffron font-medium uppercase tracking-widest text-xs">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Happy Diners', value: '50k+', icon: <Users /> },
            { label: 'Signature Dishes', value: '25+', icon: <Star /> },
            { label: 'Awards Won', value: '12', icon: <Award /> },
            { label: 'Cities', value: '3', icon: <Leaf /> }
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-2 motion-card bg-card rounded-2xl border border-subtle p-6"
              data-tilt
            >
              <div className="w-12 h-12 bg-saffron/10 rounded-full flex items-center justify-center text-saffron mx-auto mb-4">
                {stat.icon}
              </div>
              <h4 className="text-4xl font-serif text-saffron">{stat.value}</h4>
              <p className="text-sm opacity-60 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
