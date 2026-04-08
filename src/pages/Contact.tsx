import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Loader2 } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { isApiError, post } from '../lib/api';

const INITIAL = { name: '', email: '', phone: '', guests: '2', message: '' };
type Form = typeof INITIAL;
type Errors = Partial<Record<keyof Form, string>>;

function validate(f: Form): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = 'Name is required';
  if (!f.email.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Invalid email';
  if (f.phone && !/^\+?[\d\s\-]{8,15}$/.test(f.phone)) e.phone = 'Invalid phone number';
  if (!f.message.trim()) e.message = 'Message is required';
  return e;
}

export default function Contact() {
  useSEO({ title: 'Contact', description: 'Contact Saffron & Spice for reservations, group bookings, or general enquiries.' });
  const [form, setForm] = useState<Form>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle');

  const set = (field: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('loading');
    setServerError('');

    const result = await post('/api/contact', {
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      guests: form.guests,
      message: form.message,
    });

    if (isApiError(result)) {
      setStatus('idle');
      if (result.fields) {
        setErrors(result.fields as Errors);
      } else {
        setServerError(result.error ?? 'Something went wrong. Please try again.');
      }
      return;
    }

    setStatus('sent');
  };

  const inputCls = (field: keyof Form) =>
    `w-full px-4 py-3 rounded-xl border bg-transparent focus:border-saffron outline-none transition-all ${
      errors[field] ? 'border-red-500' : 'border-subtle'
    }`;

  return (
    <div className="pt-32 pb-24 space-y-24">
      {/* Hero Section */}
      <section className="container mx-auto px-6 text-center space-y-8">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-serif leading-tight"
        >
          Get in <span className="text-saffron italic">Touch</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl opacity-70 leading-relaxed max-w-2xl mx-auto"
        >
          Have a question or want to book a special event? We are here to help you experience the best of Indian fine dining.
        </motion.p>
      </section>

      {/* Contact & Reservation Section */}
      <section className="container mx-auto px-6">
        <div className="bg-card rounded-3xl overflow-hidden border border-subtle shadow-2xl flex flex-col lg:flex-row motion-card">
          <div className="lg:w-1/2 p-8 md:p-12 space-y-8">
            <div className="space-y-4">
              <h2 className="text-saffron font-medium tracking-widest uppercase text-sm">Send a Message</h2>
              <h3 className="text-4xl font-serif">Table Reservation</h3>
              <p className="opacity-60">Book your table online or contact us for group inquiries.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {status === 'sent' ? (
                <div className="py-8 text-center space-y-2">
                  <p className="text-2xl font-serif text-saffron">Message Sent!</p>
                  <p className="opacity-60">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
              <>
              {serverError && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                  {serverError}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <input type="text" placeholder="Your Name *" value={form.name} onChange={set('name')} className={inputCls('name')} />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                </div>
                <div className="space-y-1">
                  <input type="email" placeholder="Your Email *" value={form.email} onChange={set('email')} className={inputCls('email')} />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <input type="tel" placeholder="Phone Number" value={form.phone} onChange={set('phone')} className={inputCls('phone')} />
                  {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                </div>
                <select value={form.guests} onChange={set('guests')} className={inputCls('guests')}>
                  <option>2 Guests</option>
                  <option>4 Guests</option>
                  <option>6+ Guests</option>
                </select>
              </div>
              <div className="space-y-1">
                <textarea placeholder="Message or Special Requests *" rows={4} value={form.message} onChange={set('message')} className={`${inputCls('message')} resize-none`} />
                {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-saffron hover:bg-saffron-dark disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-lg shadow-saffron/20 magnetic-button flex items-center justify-center gap-2"
                data-magnetic
              >
                {status === 'loading' ? (
                  <><Loader2 size={18} className="animate-spin" /> Sending...</>
                ) : 'Send Inquiry'}
              </button>
              </>
              )}
            </form>
          </div>

          <div className="lg:w-1/2 bg-maroon text-white p-8 md:p-12 space-y-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 mandala-bg scale-150" />
            <div className="relative space-y-8">
              <div className="space-y-6">
                <h3 className="text-3xl font-serif">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-gold mt-1" size={20} />
                    <p className="opacity-80">123 Royal Palace Road, Silchar,<br />Assam 788001, India</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="text-gold" size={20} />
                    <p className="opacity-80">+91 3842 245 678</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="text-gold" size={20} />
                    <p className="opacity-80">hello@saffronspice.com</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-3xl font-serif">Opening Hours</h3>
                <div className="space-y-2 opacity-80">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span>Mon - Thu</span>
                    <span>12:00 PM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span>Fri - Sun</span>
                    <span>12:00 PM - 12:00 AM</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                {[Instagram, Facebook, Youtube].map((Icon, i) => (
                  <a key={['instagram','facebook','youtube'][i]} href="#" className="w-10 h-10 bg-white/10 hover:bg-gold hover:text-maroon rounded-full flex items-center justify-center transition-all micro-button" aria-label={['Instagram','Facebook','YouTube'][i]}>
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="container mx-auto px-6">
        <div className="h-96 rounded-3xl overflow-hidden border border-subtle grayscale hover:grayscale-0 transition-all duration-700 motion-card" data-tilt>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.318469317544!2d92.7989!3d24.8333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x374e4a7a7a7a7a7a%3A0x7a7a7a7a7a7a7a7a!2sSilchar%2C%20Assam!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
