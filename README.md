# Top 10 Prom — v3.0

Cinematic luxury e-commerce platform for **Best Bride Prom & Tux** and 50+ partner boutiques nationwide.

**HQ:** 800-3 Fairview Rd, Asheville, NC 28803 · 828-774-5588

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS custom properties |
| Animation | Framer Motion + GSAP + GSAP ScrollTrigger |
| Smooth Scroll | Lenis |
| 3D | Three.js |
| State | Zustand |
| Database | Supabase (Postgres + Auth + RLS) |
| Payments | Stripe (Checkout + Webhooks) |
| AI | Anthropic Claude API (Aria chatbot) |
| Maps | Mapbox GL JS |
| Charts | Recharts |
| Email | Resend |
| Deployment | Vercel |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `STRIPE_SECRET_KEY` — Stripe secret key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `ANTHROPIC_API_KEY` — Anthropic Claude API key
- `NEXT_PUBLIC_MAPBOX_TOKEN` — Mapbox public token
- `RESEND_API_KEY` — Resend API key
- `RESEND_FROM_EMAIL` — Verified sender email
- `NEXT_PUBLIC_SITE_URL` — Production URL (e.g. `https://top10prom.com`)

### 3. Database setup

Run the Supabase migration:

```bash
npx supabase db push
```

Or apply manually via the Supabase dashboard by running `/supabase/migrations/001_initial.sql`.

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/              # Next.js App Router pages + API routes
components/       # All React components
  ui/             # Design system primitives
  animations/     # Scroll + animation utilities
  layout/         # Navbar, Footer, Cursor, Lenis
  shop/           # Product grid, cart, filters
  chat/           # Aria chatbot widget
  stores/         # Store map and list
  auth/           # Login, register, vendor login
  dashboard/      # Customer portal components
  vendor/         # Vendor portal components
  landing/        # Hero, preloader, feature blocks
  appointments/   # Booking form + calendar
  tryon/          # Virtual try-on components
lib/              # Shared utilities + API clients
types/            # TypeScript interfaces
supabase/         # Database migrations
public/           # Static assets
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — Hero, occasions, features |
| `/prom` | Prom collection |
| `/bridal` | Bridal & wedding party |
| `/tux` | Tuxedo & menswear + AI match tool |
| `/shop` | Master shopping page |
| `/shop/[productId]` | Product detail with JSON-LD |
| `/virtual-try-on` | AI virtual try-on |
| `/appointments` | Book a styling appointment |
| `/stores` | Store locator with Mapbox |
| `/about` | Brand story & timeline |
| `/contact` | Contact form + map |
| `/login` + `/register` | Authentication |
| `/dashboard` | Customer portal |
| `/vendor/login` + `/vendor/dashboard` | Partner portal |
| `/checkout` + `/checkout/confirmation` | Stripe checkout |

---

## Stripe Webhook

Set up your Stripe webhook to point to `/api/checkout/webhook` for the following events:
- `checkout.session.completed`
- `payment_intent.payment_failed`
- `checkout.session.expired`

---

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Set all environment variables in the Vercel project settings before deploying.

---

## Design System

All colors use CSS custom properties defined in `globals.css`. Never hard-code hex values in components. Use the `cn()` utility from `lib/utils.ts` for conditional Tailwind classes.

Key tokens:
- `--gold: #D4AF72` — Primary accent
- `--blush: #F2B5C7` — Secondary accent
- `--bg-primary: #0A0A14` — Main background
- `--white-soft: #F8F4F0` — Text color

---

## License

Proprietary. All rights reserved. © Best Bride Prom & Tux / Top 10 Prom.
