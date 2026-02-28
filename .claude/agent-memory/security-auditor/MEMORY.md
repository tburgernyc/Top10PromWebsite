# Security Auditor Memory — Top 10 Prom
# Last updated: 2026-02-27 (Initial full audit)

## Audit Status
- Full pre-deployment audit completed: 2026-02-27
- Overall verdict: BLOCKED — multiple critical findings

## Critical Findings (confirmed)
- **SEC-001 CRITICAL**: No .gitignore exists. .env file with live credentials is at risk of being committed to VCS.
- **SEC-002 CRITICAL**: .env contains LIVE API keys (real Stripe sk_test_, real Anthropic sk-ant-api03-, real Supabase service role key, real Resend key, real Mapbox token).
- **SEC-003 CRITICAL**: NEXT_PUBLIC_PERFECTCORP_API_KEY in .env has value starting with `sk-0HZ956...` — a secret/private key being exposed to browser via NEXT_PUBLIC_ prefix.
- **SEC-004 CRITICAL**: /api/checkout/route.ts trusts client-supplied `price` field directly. Client sends `price: i.dress.price` from cart state. Server uses that price as `unit_amount`. No server-side price lookup against a trusted catalog.
- **SEC-005 CRITICAL**: /api/chat/route.ts has no authentication check — any unauthenticated caller can send unlimited messages to the Anthropic API (cost abuse vector).
- **SEC-006 CRITICAL**: MessageBubble.tsx line 76-80 uses dangerouslySetInnerHTML on `message.content` which includes AI-generated content AND user messages. The regex replace only handles bold/newline but does not sanitize HTML from user input — XSS vector if a user injects HTML.

## High Findings (confirmed)
- **SEC-007 HIGH**: /api/tryon/suggest and /api/tux/match have no authentication and no input length validation. User-supplied strings (userDescription, dressDescription, dressColor, budget) are interpolated directly into AI prompts — prompt injection risk.
- **SEC-008 HIGH**: Missing .gitignore — CRITICAL blocker if repo is ever initialized.
- **SEC-009 HIGH**: Missing Content-Security-Policy header in both next.config.ts and vercel.json.
- **SEC-010 HIGH**: Missing Strict-Transport-Security (HSTS) header in vercel.json.
- **SEC-011 HIGH**: Missing Permissions-Policy header in vercel.json.
- **SEC-012 HIGH**: /api/appointments/route.ts uses supabaseAdmin.auth.getUser() — this is incorrect. supabaseAdmin is the service role client and does not have access to the session cookie. The getUser() call will always return null, bypassing the auth check entirely. Any user can POST appointments as unauthenticated.
- **SEC-013 HIGH**: /api/appointments GET returns select('*') — full row data including all internal fields returned to client without field filtering.
- **SEC-014 HIGH**: RLS profiles UPDATE policy lacks WITH CHECK clause — users can update their own `role` column to 'vendor' or 'admin' via the browser client (supabase.from('profiles').update({role:'vendor'})).
- **SEC-015 HIGH**: No rate limiting on any API route — /api/chat, /api/tryon/suggest, /api/tux/match especially vulnerable to cost-abuse.

## Medium Findings (confirmed)
- **SEC-016 MEDIUM**: /api/appointments POST returns full appointment row including all PII fields to the creating client.
- **SEC-017 MEDIUM**: All dependencies use range specifiers (^) not pinned versions. No package-lock.json present.
- **SEC-018 MEDIUM**: Middleware stores `redirect` query param from user input. Login form does not consume or validate this param — currently unexploitable but should be validated.
- **SEC-019 MEDIUM**: /api/contact route embeds unsanitized user input (name, phone, store, subject, message) directly into HTML email template — email injection/HTML injection risk.
- **SEC-020 MEDIUM**: Dashboard and vendor dashboard pages are pure client components with no server-side auth verification beyond middleware. JS-disabled or middleware-bypassed requests would access the page shell.
- **SEC-021 MEDIUM**: Zustand cart persists full Dress objects to localStorage (top10prom-cart) including all dress data. Not sensitive PII but could expose wholesale pricing if present in Dress type.

## Low Findings (confirmed)
- **SEC-022 LOW**: /api/checkout/route.ts uses `imageSeed` from client to build a Stripe product image URL. No validation that imageSeed is a safe string (though it only goes to picsum.photos seed param — low risk but still client-controlled).
- **SEC-023 LOW**: X-XSS-Protection header set in vercel.json (deprecated in modern browsers, not harmful but unnecessary).
- **SEC-024 LOW**: Vendor dashboard page.tsx uses Math.random() in mock data generation which is not cryptographically secure — but this is mock data, not a security issue in production once replaced.

## Confirmed Secure Implementations
- Stripe webhook: correctly uses req.text() for raw body, validates stripe-signature header, calls stripe.webhooks.constructEvent() before any processing. SECURE.
- Supabase service role key (SUPABASE_SERVICE_ROLE_KEY): correctly NOT prefixed with NEXT_PUBLIC_. Used only in server-side API routes and lib/supabase.ts. NOT imported in client components.
- STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET: correctly server-only env vars. NOT prefixed NEXT_PUBLIC_.
- ANTHROPIC_API_KEY: correctly server-only. NOT prefixed NEXT_PUBLIC_.
- RESEND_API_KEY: correctly server-only.
- Middleware: correctly uses @supabase/ssr createServerClient with cookies for session validation (not getSession). Protects /dashboard and /vendor/dashboard.
- next/image remotePatterns: uses specific hostname (picsum.photos) not wildcard. SECURE but too permissive for production.
- UploadZone: correctly validates MIME type and size (10MB) client-side via react-dropzone accept config.
- Three.js: no eval() or new Function() usage found. All dynamic imports with ssr:false.
- JSON-LD in product page: data comes from static DRESSES array, not user input. dangerouslySetInnerHTML with JSON.stringify is safe here.
- supabaseAdmin: not imported in any client component (components/ directory). Only used in server API routes.

## Key Architecture Notes
- supabaseAdmin (service role) is module-level singleton in lib/supabase.ts — this is a server-only module. If Next.js ever includes this in a client bundle it would expose the service role key. Should be guarded with server-only package.
- The appointments route misuses supabaseAdmin.auth.getUser() — the service role client does not have the user session cookie so this always returns null.
- No CSRF protection exists on any form — Next.js App Router's same-site cookie behavior provides some protection but no explicit CSRF tokens.

## Files Audited
- middleware.ts, next.config.ts, vercel.json
- app/api/chat/route.ts, app/api/checkout/route.ts, app/api/checkout/webhook/route.ts
- app/api/appointments/route.ts, app/api/tryon/suggest/route.ts, app/api/tux/match/route.ts
- app/api/contact/route.ts, app/api/newsletter/route.ts
- lib/supabase.ts, lib/stripe.ts, lib/claude.ts
- supabase/migrations/001_initial.sql
- components/chat/MessageBubble.tsx, components/chat/ChatWidget.tsx
- components/shop/CartContext.tsx, components/shop/WishlistContext.tsx
- components/tryon/UploadZone.tsx, components/tryon/ResultPanel.tsx
- components/auth/LoginForm.tsx, components/auth/RegisterForm.tsx
- app/dashboard/page.tsx, app/vendor/dashboard/page.tsx
- app/checkout/page.tsx, app/shop/[productId]/page.tsx
- app/login/page.tsx, app/register/page.tsx, app/virtual-try-on/page.tsx
- .env, .env.example, package.json
