import { Router } from 'express';
import { supabase } from '../lib/supabase.js';
import { ok, validationError, fail } from '../lib/respond.js';
import * as v from '../lib/validate.js';
const router = Router();
router.post('/', async (req, res) => {
    const { name, email, phone, guests, message } = req.body ?? {};
    const errors = v.collect([
        [v.required(name, 'Name'), 'name'],
        [v.email(email), 'email'],
        [v.phone(phone, true), 'phone'],
        [v.required(message, 'Message'), 'message'],
    ]);
    if (errors) {
        validationError(res, errors);
        return;
    }
    const { data, error } = await supabase
        .from('contacts')
        .insert({
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: phone ? String(phone).trim() : null,
        guests: guests ? String(guests).trim() : null,
        message: String(message).trim(),
    })
        .select('id, created_at')
        .single();
    if (error) {
        console.error('[contact] Supabase error:', error.message);
        fail(res, 500, 'Failed to save your message. Please try again.');
        return;
    }
    ok(res, { id: data.id, createdAt: data.created_at }, 201);
});
export default router;
