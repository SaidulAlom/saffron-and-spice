/**
 * server/config.ts
 * Centralized configuration — reads from process.env.
 * Non-VITE_ vars are server-only and never bundled into the client.
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

const isProduction = optional('NODE_ENV', 'development') === 'production';

const allowedOrigins = new Set(
  [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173',
    process.env.APP_URL,
  ].filter(Boolean) as string[],
);

export const config = {
  nodeEnv:      optional('NODE_ENV', 'development'),
  isProduction,
  port:         Number(optional('PORT', '3001')),
  dbPath:       optional('DB_PATH', './data/saffron-and-spice.db'),

  /** CORS handler — allows dev origins and the configured APP_URL. */
  corsOrigin(
    origin: string | undefined,
    cb: (err: Error | null, allow?: boolean) => void,
  ) {
    if (!origin || allowedOrigins.has(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },

  /** Secret for CSRF double-submit cookie. */
  csrfSecret: optional('CSRF_SECRET', 'csrf-secret-change-me-in-production'),

  /** Gemini API key — only used by /api/gemini */
  geminiApiKey: process.env.GEMINI_API_KEY ?? '',

  /**
   * Supabase connection.
   * Prefer SUPABASE_SERVICE_ROLE_KEY (bypasses RLS) when available.
   * Falls back to the publishable/anon key — acceptable when the Express
   * server itself acts as the security gate (CSRF + validation).
   */
  supabaseUrl: optional(
    'SUPABASE_URL',
    optional('VITE_SUPABASE_URL', ''),
  ),
  supabaseKey: (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    ''
  ),
} as const;

// Warn (not throw) so the server still boots for the Gemini route
// even if Supabase creds are absent.
if (!config.supabaseUrl || !config.supabaseKey) {
  console.warn(
    '[config] WARNING: Supabase credentials missing. ' +
    'Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY) ' +
    'in .env.local — contact/reservation/order routes will return 503.',
  );
}
