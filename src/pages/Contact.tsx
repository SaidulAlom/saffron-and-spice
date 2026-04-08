import { useState } from 'react';
import { motion } from 'motion/react';
import { Facebook, Instagram, Loader2, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { isApiError, post } from '../lib/api';

const INITIAL = { name: '', email: '', phone: '', guests: '2 Guests', message: '' };
type Form = typeof INITIAL;
type Errors = Partial<Record<keyof Form, string>>;

function validate(form: Form): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email';
  if (form.phone && !/^\+?[\d\s-]{8,15}$/.test(form.phone)) errors.phone = 'Invalid phone number';
  if (!form.message.trim()) errors.message = 'Message is required';
  return errors;
}

export default function Contact() {
  useSEO({
    title: 'Contact',
    path: '/contact',
    description: 'Contact Saffron & Spice for reservations, private dining enquiries, and group events.',
    keywords: ['restaurant contact page', 'reservation form', 'group dining inquiry', 'restaurant portfolio contact'],
  });

  const [form, setForm] = useState<Form>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle');

  const setField = (field: keyof Form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

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

    setForm(INITIAL);
    setErrors({});
    setStatus('sent');
  };

  const inputClass = (field: keyof Form) =>
    `w-full rounded-xl border bg-transparent px-4 py-3 outline-none transition-all focus:border-saffron ${
      errors[field] ? 'border-red-500' : 'border-subtle'
    }`;

  return (
    <div className="space-y-24 pb-24 pt-28 sm:pt-32">
      <section className="container mx-auto px-4 text-center space-y-6 sm:px-6 sm:space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl leading-tight sm:text-5xl md:text-7xl"
        >
          Get in <span className="text-saffron italic">Touch</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-3xl text-base leading-relaxed opacity-70 sm:text-lg md:text-xl"
        >
          Whether you are booking a dinner, planning a group event, or reviewing the portfolio flow, this form is wired to a real backend and polished for clear loading and success states.
        </motion.p>
      </section>

      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col overflow-hidden rounded-3xl border border-subtle bg-card shadow-2xl lg:flex-row motion-card">
          <div className="space-y-8 p-8 md:p-12 lg:w-1/2">
            <div className="space-y-4">
              <h2 className="text-sm font-medium uppercase tracking-widest text-saffron">Send a Message</h2>
              <h3 className="text-3xl font-serif sm:text-4xl">Reservations &amp; Private Dining</h3>
              <p className="opacity-60">Book your table online or send a detailed enquiry for celebrations, tastings, and special events.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {status === 'sent' ? (
                <div className="space-y-4 rounded-2xl border border-saffron/20 bg-saffron/5 p-6 text-center">
                  <p className="text-2xl font-serif text-saffron">Message Sent</p>
                  <p className="opacity-70">We&apos;ll get back to you within 24 hours.</p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="rounded-full border border-saffron px-5 py-2.5 text-sm font-medium text-saffron transition-all hover:bg-saffron hover:text-white micro-button"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  {serverError && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                      {serverError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                      <input
                        type="text"
                        placeholder="Your Name *"
                        value={form.name}
                        onChange={setField('name')}
                        className={inputClass('name')}
                      />
                      {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-1">
                      <input
                        type="email"
                        placeholder="Your Email *"
                        value={form.email}
                        onChange={setField('email')}
                        className={inputClass('email')}
                      />
                      {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-1">
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={setField('phone')}
                        className={inputClass('phone')}
                      />
                      {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                    </div>
                    <select value={form.guests} onChange={setField('guests')} className={inputClass('guests')}>
                      <option>2 Guests</option>
                      <option>4 Guests</option>
                      <option>6+ Guests</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <textarea
                      placeholder="Message or special requests *"
                      rows={5}
                      value={form.message}
                      onChange={setField('message')}
                      className={`${inputClass('message')} resize-none`}
                    />
                    {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-saffron py-4 font-medium text-white shadow-lg shadow-saffron/20 transition-all hover:bg-saffron-dark disabled:cursor-not-allowed disabled:opacity-70 magnetic-button"
                    data-magnetic
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Inquiry'
                    )}
                  </button>
                </>
              )}
            </form>
          </div>

          <div className="relative space-y-10 overflow-hidden bg-maroon p-8 text-white md:p-12 lg:w-1/2">
            <div className="absolute inset-0 scale-150 opacity-10 mandala-bg" />
            <div className="relative space-y-10">
              <div className="space-y-6">
                <h3 className="text-3xl font-serif">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="mt-1 text-gold" size={20} />
                    <p className="opacity-80">
                      123 Royal Palace Road, Silchar,
                      <br />
                      Assam 788001, India
                    </p>
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
                <div className="space-y-3 opacity-80">
                  <div className="flex flex-col gap-1 border-b border-white/10 pb-2 sm:flex-row sm:items-center sm:justify-between">
                    <span>Mon - Thu</span>
                    <span>12:00 PM - 11:00 PM</span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-white/10 pb-2 sm:flex-row sm:items-center sm:justify-between">
                    <span>Fri - Sun</span>
                    <span>12:00 PM - 12:00 AM</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                {[
                  { label: 'Instagram', href: 'https://instagram.com/saffronspice_royal', Icon: Instagram },
                  { label: 'Facebook', href: 'https://facebook.com/saffronspiceroyal', Icon: Facebook },
                  { label: 'YouTube', href: 'https://youtube.com/@saffronspiceroyal', Icon: Youtube },
                ].map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-gold hover:text-maroon micro-button"
                    aria-label={label}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6">
        <div className="h-80 overflow-hidden rounded-3xl border border-subtle grayscale transition-all duration-700 hover:grayscale-0 sm:h-96 motion-card" data-tilt>
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
