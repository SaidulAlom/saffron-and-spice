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

const VALID_PAYMENT_METHODS = new Set(['card', 'upi', 'cod']);

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
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

  ok(res, { orderId, grandTotal: computedTotal }, 201);
});

export default router;
