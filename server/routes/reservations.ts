import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { ok, validationError, fail } from '../lib/respond.js';
import * as v from '../lib/validate.js';

const router = Router();

const VALID_TIMES = new Set([
  '12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM',
  '7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM','10:00 PM',
]);

router.post('/', async (req, res) => {
  const { name, email, phone, guests, date, time, requests } = req.body ?? {};

  const errors = v.collect([
    [v.required(name, 'Name'),     'name'],
    [v.email(email),               'email'],
    [v.phone(phone),               'phone'],
    [v.required(guests, 'Guests'), 'guests'],
    [v.futureDate(date),           'date'],
    [!time || !VALID_TIMES.has(String(time))
      ? 'Invalid time slot' : undefined, 'time'],
  ]);
  if (errors) { validationError(res, errors); return; }

  const { data, error } = await supabase
    .from('reservations')
    .insert({
      name:     String(name).trim(),
      email:    String(email).trim().toLowerCase(),
      phone:    String(phone).trim(),
      guests:   String(guests).trim(),
      date:     String(date).trim(),
      time:     String(time).trim(),
      requests: requests ? String(requests).trim() : null,
    })
    .select('id, created_at')
    .single();

  if (error) {
    console.error('[reservations] Supabase error:', error.message);
    fail(res, 500, 'Failed to save your reservation. Please try again.');
    return;
  }

  ok(res, { id: data.id, createdAt: data.created_at }, 201);
});

export default router;
