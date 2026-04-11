import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Clock3, Loader2, MapPin, Phone, Receipt, Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';
import { isApiError, post } from '../lib/api';
import {
  ORDER_LIFECYCLE,
  formatOrderStatus,
  formatPaymentMethod,
  getOrderStageIndex,
  getOrderStatusMessage,
  isOrderStatus,
  type OrderStatus,
} from '../lib/orders';

const ORDER_ID_RE = /^SS-\d{8}-[A-F0-9]{8}$/i;
const INITIAL_FORM = { orderId: '', phone: '' };

interface LookupForm {
  orderId: string;
  phone: string;
}

type LookupErrors = Partial<Record<keyof LookupForm, string>>;

interface LookupOrder {
  orderId: string;
  customerName: string;
  status: OrderStatus;
  placedAt: string;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  total: number;
  delivery: {
    address: string;
    city: string;
    pincode: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

function validate(form: LookupForm): LookupErrors {
  const errors: LookupErrors = {};

  if (!form.orderId.trim()) errors.orderId = 'Order ID is required';
  else if (!ORDER_ID_RE.test(form.orderId.trim().toUpperCase())) {
    errors.orderId = 'Use the format SS-YYYYMMDD-XXXXXXXX';
  }

  if (!form.phone.trim()) errors.phone = 'Phone number is required';
  else if (!/^\+?[\d\s-]{8,15}$/.test(form.phone.trim())) {
    errors.phone = 'Enter the phone number used during checkout';
  }

  return errors;
}

function formatCurrency(value: number): string {
  return `Rs. ${new Intl.NumberFormat('en-IN').format(value)}`;
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function statusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case 'confirmed':
      return 'border-gold/30 bg-gold/10 text-gold';
    case 'preparing':
      return 'border-maroon/20 bg-maroon/10 text-maroon dark:text-red-200';
    case 'out_for_delivery':
      return 'border-saffron/30 bg-saffron/10 text-saffron';
    case 'delivered':
      return 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400';
    case 'cancelled':
      return 'border-red-500/30 bg-red-500/10 text-red-500';
    case 'placed':
    default:
      return 'border-saffron/20 bg-saffron/5 text-saffron';
  }
}

export default function OrderLookup() {
  useSEO({
    title: 'Track Order',
    path: '/order-lookup',
    description: 'Look up a Saffron & Spice order with your order ID and phone number to see its live lifecycle status.',
    keywords: ['order lookup', 'track restaurant order', 'order status page', 'Saffron and Spice order tracking'],
  });

  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<LookupForm>(() => ({
    ...INITIAL_FORM,
    orderId: searchParams.get('orderId')?.toUpperCase() ?? '',
  }));
  const [errors, setErrors] = useState<LookupErrors>({});
  const [serverError, setServerError] = useState('');
  const [lookupState, setLookupState] = useState<'idle' | 'loading' | 'loaded'>('idle');
  const [order, setOrder] = useState<LookupOrder | null>(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId')?.toUpperCase();
    if (!orderId) return;

    setForm(prev => (prev.orderId === orderId ? prev : { ...prev, orderId }));
  }, [searchParams]);

  const setField = (field: keyof LookupForm) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForm(prev => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (serverError) setServerError('');
    if (order) {
      setOrder(null);
      setLookupState('idle');
    }
  };

  const handleLookup = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLookupState('loading');
    setServerError('');

    const result = await post<{ order: Omit<LookupOrder, 'status'> & { status: string } }>('/api/orders/lookup', {
      orderId: form.orderId.trim().toUpperCase(),
      phone: form.phone.trim(),
    });

    if (isApiError(result)) {
      setLookupState('idle');
      setOrder(null);
      if (result.fields) {
        setErrors(result.fields as LookupErrors);
      } else {
        setServerError(result.error ?? 'We could not find that order right now.');
      }
      return;
    }

    const nextOrder = result.data.order;
    setOrder({
      ...nextOrder,
      status: isOrderStatus(nextOrder.status) ? nextOrder.status : 'placed',
    });
    setLookupState('loaded');
  };

  const currentStageIndex = order ? getOrderStageIndex(order.status) : 0;

  return (
    <div className="space-y-24 pb-24 pt-28 sm:pt-32">
      <section className="container mx-auto px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-4xl space-y-6"
        >
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-saffron">Order Tracking</p>
          <h1 className="text-4xl leading-tight sm:text-5xl md:text-7xl">
            Find your <span className="text-saffron italic">latest order</span>
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed opacity-70 sm:text-lg md:text-xl">
            Enter the order ID from checkout and the phone number used during checkout to see where your meal is in the lifecycle.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-subtle bg-card p-8 shadow-2xl md:p-10 motion-card"
          >
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-saffron">Lookup Details</p>
              <h2 className="text-3xl font-serif sm:text-4xl">Track the real order status</h2>
              <p className="max-w-2xl opacity-65">
                Orders now move through placed, confirmed, preparing, out for delivery, and delivered. This page reads the current backend status instead of showing a hardcoded success state.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleLookup} noValidate>
              <div className="space-y-1.5">
                <label htmlFor="order-id" className="text-sm font-medium">Order ID</label>
                <input
                  id="order-id"
                  type="text"
                  placeholder="SS-20260411-ABC123EF"
                  value={form.orderId}
                  onChange={setField('orderId')}
                  className={`w-full rounded-xl border bg-transparent px-4 py-3 outline-none transition-all focus:border-saffron ${
                    errors.orderId ? 'border-red-500' : 'border-subtle'
                  }`}
                />
                {errors.orderId && <p className="text-xs text-red-500">{errors.orderId}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="lookup-phone" className="text-sm font-medium">Phone Number</label>
                <input
                  id="lookup-phone"
                  type="tel"
                  placeholder="Phone used during checkout"
                  value={form.phone}
                  onChange={setField('phone')}
                  className={`w-full rounded-xl border bg-transparent px-4 py-3 outline-none transition-all focus:border-saffron ${
                    errors.phone ? 'border-red-500' : 'border-subtle'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>

              {serverError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={lookupState === 'loading'}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-saffron py-4 font-medium text-white shadow-lg shadow-saffron/20 transition-all hover:bg-saffron-dark disabled:cursor-not-allowed disabled:opacity-70 magnetic-button"
                data-magnetic
              >
                {lookupState === 'loading' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Checking Order...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Look Up Order
                  </>
                )}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl bg-maroon p-8 text-white shadow-2xl md:p-10"
          >
            <div className="absolute inset-0 scale-150 opacity-10 mandala-bg" />
            <div className="relative space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold-light">Lifecycle</p>
                <h2 className="text-3xl font-serif sm:text-4xl">What each status means</h2>
              </div>

              <div className="space-y-4">
                {ORDER_LIFECYCLE.map((stage, index) => (
                  <div key={stage.status} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 font-serif text-lg">
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{stage.label}</p>
                      <p className="text-sm text-white/70">{stage.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/10 p-5 text-sm text-white/75">
                Use the same phone number you entered during checkout. That keeps the lookup private even if someone else sees your order ID.
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {order && (
        <section className="container mx-auto space-y-8 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-subtle bg-card p-8 shadow-2xl md:p-10"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div className={`inline-flex rounded-full border px-4 py-2 text-sm font-medium ${statusBadgeClass(order.status)}`}>
                  {formatOrderStatus(order.status)}
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif sm:text-4xl">Order {order.orderId}</h2>
                  <p className="max-w-2xl text-base opacity-70">{getOrderStatusMessage(order.status)}</p>
                </div>
              </div>

              <div className="grid gap-3 text-sm opacity-75 sm:grid-cols-3 lg:min-w-[420px]">
                <div className="rounded-2xl border border-subtle bg-black/5 p-4 dark:bg-white/5">
                  <div className="mb-2 flex items-center gap-2 font-medium text-saffron">
                    <Clock3 size={16} />
                    Placed
                  </div>
                  <p>{formatDateTime(order.placedAt)}</p>
                </div>
                <div className="rounded-2xl border border-subtle bg-black/5 p-4 dark:bg-white/5">
                  <div className="mb-2 flex items-center gap-2 font-medium text-saffron">
                    <Phone size={16} />
                    Customer
                  </div>
                  <p>{order.customerName}</p>
                </div>
                <div className="rounded-2xl border border-subtle bg-black/5 p-4 dark:bg-white/5">
                  <div className="mb-2 flex items-center gap-2 font-medium text-saffron">
                    <Receipt size={16} />
                    Total
                  </div>
                  <p>{formatCurrency(order.total)}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {order.status === 'cancelled' ? (
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-500 shadow-xl">
              This order was cancelled. If you need help, please call the restaurant and share your order ID.
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="grid gap-4 md:grid-cols-5"
            >
              {ORDER_LIFECYCLE.map((stage, index) => {
                const isReached = index <= currentStageIndex;
                const isCurrent = index === currentStageIndex;

                return (
                  <div
                    key={stage.status}
                    className={`rounded-3xl border p-5 shadow-xl transition-all ${
                      isCurrent
                        ? 'border-saffron bg-saffron/10'
                        : isReached
                          ? 'border-saffron/20 bg-card'
                          : 'border-subtle bg-card/80 opacity-75'
                    }`}
                  >
                    <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${
                      isReached ? 'bg-saffron text-white' : 'bg-black/5 text-foreground dark:bg-white/10'
                    }`}>
                      {index + 1}
                    </div>
                    <p className="font-medium">{stage.label}</p>
                    <p className="mt-2 text-sm opacity-65">{stage.description}</p>
                  </div>
                );
              })}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]"
          >
            <div className="rounded-3xl border border-subtle bg-card p-8 shadow-2xl">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-saffron">Items</p>
                  <h3 className="mt-2 text-3xl font-serif">Order Summary</h3>
                </div>
                <div className="rounded-full border border-subtle px-4 py-2 text-sm opacity-70">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={`${order.orderId}-${item.id}`} className="flex items-start justify-between gap-4 rounded-2xl border border-subtle p-4">
                    <div className="space-y-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm opacity-60">{formatCurrency(item.price)} each</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">x{item.quantity}</p>
                      <p className="text-sm text-saffron">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 rounded-2xl border border-subtle bg-black/5 p-5 dark:bg-white/5">
                <div className="flex items-center justify-between text-sm opacity-70">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm opacity-70">
                  <span>Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex items-center justify-between text-lg font-serif">
                  <span>Total</span>
                  <span className="text-saffron">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="rounded-3xl border border-subtle bg-card p-8 shadow-2xl">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-saffron">Delivery</p>
                <h3 className="mt-2 text-3xl font-serif">Drop-off Details</h3>

                <div className="mt-6 rounded-2xl border border-subtle bg-black/5 p-5 dark:bg-white/5">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-saffron">
                    <MapPin size={16} />
                    Delivery Address
                  </div>
                  <p className="leading-relaxed opacity-75">
                    {order.delivery.address}
                    <br />
                    {order.delivery.city} - {order.delivery.pincode}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-subtle bg-card p-8 shadow-2xl">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-saffron">Payment</p>
                <h3 className="mt-2 text-3xl font-serif">Checkout Details</h3>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-subtle p-4">
                    <p className="text-sm opacity-60">Method</p>
                    <p className="mt-1 font-medium">{formatPaymentMethod(order.paymentMethod)}</p>
                  </div>
                  <div className="rounded-2xl border border-subtle p-4">
                    <p className="text-sm opacity-60">Tracking Tip</p>
                    <p className="mt-1 opacity-75">
                      Save this order ID if you want to revisit the tracking page later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
}
