/**
 * server/index.ts — production-hardened Express API server
 *
 * Security layers (in order):
 *   1. helmet       — secure HTTP headers
 *   2. cors         — allowlisted origin
 *   3. morgan       — structured HTTP access log
 *   4. cookie-parser
 *   5. csrf-csrf    — double-submit CSRF (GET /api/csrf-token is pre-CSRF)
 *   6. express-rate-limit — per-route rate limiting
 *   7. Routes
 *   8. 404 + error middleware
 */

import express, { type Request, type Response, type NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { doubleCsrf } from 'csrf-csrf';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { config } from './config.js';
import contactRouter from './routes/contact.js';
import reservationsRouter from './routes/reservations.js';
import ordersRouter from './routes/orders.js';

// ── App ────────────────────────────────────────────────────────────────────

const app = express();

// ── Security headers ───────────────────────────────────────────────────────

app.use(
  helmet({
    // CSP is set by the frontend (Vite). Don't interfere during dev.
    contentSecurityPolicy: config.isProduction,
  }),
);

// ── CORS ───────────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-csrf-token'],
  }),
);

// ── Logging ────────────────────────────────────────────────────────────────

app.use(morgan(config.isProduction ? 'combined' : 'dev'));

// ── Body + cookies ─────────────────────────────────────────────────────────

app.use(cookieParser());
app.use(express.json({ limit: '64kb' }));

// ── CSRF ───────────────────────────────────────────────────────────────────

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => config.csrfSecret,
  getSessionIdentifier: (req) =>
    `${req.ip ?? 'unknown'}:${req.headers['user-agent'] ?? ''}`,
  cookieName: config.isProduction
    ? '__Host-psifi.x-csrf-token'
    : 'x-csrf-token.dev',
  cookieOptions: {
    sameSite: 'strict',
    secure: config.isProduction,
    httpOnly: true,
    path: '/',
  },
});

// ── Rate limiters ──────────────────────────────────────────────────────────

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many requests. Please try again later.' },
});

const geminiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Rate limit exceeded for AI endpoint.' },
});

// ── Health (no CSRF) ───────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, status: 'healthy', timestamp: new Date().toISOString() });
});

// ── CSRF token (no CSRF protection on this GET route — that's intentional) ─

app.get('/api/csrf-token', (req, res) => {
  res.json({ ok: true, data: { token: generateCsrfToken(req, res) } });
});

// ── Apply CSRF protection to all subsequent routes ─────────────────────────

app.use(doubleCsrfProtection);

// ── API routes ─────────────────────────────────────────────────────────────

app.use('/api/contact',      writeLimiter, contactRouter);
app.use('/api/reservations', writeLimiter, reservationsRouter);
app.use('/api/orders',       writeLimiter, ordersRouter);

// ── Gemini proxy ───────────────────────────────────────────────────────────

const ALLOWED_MODELS = new Set([
  'gemini-2.0-flash',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
]);

if (config.geminiApiKey) {
  const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

  app.post('/api/gemini', geminiLimiter, async (req, res) => {
    const { prompt, model = 'gemini-2.0-flash' } = req.body ?? {};
    if (!prompt) {
      res.status(400).json({ ok: false, error: 'prompt is required' });
      return;
    }
    if (!ALLOWED_MODELS.has(model)) {
      res.status(400).json({ ok: false, error: 'Invalid model' });
      return;
    }
    try {
      const response = await ai.models.generateContent({ model, contents: prompt });
      res.json({ ok: true, data: { text: response.text } });
    } catch (err: unknown) {
      console.error('[gemini] error:', err);
      res.status(500).json({ ok: false, error: 'Gemini request failed' });
    }
  });
}

// ── Serve frontend in production ───────────────────────────────────────────

if (config.isProduction) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.resolve(__dirname, '../../dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.use((_req, res) => {
    res.status(404).json({ ok: false, error: 'Not found' });
  });
}

// ── Global error handler ───────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // csrf-csrf throws with a specific code
  if (
    err &&
    typeof err === 'object' &&
    'code' in err &&
    (err as { code: string }).code === 'EBADCSRFTOKEN'
  ) {
    res.status(403).json({ ok: false, error: 'Invalid or missing CSRF token' });
    return;
  }

  console.error('[server] unhandled error:', err);
  res.status(500).json({ ok: false, error: 'Internal server error' });
});

// ── Start ──────────────────────────────────────────────────────────────────

app.listen(config.port, () => {
  console.log(`[server] API running on http://localhost:${config.port} (${config.nodeEnv})`);
});
