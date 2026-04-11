import { Router } from 'express';
import { randomBytes } from 'node:crypto';
import { getSupabase, SUPABASE_UNAVAILABLE_MESSAGE } from '../lib/supabase.js';
import { ok, validationError, fail } from '../lib/respond.js';
import * as v from '../lib/validate.js';

const router = Router();

/** Generate a stable, human-readable order ID: SS-YYYYMMDD-XXXXXXXX */
function generateOrderId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = randomBytes(4).toString('hex').toUpperCase();
  return `SS-${date}-${rand}`;
}

const ORDER_ID_RE = /^SS-\d{8}-[A-F0-9]{8}$/;
const VALID_PAYMENT_METHODS = new Set(['card', 'upi', 'cod']);
const ORDER_STATUSES = [
  'placed',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled',
] as const;
type OrderStatus = typeof ORDER_STATUSES[number];
const VALID_ORDER_STATUSES = new Set<string>(ORDER_STATUSES);

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

function normalizePhone(value: string): string {
  return value.replace(/\D/g, '');
}

function normalizeOrderId(value: string): string {
  return value.trim().toUpperCase();
}

function validateOrderId(value: unknown): string | undefined {
  const e = v.required(value, 'Order ID');
  if (e) return e;
  if (!ORDER_ID_RE.test(normalizeOrderId(String(value)))) {
    return 'Invalid order ID';
  }
  return undefined;
}

function normalizeStatus(value: unknown): OrderStatus {
  if (typeof value === 'string' && VALID_ORDER_STATUSES.has(value)) {
    return value as OrderStatus;
  }
  return 'placed';
}

router.post('/', async (req, res) => {
  const { delivery, items, paymentMethod, subtotal } = req.body ?? {};

  // ── Validate delivery ───────────────────────────────────────────────────
  const d = delivery ?? {};
  const deliveryErrors = v.collect([
    [v.required(d.name,    'Name'),    'name'],
    [v.phone(d.phone),                 'phone'],
    [v.required(d.address, 'Address'), 'address'],
    [v.required(d.city,    'City'),    'city'],
    [v.pincode(d.pincode),             'pincode'],
  ]);
  if (deliveryErrors) { validationError(res, deliveryErrors); return; }

  // ── Validate payment method ─────────────────────────────────────────────
  if (!paymentMethod || !VALID_PAYMENT_METHODS.has(String(paymentMethod))) {
    validationError(res, { paymentMethod: 'Invalid payment method' });
    return;
  }

  // ── Validate items ──────────────────────────────────────────────────────
  if (!Array.isArray(items) || items.length === 0) {
    validationError(res, { items: 'Order must contain at least one item' });
    return;
  }

  for (const item of items as CartItem[]) {
    if (!item.id || !item.name || typeof item.price !== 'number' || item.price < 0) {
      validationError(res, { items: 'One or more items are invalid' });
      return;
    }
    const qErr = v.positiveInt(item.quantity, 'Quantity');
    if (qErr) { validationError(res, { items: qErr }); return; }
  }

  // ── Validate subtotal ───────────────────────────────────────────────────
  if (typeof subtotal !== 'number' || subtotal < 0) {
    validationError(res, { subtotal: 'Invalid subtotal' });
    return;
  }

  // Cross-check: server recomputes totals from items (±1 rupee for rounding)
  const computedSubtotal = (items as CartItem[]).reduce(
    (sum, i) => sum + i.price * i.quantity, 0,
  );
  if (Math.abs(subtotal - computedSubtotal) > 1) {
    validationError(res, { subtotal: 'Subtotal does not match item prices' });
    return;
  }

  // ── Persist ─────────────────────────────────────────────────────────────
  const orderId       = generateOrderId();
  const computedTax   = Math.round(computedSubtotal * 0.05);
  const computedTotal = computedSubtotal + computedTax;
  const supabase = getSupabase();

  if (!supabase) {
    fail(res, 503, SUPABASE_UNAVAILABLE_MESSAGE);
    return;
  }

  // Insert order header
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_id:       orderId,
      customer_name:  String(d.name).trim(),
      customer_phone: String(d.phone).trim(),
      address:        String(d.address).trim(),
      city:           String(d.city).trim(),
      pincode:        String(d.pincode).trim(),
      payment_method: String(paymentMethod),
      subtotal:       computedSubtotal,
      tax:            computedTax,
      total:          computedTotal,
      status:         'placed',
    })
    .select('id')
    .single();

  if (orderError || !order) {
    console.error('[orders] order insert error:', orderError?.message);
    fail(res, 500, 'Failed to create order. Please try again.');
    return;
  }

  // Insert order items
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(
      (items as CartItem[]).map(item => ({
        order_id:  order.id,
        item_id:   String(item.id),
        item_name: String(item.name),
        price:     item.price,
        quantity:  item.quantity,
      })),
    );

  if (itemsError) {
    console.error('[orders] items insert error:', itemsError.message);
    // Roll back the orphaned order row
    await supabase.from('orders').delete().eq('id', order.id);
    fail(res, 500, 'Failed to save order items. Please try again.');
    return;
  }

  ok(res, { orderId, grandTotal: computedTotal, status: 'placed' }, 201);
});

router.post('/lookup', async (req, res) => {
  const { orderId, phone } = req.body ?? {};
  const errors = v.collect([
    [validateOrderId(orderId), 'orderId'],
    [v.phone(phone), 'phone'],
  ]);

  if (errors) {
    validationError(res, errors);
    return;
  }

  const supabase = getSupabase();
  if (!supabase) {
    fail(res, 503, SUPABASE_UNAVAILABLE_MESSAGE);
    return;
  }

  const normalizedOrderId = normalizeOrderId(String(orderId));
  const normalizedPhone = normalizePhone(String(phone));

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(`
      id,
      order_id,
      customer_name,
      customer_phone,
      address,
      city,
      pincode,
      payment_method,
      subtotal,
      tax,
      total,
      status,
      created_at
    `)
    .eq('order_id', normalizedOrderId)
    .maybeSingle();

  if (orderError) {
    console.error('[orders] lookup error:', orderError.message);
    fail(res, 500, 'We could not look up that order right now. Please try again.');
    return;
  }

  if (!order || normalizePhone(String(order.customer_phone)) !== normalizedPhone) {
    fail(res, 404, 'Order not found. Check the order ID and phone number and try again.');
    return;
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('item_id, item_name, price, quantity')
    .eq('order_id', order.id);

  if (itemsError) {
    console.error('[orders] lookup items error:', itemsError.message);
    fail(res, 500, 'We found your order, but could not load the items right now.');
    return;
  }

  ok(res, {
    order: {
      orderId: String(order.order_id),
      customerName: String(order.customer_name),
      status: normalizeStatus(order.status),
      placedAt: String(order.created_at),
      paymentMethod: String(order.payment_method),
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      total: Number(order.total),
      delivery: {
        address: String(order.address),
        city: String(order.city),
        pincode: String(order.pincode),
      },
      items: (items ?? []).map(item => ({
        id: String(item.item_id),
        name: String(item.item_name),
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
    },
  });
});

export default router;
