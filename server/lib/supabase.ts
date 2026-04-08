/**
 * server/lib/supabase.ts
 * Supabase client for server-side use only.
 *
 * Uses the service-role key when available (bypasses RLS — safe because this
 * module only runs in Node.js, never in the browser).
 * Falls back to the anon/publishable key — adequate when the Express layer
 * provides CSRF protection + validation, and RLS allows anonymous inserts.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

export const supabase = createClient(config.supabaseUrl, config.supabaseKey, {
  auth: { persistSession: false },
});
