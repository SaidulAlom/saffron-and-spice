# Case Study: Saffron & Spice — Indian Fine Dining Web Application

**Project Type:** Full-Stack Web Application  
**Role:** Full-Stack Developer  
**Timeline:** 2026  
**Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Express, Supabase, Prisma  
**Live URL:** https://saffron-and-spice.up.railway.app  
**Repository:** https://github.com/SaidulAlom/saffron-and-spice

---

## Overview

Saffron & Spice is a portfolio-grade full-stack web application for a premium Indian fine dining restaurant. The project was built to demonstrate real-world engineering skills across the full stack — from animated UI and responsive design to a production-hardened Express API, Supabase-powered data persistence, and Railway deployment.

The goal was not just to build a visually impressive restaurant website, but to ship something that works end-to-end: real form submissions, real database writes, real API security, and real deployment infrastructure.

---

## Problem Statement

Most restaurant websites in portfolio projects are purely static — they look good but have no real functionality. The challenge was to build something that:

- Looks and feels like a premium brand experience
- Has real backend-connected flows (orders, reservations, contact)
- Remains stable during demos even if the database is unavailable
- Is production-ready with security, SEO, and deployment config included
- Can be presented confidently to technical and non-technical audiences

---

## Goals

1. Build a visually rich, animated frontend that reflects a premium Indian dining brand
2. Implement real backend API endpoints with validation, CSRF protection, and rate limiting
3. Use Supabase as the primary database with graceful fallback for demo reliability
4. Achieve full deployment readiness including SEO, sitemap, manifest, and OG assets
5. Keep the codebase clean, typed, and lint-passing for portfolio credibility

---

## Tech Stack Decisions

### Frontend — React 19 + Vite + Tailwind CSS v4
React 19 was chosen for its concurrent rendering improvements. Vite provides near-instant HMR and fast production builds. Tailwind CSS v4 with the new Vite plugin eliminates the need for PostCSS config and delivers smaller CSS output.

### Animations — Framer Motion (Motion)
Motion was used for page transitions, scroll reveals, parallax effects, hover micro-interactions, and tilt effects. The decision was to avoid a custom cursor dependency while still delivering a rich motion experience.

### Backend — Express + TypeScript
Express was chosen for its simplicity and full control over middleware ordering. The server is structured with security layers in a deliberate order: Helmet → CORS → Morgan → Cookie Parser → CSRF → Rate Limiting → Routes.

### Database — Supabase (PostgreSQL)
Supabase provides a hosted PostgreSQL database with a JavaScript client, Row Level Security, and a dashboard for managing data. It was the right choice for a project that needed a real database without the overhead of managing infrastructure.

### ORM — Prisma
Prisma was added for type-safe database access and migration management, connected to Supabase via connection pooling (PgBouncer on port 6543) and a direct URL for migrations (port 5432).

### Deployment — Railway
Railway was chosen because it supports full-stack Node.js applications in a single service. Unlike Netlify or Vercel (which are serverless-only), Railway runs the Express server as a persistent process alongside the built Vite frontend.

---

## Architecture

```
Browser
  │
  ├── React SPA (Vite build served by Express in production)
  │     ├── Pages: Home, Menu, About, Experiences, Gallery, Testimonials, Contact
  │     ├── Components: Layout, CartSidebar, CheckoutModal, ReservationModal
  │     └── Hooks: useSupabase (data fetching), useSEO (per-route metadata)
  │
  └── Express API (server/)
        ├── GET  /api/health
        ├── GET  /api/csrf-token
        ├── POST /api/contact       → Supabase contacts table
        ├── POST /api/reservations  → Supabase reservations table
        ├── POST /api/orders        → Supabase orders + order_items tables
        └── POST /api/gemini        → Google Gemini AI proxy
```

In production, Express serves the Vite `dist/` folder as static files and falls back to `index.html` for all non-API routes, enabling client-side routing.

---

## Key Features

### 1. Animated Landing Experience
The homepage features a hero section with scroll-triggered reveals, parallax depth layers, staggered text animations, and hover tilt effects on cards. All animations use Framer Motion with `initial`, `animate`, and `whileInView` variants for performance-safe scroll animations.

### 2. Interactive Menu with Cart
The menu page fetches items from Supabase with a category filter. Items can be added to a persistent cart sidebar. The cart calculates subtotals in real time and opens a multi-step checkout modal.

### 3. Multi-Step Checkout Flow
The checkout modal walks users through delivery details → payment method → order confirmation. The server validates all fields, recomputes totals server-side to prevent tampering, generates a unique order ID (`SS-YYYYMMDD-XXXXXXXX`), and persists the order and line items to Supabase in a single transaction with rollback on failure.

### 4. Table Reservation System
The reservation modal collects name, email, phone, guest count, date, time slot, and special requests. The backend validates the date is in the future and the time slot is from an allowed set, then persists to Supabase.

### 5. Contact Form
A contact form with server-side validation writes to a `contacts` table in Supabase. Field-level errors from the server are surfaced back to the UI.

### 6. Supabase Fallback Strategy
Read-only content (menu items, testimonials, gallery images) uses a fallback pattern: if Supabase returns an error or empty data, the app silently falls back to hardcoded constants. This ensures the demo never breaks due to database connectivity issues.

### 7. Security Layer
- **Helmet** — sets secure HTTP headers including HSTS, X-Frame-Options, and CSP in production
- **CORS** — strict allowlist of origins, credentials enabled
- **CSRF** — double-submit cookie pattern via `csrf-csrf`, token fetched on page load and attached to every POST
- **Rate Limiting** — 20 requests per 15 minutes on write endpoints, 10 per minute on the Gemini proxy
- **Input Validation** — all fields validated server-side with a custom `validate.ts` helper before any database write

### 8. SEO & Deployment Readiness
- Per-route `<title>` and `<meta description>` via a `useSEO` hook
- Build-time generation of `sitemap.xml` and `robots.txt` via a Node script
- Web manifest (`site.webmanifest`) for PWA installability
- Open Graph image (`og-image.svg`) for social sharing previews
- Railway config (`railway.json`) with build and start commands

### 9. AI Chat (Gemini)
An optional Gemini AI proxy endpoint allows the frontend to send prompts to Google's Gemini API through the Express server, keeping the API key server-side and rate-limited.

---

## Challenges & Solutions

### Challenge 1 — Invalid Supabase API Key
The project initially used a `sb_publishable_` format key which was rejected by Supabase with "Invalid API key". The fix was to retrieve the correct JWT-format `eyJ...` anon key from the Supabase dashboard.

### Challenge 2 — Dead Code Causing Lint Failure
`server/db.ts` referenced `config.dbPath` which was never defined in `config.ts`. This was a leftover from an earlier SQLite implementation that was replaced by Supabase. The file was deleted since no routes imported it, fixing `npm run lint`.

### Challenge 3 — TypeScript Discriminated Union Narrowing
Three components accessed `.fields` and `.error` on `ApiResult<T>` inside `if (!result.ok)` blocks, but TypeScript wasn't narrowing the union. The fix was to change the condition to `if (result.ok === false)` which correctly narrows to the `ApiError` branch.

### Challenge 4 — Railway Using Node 18
Railway's Nixpacks defaulted to Node 18, but packages like `@supabase/supabase-js`, `react-router-dom`, `prisma`, and `better-sqlite3` require Node 20+. The fix was adding `"engines": { "node": ">=20.0.0" }` to `package.json` and a `.node-version` file set to `20`.

### Challenge 5 — Bundle Size Warning
The initial Vite build produced a single 665 kB JS chunk. Code splitting was added via `rollupOptions.output.manualChunks` to separate `react`/`react-dom`/`react-router-dom` into a `vendor` chunk and `motion` into its own chunk, reducing the main bundle to 521 kB.

---

## Database Schema

```sql
-- Menu content (read via Supabase JS client)
menu_items (id, name, description, price, category, image, spice_level, is_signature)

-- Form submissions (written via Express API)
contacts      (id, name, email, phone, guests, message, created_at)
reservations  (id, name, email, phone, guests, date, time, requests, created_at)
orders        (id, order_id, customer_name, customer_phone, address, city, pincode,
               payment_method, subtotal, tax, total, created_at)
order_items   (id, order_id, item_id, item_name, price, quantity)

-- Read content with fallback
testimonials  (id, name, location, rating, review, image)
gallery_images (id, url, title, sort_order)
```

---

## Results

- `npm run lint` — passes with zero errors
- `npm run build` — builds successfully, frontend 521 kB (gzip: 147 kB), CSS 55 kB (gzip: 9.8 kB)
- All API endpoints functional with CSRF protection and rate limiting
- Supabase read content with graceful fallback for demo stability
- Deployed on Railway with automatic redeploy on every `git push` to `main`
- Full SEO setup: sitemap, robots, manifest, OG image, per-route metadata

---

## Lessons Learned

- **Fallback data is essential for demos.** A live database can be slow or unavailable during a presentation. Hardcoded fallbacks make the demo bulletproof.
- **Security should be layered, not bolted on.** Building CSRF, rate limiting, and validation into the server from the start is far easier than adding them later.
- **TypeScript discriminated unions need explicit narrowing.** `if (!result.ok)` is not always enough — `if (result.ok === false)` is more reliable for union narrowing.
- **Node version mismatches are a common deployment gotcha.** Always specify the engine version in `package.json` and a `.node-version` file for Railway/Nixpacks.
- **Code splitting matters for perceived performance.** Separating vendor and animation libraries into their own chunks improves initial load time significantly.

---

## Future Improvements

- Admin dashboard for managing orders, reservations, and menu items
- Email notifications on reservation and order confirmation via Resend or SendGrid
- Real payment integration via Razorpay or Stripe
- Image optimization with Supabase Storage instead of Unsplash URLs
- PWA offline support with a service worker
- End-to-end tests with Playwright

---

*Built by Saidul Alom — 2026*
