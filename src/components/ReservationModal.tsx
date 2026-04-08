import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Users, Clock, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import { isApiError, post } from '../lib/api';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  guests: '2',
  date: '',
  time: '7:00 PM',
  requests: '',
};

type FormData = typeof INITIAL_FORM;
type Errors = Partial<Record<keyof FormData, string>>;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  if (!data.name.trim()) errors.name = 'Name is required';
  if (!data.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email';
  if (!data.phone.trim()) errors.phone = 'Phone is required';
  if (!data.date) errors.date = 'Please select a date';
  else if (new Date(data.date) < new Date(new Date().toDateString())) errors.date = 'Date must be in the future';
  return errors;
}

export default function ReservationModal({ isOpen, onClose }: ReservationModalProps) {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
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

    const result = await post('/api/reservations', {
      name: form.name,
      email: form.email,
      phone: form.phone,
      guests: form.guests,
      date: form.date,
      time: form.time,
      requests: form.requests || undefined,
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

    setStatus('success');
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setForm(INITIAL_FORM); setErrors({}); setStatus('idle'); setServerError(''); }, 300);
  };

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl border bg-transparent focus:ring-1 outline-none transition-all ${
      errors[field]
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-subtle focus:border-saffron focus:ring-saffron'
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-card border border-subtle z-[90] shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto motion-card"
          >
            {/* Header */}
            <div className="relative h-48 bg-maroon flex items-center justify-center overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 opacity-20 mandala-bg scale-150" />
              <div className="relative text-center text-white p-6">
                <h2 className="text-4xl font-serif mb-2">Reserve a Table</h2>
                <p className="text-gold-light/80">Experience the royal hospitality of Saffron & Spice</p>
              </div>
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors micro-button"
                aria-label="Close reservation modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Success State */}
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-12 flex flex-col items-center text-center space-y-6"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="text-green-500" size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-serif">Reservation Confirmed!</h3>
                    <p className="opacity-60 max-w-sm">
                      Thank you, <span className="font-medium opacity-100">{form.name}</span>. We've sent a confirmation to{' '}
                      <span className="font-medium opacity-100">{form.email}</span>. We look forward to welcoming you on{' '}
                      <span className="font-medium opacity-100">{new Date(form.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span> at{' '}
                      <span className="font-medium opacity-100">{form.time}</span>.
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="px-8 py-3 bg-maroon hover:bg-red-900 text-white rounded-xl font-medium transition-all magnetic-button"
                    data-magnetic
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {serverError && (
                    <div className="md:col-span-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                      {serverError}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-sm font-medium opacity-70">Full Name</label>
                    <input type="text" placeholder="John Doe" value={form.name} onChange={set('name')} className={inputClass('name')} />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium opacity-70">Email Address</label>
                    <input type="email" placeholder="john@example.com" value={form.email} onChange={set('email')} className={inputClass('email')} />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium opacity-70">Phone Number</label>
                    <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} className={inputClass('phone')} />
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium opacity-70">Number of Guests</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
                      <select value={form.guests} onChange={set('guests')} className={`pl-12 pr-4 appearance-none ${inputClass('guests')}`}>
                        {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                        <option value="11+">11+ Guests (Group Booking)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium opacity-70">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
                      <input
                        type="date"
                        value={form.date}
                        onChange={set('date')}
                        min={new Date().toISOString().split('T')[0]}
                        className={`pl-12 pr-4 ${inputClass('date')}`}
                      />
                    </div>
                    {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium opacity-70">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={18} />
                      <select value={form.time} onChange={set('time')} className={`pl-12 pr-4 appearance-none ${inputClass('time')}`}>
                        {['12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM',
                          '7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM','10:00 PM'].map(t => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-sm font-medium opacity-70">Special Requests</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 opacity-40" size={18} />
                      <textarea
                        placeholder="Any allergies or special occasions?"
                        rows={3}
                        value={form.requests}
                        onChange={set('requests')}
                        className={`pl-12 pr-4 resize-none ${inputClass('requests')}`}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-2">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-4 bg-maroon hover:bg-red-900 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-xl flex items-center justify-center gap-2 magnetic-button"
                      data-magnetic
                    >
                      {status === 'loading' ? (
                        <><Loader2 size={18} className="animate-spin" /> Confirming...</>
                      ) : 'Confirm Reservation'}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
