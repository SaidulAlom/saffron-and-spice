import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, CreditCard, Smartphone, Banknote, CheckCircle, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MenuItem } from '../constants';
import { isApiError, post } from '../lib/api';
import { getOrderStatusMessage } from '../lib/orders';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { item: MenuItem; quantity: number }[];
  total: number;
  onOrderSuccess: () => void;
}

const INITIAL_DELIVERY = { name: '', phone: '', address: '', city: '', pincode: '' };
type DeliveryForm = typeof INITIAL_DELIVERY;
type DeliveryErrors = Partial<Record<keyof DeliveryForm, string>>;
type PaymentMethod = 'card' | 'upi' | 'cod';

function validateDelivery(d: DeliveryForm): DeliveryErrors {
  const e: DeliveryErrors = {};
  if (!d.name.trim()) e.name = 'Required';
  if (!d.phone.trim()) e.phone = 'Required';
  else if (!/^\+?[\d\s\-]{8,15}$/.test(d.phone)) e.phone = 'Invalid number';
  if (!d.address.trim()) e.address = 'Required';
  if (!d.city.trim()) e.city = 'Required';
  if (!d.pincode.trim()) e.pincode = 'Required';
  else if (!/^\d{6}$/.test(d.pincode)) e.pincode = '6-digit pincode';
  return e;
}

const TAXES = 0.05;

export default function CheckoutModal({ isOpen, onClose, cartItems, total, onOrderSuccess }: CheckoutModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [delivery, setDelivery] = useState<DeliveryForm>(INITIAL_DELIVERY);
  const [deliveryErrors, setDeliveryErrors] = useState<DeliveryErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [serverError, setServerError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  const tax = Math.round(total * TAXES);
  const grandTotal = total + tax;

  const setField = (field: keyof DeliveryForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDelivery(prev => ({ ...prev, [field]: e.target.value }));
    if (deliveryErrors[field]) setDeliveryErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleDeliveryNext = () => {
    const errs = validateDelivery(delivery);
    if (Object.keys(errs).length) { setDeliveryErrors(errs); return; }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setPaymentError('');
    setServerError('');

    if (paymentMethod === 'upi' && !/^[\w.\-]+@[\w]+$/.test(upiId)) {
      setPaymentError('Enter a valid UPI ID (e.g. name@upi)');
      return;
    }
    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) { setPaymentError('Enter a valid 16-digit card number'); return; }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) { setPaymentError('Enter expiry as MM/YY'); return; }
      if (cardCvv.length < 3) { setPaymentError('Enter a valid CVV'); return; }
    }

    setProcessing(true);

    const result = await post<{ orderId: string; grandTotal: number; status: 'placed' }>('/api/orders', {
      delivery,
      items: cartItems.map(({ item, quantity }) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity,
      })),
      paymentMethod,
      subtotal: total,
    });

    setProcessing(false);

    if (isApiError(result)) {
      if (result.fields) {
        setServerError(Object.values(result.fields).join('. '));
      } else {
        setServerError(result.error ?? 'Something went wrong. Please try again.');
      }
      return;
    }

    setPlacedOrderId(result.data.orderId);
    setStep(3);
    onOrderSuccess();
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setDelivery(INITIAL_DELIVERY);
      setDeliveryErrors({});
      setPaymentMethod('card');
      setUpiId(''); setCardNumber(''); setCardExpiry(''); setCardCvv('');
      setPaymentError('');
      setServerError('');
      setPlacedOrderId('');
    }, 300);
  };

  const handleTrackOrder = () => {
    if (!placedOrderId) return;
    handleClose();
    navigate(`/order-lookup?orderId=${encodeURIComponent(placedOrderId)}`);
  };

  const inputCls = (err?: string) =>
    `w-full px-4 py-3 rounded-xl border bg-transparent focus:ring-1 outline-none transition-all text-sm ${
      err ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-subtle focus:border-saffron focus:ring-saffron'
    }`;

  const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={step !== 3 ? handleClose : undefined}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card border border-subtle z-[90] shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            {step !== 3 && (
              <div className="p-5 border-b border-subtle flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  {step === 2 && (
                    <button onClick={() => setStep(1)} className="p-1 hover:text-saffron transition-colors micro-button" aria-label="Back to delivery details">
                      <ChevronLeft size={20} />
                    </button>
                  )}
                  <h2 className="text-xl font-serif">
                    {step === 1 ? 'Delivery Details' : 'Payment'}
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  {/* Step indicator */}
                  <div className="flex items-center gap-1.5">
                    {[1, 2].map(s => (
                      <div key={s} className={`h-1.5 rounded-full transition-all ${s <= step ? 'w-6 bg-saffron' : 'w-3 bg-subtle'}`} />
                    ))}
                  </div>
                  <button onClick={handleClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors micro-button" aria-label="Close checkout">
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-y-auto flex-1">
              <AnimatePresence mode="wait">

                {/* Step 1 — Delivery */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 space-y-4">
                    {/* Order summary */}
                    <div className="bg-saffron/5 border border-saffron/20 rounded-xl p-4 space-y-2">
                      {cartItems.map(({ item, quantity }) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="opacity-70">{item.name} × {quantity}</span>
                          <span className="font-medium">₹{item.price * quantity}</span>
                        </div>
                      ))}
                      <div className="border-t border-saffron/20 pt-2 flex justify-between text-sm opacity-60">
                        <span>Taxes (5%)</span><span>₹{tax}</span>
                      </div>
                      <div className="flex justify-between font-serif text-lg">
                        <span>Total</span><span className="text-saffron">₹{grandTotal}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-medium opacity-60">
                      <MapPin size={14} /> Delivery Address
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2 space-y-1">
                        <input placeholder="Full Name *" value={delivery.name} onChange={setField('name')} className={inputCls(deliveryErrors.name)} />
                        {deliveryErrors.name && <p className="text-red-500 text-xs">{deliveryErrors.name}</p>}
                      </div>
                      <div className="col-span-2 space-y-1">
                        <input placeholder="Phone Number *" value={delivery.phone} onChange={setField('phone')} className={inputCls(deliveryErrors.phone)} />
                        {deliveryErrors.phone && <p className="text-red-500 text-xs">{deliveryErrors.phone}</p>}
                      </div>
                      <div className="col-span-2 space-y-1">
                        <input placeholder="Street Address *" value={delivery.address} onChange={setField('address')} className={inputCls(deliveryErrors.address)} />
                        {deliveryErrors.address && <p className="text-red-500 text-xs">{deliveryErrors.address}</p>}
                      </div>
                      <div className="space-y-1">
                        <input placeholder="City *" value={delivery.city} onChange={setField('city')} className={inputCls(deliveryErrors.city)} />
                        {deliveryErrors.city && <p className="text-red-500 text-xs">{deliveryErrors.city}</p>}
                      </div>
                      <div className="space-y-1">
                        <input placeholder="Pincode *" value={delivery.pincode} onChange={setField('pincode')} maxLength={6} className={inputCls(deliveryErrors.pincode)} />
                        {deliveryErrors.pincode && <p className="text-red-500 text-xs">{deliveryErrors.pincode}</p>}
                      </div>
                    </div>

                    <button onClick={handleDeliveryNext} className="w-full py-4 bg-saffron hover:bg-saffron-dark text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-saffron/20 magnetic-button" data-magnetic>
                      Continue to Payment <ChevronRight size={18} />
                    </button>
                  </motion.div>
                )}

                {/* Step 2 — Payment */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 space-y-5">
                    {/* Payment method selector */}
                    <div className="grid grid-cols-3 gap-3">
                      {([
                        { id: 'card', label: 'Card', icon: <CreditCard size={18} /> },
                        { id: 'upi', label: 'UPI', icon: <Smartphone size={18} /> },
                        { id: 'cod', label: 'Cash on Delivery', icon: <Banknote size={18} /> },
                      ] as { id: PaymentMethod; label: string; icon: React.ReactNode }[]).map(m => (
                        <button
                          key={m.id}
                          onClick={() => { setPaymentMethod(m.id); setPaymentError(''); setServerError(''); }}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all micro-button ${
                            paymentMethod === m.id
                              ? 'border-saffron bg-saffron/10 text-saffron'
                              : 'border-subtle hover:border-saffron/50'
                          }`}
                        >
                          {m.icon} {m.label}
                        </button>
                      ))}
                    </div>

                    {/* Card fields */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-3">
                        <input
                          placeholder="Card Number"
                          value={cardNumber}
                          onChange={e => setCardNumber(formatCard(e.target.value))}
                          className={inputCls()}
                          maxLength={19}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                            className={inputCls()}
                            maxLength={5}
                          />
                          <input
                            placeholder="CVV"
                            value={cardCvv}
                            onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            className={inputCls()}
                            type="password"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    )}

                    {/* UPI field */}
                    {paymentMethod === 'upi' && (
                      <input
                        placeholder="UPI ID (e.g. name@upi)"
                        value={upiId}
                        onChange={e => { setUpiId(e.target.value); setPaymentError(''); }}
                        className={inputCls()}
                      />
                    )}

                    {/* COD note */}
                    {paymentMethod === 'cod' && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm opacity-80">
                        Pay ₹{grandTotal} in cash when your order arrives. Please keep exact change ready.
                      </div>
                    )}

                    {paymentError && <p className="text-red-500 text-sm">{paymentError}</p>}
                    {serverError && (
                      <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                        {serverError}
                      </div>
                    )}

                    <div className="border-t border-subtle pt-4 flex justify-between font-serif text-lg">
                      <span>Amount to Pay</span>
                      <span className="text-saffron">₹{grandTotal}</span>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={processing}
                      className="w-full py-4 bg-saffron hover:bg-saffron-dark disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-saffron/20 magnetic-button"
                      data-magnetic
                    >
                      {processing
                        ? <><Loader2 size={18} className="animate-spin" /> Processing...</>
                        : `Pay ₹${grandTotal}`}
                    </button>
                  </motion.div>
                )}

                {/* Step 3 — Success */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-10 flex flex-col items-center text-center space-y-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
                      className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center"
                    >
                      <CheckCircle className="text-green-500" size={40} />
                    </motion.div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-serif">Order Placed!</h3>
                      <p className="text-sm opacity-60">Order ID: <span className="font-mono font-bold opacity-100">{placedOrderId}</span></p>
                      <p className="opacity-60 max-w-xs text-sm">
                        {getOrderStatusMessage('placed')}{' '}
                        It will be delivered to{' '}
                        <span className="font-medium opacity-100">{delivery.address}, {delivery.city}</span>.
                        Estimated delivery: <span className="font-medium opacity-100">30–45 mins</span>.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button onClick={handleTrackOrder} className="px-8 py-3 bg-saffron hover:bg-saffron-dark text-white rounded-xl font-medium transition-all magnetic-button" data-magnetic>
                        Track Order
                      </button>
                      <button onClick={handleClose} className="px-8 py-3 border border-subtle hover:border-saffron rounded-xl font-medium transition-all micro-button">
                        Done
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
