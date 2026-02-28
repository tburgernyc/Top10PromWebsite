Here is the complete `CLAUDE.md` file:

```markdown
# CLAUDE.md — TOP 10 PROM v3.0
# Project memory for Claude Code. Read this file at the start of every session.
# Last updated: February 2026

---

## PROJECT OVERVIEW

**Top 10 Prom** is a cinematic, luxury e-commerce platform for a prom, bridal, and formalwear retailer with 50+ boutique partner locations nationwide. HQ: Best Bride Prom & Tux — Merle Norman of Asheville, 800-3 Fairview Rd, Asheville, NC 28803 | 828-774-5588.

This is a **world-class, production-grade Next.js 14 App Router site**. Every component must be design-system compliant, mobile-first, accessible (WCAG AA), and animated to the cinematic specification in the PRD. No stubs. No lorem ipsum. No placeholder code.

---

## TECH STACK

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + CSS custom properties (globals.css) |
| Animation | Framer Motion + GSAP + GSAP ScrollTrigger |
| Smooth Scroll | Lenis (duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4)) |
| 3D / Canvas | Three.js (landing HeroCanvas, auth panels, 404) |
| State | Zustand (cart, wishlist) |
| Database | Supabase (Postgres + Auth + RLS) |
| Payments | Stripe (Elements + webhooks + Apple/Google Pay) |
| AI | Anthropic Claude API (Aria chatbot, style tips, tux matching) |
| Maps | Mapbox GL JS (custom dark brand style, crown SVG markers) |
| Charts | Recharts (vendor analytics, brand-styled) |
| Email | Resend |
| Virtual Try-On | Perfect Corp SDK (CSS fallback if key absent) |
| Deployment | Vercel |

---

## REPOSITORY STRUCTURE

```
top10prom/
├── app/
│   ├── layout.tsx                    # Root layout — wires Lenis, cursor, transitions
│   ├── page.tsx                      # Landing page (/)
│   ├── prom/page.tsx                 # /prom — Prom Collection
│   ├── bridal/page.tsx               # /bridal — Bridal Collection
│   ├── tux/page.tsx                  # /tux — Tuxedo & Menswear
│   ├── shop/
│   │   ├── page.tsx                  # /shop — Master shopping page
│   │   └── [productId]/page.tsx      # /shop/[id] — Product detail
│   ├── virtual-try-on/page.tsx       # /virtual-try-on
│   ├── appointments/page.tsx         # /appointments — Booking
│   ├── stores/page.tsx               # /stores — Store locator
│   ├── about/page.tsx                # /about — Brand story
│   ├── contact/page.tsx              # /contact
│   ├── login/page.tsx                # /login
│   ├── register/page.tsx             # /register
│   ├── dashboard/page.tsx            # /dashboard — Customer portal
│   ├── vendor/
│   │   ├── login/page.tsx            # /vendor/login
│   │   └── dashboard/page.tsx        # /vendor/dashboard
│   ├── checkout/
│   │   ├── page.tsx                  # /checkout (3-step flow)
│   │   └── confirmation/page.tsx     # /checkout/confirmation
│   ├── not-found.tsx                 # Custom 404
│   └── api/
│       ├── chat/route.ts             # Aria — Claude streaming
│       ├── appointments/route.ts
│       ├── checkout/route.ts         # Stripe session creation
│       ├── checkout/webhook/route.ts # Stripe webhook
│       ├── contact/route.ts
│       ├── newsletter/route.ts
│       ├── tryon/suggest/route.ts    # Claude style tip
│       └── tux/match/route.ts        # Claude tux pairing
│
├── components/
│   ├── ui/                           # Primitive design system
│   │   ├── GlassPanel.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Carousel.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Toast.tsx
│   │   └── Tooltip.tsx
│   ├── animations/
│   │   ├── ScrollReveal.tsx
│   │   ├── StaggerContainer.tsx
│   │   ├── CounterAnimation.tsx
│   │   └── TextSplit.tsx
│   ├── layout/
│   │   ├── CustomCursor.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── PageTransition.tsx
│   │   └── LenisProvider.tsx
│   ├── shop/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── QuickViewModal.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── CartContext.tsx
│   │   └── WishlistContext.tsx
│   ├── chat/
│   │   ├── ChatWidget.tsx
│   │   ├── ChatDrawer.tsx
│   │   ├── MessageBubble.tsx
│   │   └── TypingIndicator.tsx
│   ├── stores/
│   │   ├── StoreCard.tsx
│   │   ├── StoreMap.tsx
│   │   └── RegionFilter.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── VendorLoginForm.tsx
│   ├── dashboard/
│   │   ├── MetricCard.tsx
│   │   ├── StyleDNACard.tsx
│   │   ├── OrderHistoryTable.tsx
│   │   └── AppointmentCard.tsx
│   ├── vendor/
│   │   ├── AnalyticsCharts.tsx
│   │   ├── InventoryTable.tsx
│   │   ├── OrderManagementTable.tsx
│   │   └── MarketingAssetGrid.tsx
│   ├── landing/
│   │   ├── HeroCanvas.tsx
│   │   ├── CurtainReveal.tsx
│   │   ├── Preloader.tsx
│   │   ├── WelcomeModal.tsx
│   │   ├── OccasionCard.tsx
│   │   ├── DesignerStrip.tsx
│   │   └── FeatureBlock.tsx
│   ├── appointments/
│   │   ├── ConversationalForm.tsx
│   │   ├── CalendarPicker.tsx
│   │   └── TimeSlotPicker.tsx
│   └── tryon/
│       ├── UploadZone.tsx
│       ├── DressSelector.tsx
│       ├── ResultPanel.tsx
│       └── StyleTipCard.tsx
│
├── lib/
│   ├── mock-data.ts                  # 50 dresses, 9 stores, 6 designers, 10 vendors
│   ├── supabase.ts                   # Client + auth helpers + role checks
│   ├── stripe.ts                     # Stripe client + session helpers
│   ├── claude.ts                     # Anthropic client + streaming + Aria system prompt
│   └── utils.ts                      # formatPrice, formatDate, cn, etc.
│
├── types/
│   └── index.ts                      # All TS interfaces (Dress, Order, Vendor, etc.)
│
├── supabase/
│   └── migrations/
│       └── 001_initial.sql           # Full schema + RLS policies
│
├── public/
│   ├── textures/
│   │   └── noise.png                 # 200×200 SVG-based noise pattern, opacity 0.03
│   └── images/                       # [category]/[filename] — swap picsum here
│
├── middleware.ts                     # Route protection for /dashboard, /vendor/dashboard
├── tailwind.config.ts
├── globals.css                       # Full CSS token system + keyframes
├── next.config.ts
├── vercel.json
└── README.md
```

---

## DESIGN SYSTEM — NEVER DEVIATE FROM THESE

### Color Tokens (CSS Custom Properties in globals.css)
```css
--bg-primary: #0A0A14;
--bg-secondary: #08080F;
--bg-elevated: #0F0F1E;
--gold: #D4AF72;
--gold-light: #F0D090;
--blush: #F2B5C7;
--white-soft: #F8F4F0;
--purple-accent: #9B6FD4;
--glass-light: rgba(255, 255, 255, 0.06);
--glass-medium: rgba(255, 255, 255, 0.09);
--glass-heavy: rgba(255, 255, 255, 0.13);
--glass-gold: rgba(212, 175, 114, 0.08);
--glass-blush: rgba(242, 181, 199, 0.08);
--border-glass: 1px solid rgba(255, 255, 255, 0.10);
--border-gold: 1px solid rgba(212, 175, 114, 0.35);
--border-blush: 1px solid rgba(242, 181, 199, 0.35);
--shadow-gold: 0 0 40px rgba(212, 175, 114, 0.15);
--shadow-blush: 0 0 40px rgba(242, 181, 199, 0.15);
--shadow-card: 0 24px 60px rgba(0, 0, 0, 0.4);
--blur-sm: blur(8px);
--blur-md: blur(16px);
--blur-lg: blur(24px);
--blur-xl: blur(40px);
```

### Typography
- **Serif:** Playfair Display (headings, hero text, editorial, pull quotes)
- **Sans:** DM Sans (body, labels, buttons, UI elements)
- Eyebrow text: 12px, ALL CAPS, letter-spacing: 0.3em, color gold or blush
- Buttons: DM Sans 12px, 600 weight, letter-spacing: 0.2em, UPPERCASE
- All font sizes are desktop; mobile scales down per spec

### Core Components — Rules
- `<GlassPanel>` — always has `backdrop-filter: var(--blur-md)`, `border-radius: 16px` (cards), `12px` (chips), `24px` (modals)
- `<GoldButton>` / `<BlushButton>` / `<GhostButton>` — height 52px desktop / 48px mobile, min-width 160px, border-radius: 4px (sharp, NOT pill), magnetic hover on desktop, ripple on click
- `<SectionHeading>` — eyebrow → heading (per-character split stagger) → gold rule → subtext. All via IntersectionObserver.
- `<ProductCard>` — aspect-ratio: 3/4, hover reveals QUICK VIEW + TRY ON ✦ buttons, wishlist heart top-right, gold glow on border. Every 7th card is a Featured 2×-height editorial card.

---

## GLOBAL SYSTEMS (Applied to ALL pages)

### Scroll
- **Lenis** smooth scroll on every page: `duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4)`
- **GSAP ScrollTrigger** synced to Lenis on all pages
- All ScrollTrigger instances stored in a ref array and killed in `useEffect` cleanup

### Custom Cursor (desktop only, disable on `pointer: coarse`)
- Default: 8px white dot + 32px ring with 0.12s lerp delay
- Hover buttons/links: ring → 56px, fills `rgba(212,175,114,0.15)`, dot disappears
- Hover dress cards: ring shows "VIEW" text
- Hover images: crosshair expand icon
- Drag carousels: shows "DRAG" text
- Implemented via global React context + CSS custom properties

### Page Transitions (ALL pages)
- Exit: `opacity 0 + translateY(-20px)` over 300ms
- Wipe: full-screen `#0A0A14` overlay sweeps left→right over 350ms
- During wipe: TOP 10 PROM wordmark appears centered in gold for 200ms
- Enter: `opacity 0 + translateY(20px)` fades in over 400ms after wipe

### Noise Texture
```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url('/textures/noise.png');
  opacity: 0.03;
  pointer-events: none;
  z-index: 9999;
}
```

---

## PAGE INVENTORY (13 pages + API routes)

| # | Route | Key Features |
|---|---|---|
| 1 | `/` | Landing: Three.js HeroCanvas, CurtainReveal, Preloader, WelcomeModal, OccasionCards, DesignerStrip, stats counter |
| 2 | `/prom` | Full-viewport cinematic hero, parallax, sticky filter bar (6 filters), dress grid, Quick View Modal, Designer Spotlight |
| 3 | `/bridal` | "Build Your Wedding Party" role selector, magazine editorial layout, ambient audio toggle, Appointment CTA |
| 4 | `/tux` | Cool navy/silver palette, "Match Your Look" Claude-powered pairing tool, accessories horizontal scroll |
| 5 | `/shop` | Compact hero, full ProductGrid, "Recently Viewed" rail, SALE/NEW/EXCLUSIVE badges, infinite scroll, CartDrawer |
| 6 | `/shop/[productId]` | Full product detail, structured data JSON-LD |
| 7 | `/virtual-try-on` | 3-column spatial layout, drag-drop upload, Perfect Corp SDK / CSS fallback, streaming Claude style tips |
| 8 | `/appointments` | Conversational 5-step form (one question at a time), custom CalendarPicker, Mapbox store selector |
| 9 | `/stores` | 50/50 split: Mapbox left (crown SVG markers, HQ pulse animation, flyTo), store list right (geolocation sort) |
| 10 | `/about` | Parallax scroll narrative, 5 alternating editorial sections, SVG dot map, milestone draggable timeline |
| 11 | `/contact` | 2-col: glassmorphism form + mini Mapbox embed, ?store= query param pre-fills store field |
| 12 | `/login` + `/register` | Split-screen: Three.js left panel, glassmorphism form right, rotating quotes, real-time validation, password strength meter |
| 13 | `/dashboard` | Sidebar nav (5 tabs): Overview, Wishlist, Orders, Appointments, Profile. Style DNA quiz. Loyalty points. |
| 14 | `/vendor/login` + `/vendor/dashboard` | Partner portal: Analytics (recharts line + bar), Inventory table with wholesale pricing, Orders, Marketing Assets, Settings |
| 15 | `/checkout` | 3-step: Review → Shipping → Payment (Stripe Elements + Apple/Google Pay). Confirmation: gold confetti burst. |
| 16 | `/not-found` | 404: large Playfair 200px "404", Three.js particles, 3 CTA cards |

---

## DATABASE SCHEMA (Supabase)

**Tables:** `profiles`, `vendors`, `dresses`, `wishlist_items`, `orders`, `appointments`, `newsletter_subscribers`

**Key rules:**
- `profiles.role` is `'customer' | 'vendor' | 'admin'` — checked by middleware
- All tables have RLS enabled
- `dresses` is public read (no auth required)
- Users read/write only their own `wishlist_items`, `orders`, `appointments`
- Migration lives at `/supabase/migrations/001_initial.sql`

---

## API ROUTES

| Route | Purpose | AI Model |
|---|---|---|
| `POST /api/chat` | Aria chatbot — streaming response | Claude (streaming) |
| `POST /api/tryon/suggest` | Style tip for virtual try-on result panel | Claude |
| `POST /api/tux/match` | Tux recommendations given a dress description | Claude |
| `POST /api/checkout` | Create Stripe payment intent / session | — |
| `POST /api/checkout/webhook` | Handle Stripe webhook events | — |
| `POST /api/appointments` | Save booking to Supabase | — |
| `POST /api/contact` | Contact form → Resend email | — |
| `POST /api/newsletter` | Newsletter signup | — |

---

## ARIA CHATBOT — SYSTEM PROMPT SUMMARY

Aria is a warm, encouraging style concierge ("like a best friend who's a fashion expert"). Responses ≤3 sentences unless detail is needed. Always end with an actionable next step. Quick-reply chips change based on current page context. Full knowledge base (stores, designers, pricing, shipping, returns, vendor program) injected into system prompt in `/lib/claude.ts`.

**Designers carried:** Johnathan Kayne, Ashley Lauren, Jessica Angel, Tiffany Designs, Chandalier LA, 2Cute Prom
**Occasions:** Prom, Homecoming, Bridal, Tuxedo, Pageant, Sweet 16, Quinceañera, Evening
**Price range:** $149–$2,400 retail

---

## ENVIRONMENT VARIABLES

All required keys are defined in `.env.example`. The following must be set before any API route will function:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
ANTHROPIC_API_KEY
NEXT_PUBLIC_MAPBOX_TOKEN
RESEND_API_KEY
RESEND_FROM_EMAIL
NEXT_PUBLIC_PERFECTCORP_API_KEY     # Optional — CSS fallback if absent
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SITE_NAME
```

---

## MIDDLEWARE — ROUTE PROTECTION

`middleware.ts` enforces:
- `/dashboard` → redirect `/login` if no Supabase session
- `/vendor/dashboard` → redirect `/vendor/login` if no session OR `role !== 'vendor'`

---

## BUILD ORDER (Follow Exactly — 101 Files)

TaskMaster AI manages this sequence. Do NOT skip files or build out of order. Dependency order matters:

1. **Foundation:** file structure → `package.json` → `.env.example` → `tailwind.config.ts` → `globals.css` → `/types/index.ts`
2. **Data:** `mock-data.ts` → `supabase.ts` → `stripe.ts` → `claude.ts` → `utils.ts`
3. **Primitive UI (files 12–25):** GlassPanel → Button → Input → Modal → Badge → Dropdown → Carousel → Skeleton → Toast → Tooltip → animation components
4. **Global Layout (files 26–31):** CustomCursor → Navbar → Footer → PageTransition → LenisProvider → `app/layout.tsx`
5. **Feature Components (files 32–70):** shop → chat → stores → auth → dashboard → vendor → landing → appointments → tryon
6. **API Routes (files 71–78)**
7. **Middleware (file 79)**
8. **Pages (files 80–98):** Landing → Prom → Bridal → Tux → Shop → Product Detail → Try-On → Appointments → Stores → About → Contact → Login → Register → Dashboard → Vendor Login → Vendor Dashboard → Checkout → Confirmation → 404
9. **Final Config (files 99–101):** `next.config.ts` → `vercel.json` → `README.md`

---

## ANIMATION RULES (Performance-Critical)

- `will-change: transform` only while animating — remove after via `onAnimationComplete`
- All Three.js render loops use delta time
- All GSAP ScrollTrigger instances stored in a ref array, killed in `useEffect` cleanup
- No animations run on off-screen elements
- `prefers-reduced-motion: reduce` — all animations fall back to simple opacity transitions only
- Lenis must be initialized in `LenisProvider.tsx` and GSAP ScrollTrigger must call `ScrollTrigger.scrollerProxy` to sync

---

## ACCESSIBILITY REQUIREMENTS

- All interactive elements: keyboard navigable
- All images: meaningful `alt` text
- Focus rings: `outline: 2px solid #D4AF72; outline-offset: 2px`
- Custom cursor: always disabled on touch devices (`pointer: coarse`)
- ARIA labels on all icon-only buttons
- Chat widget: full keyboard navigation support
- WCAG AA contrast minimum on all text

---

## SEO — EVERY PAGE MUST HAVE

```tsx
<title>[Page-specific title] | Top 10 Prom</title>
<meta name="description" content="[Unique description]" />
// Open Graph
<meta property="og:title" />
<meta property="og:description" />
<meta property="og:image" />
// Twitter Card
<meta name="twitter:card" content="summary_large_image" />
// Canonical URL
<link rel="canonical" href="[URL]" />
// JSON-LD structured data on product pages (/shop/[productId])
```

---

## CODING CONVENTIONS

- All components accept a `className` prop for Tailwind extension
- All colors use CSS custom properties — never hard-code hex in component files
- Use `cn()` utility from `/lib/utils.ts` for conditional Tailwind classes
- `<Image>` from `next/image` everywhere — explicit `width` and `height` to prevent CLS
- All images: placeholder paths via `picsum.photos` until client provides real images
- No lorem ipsum — all copy must be realistic, on-brand fashion terminology
- Mock data in `/lib/mock-data.ts` — 50 dresses, 9 real store locations, 6 designers, 10 vendors
- TypeScript strict mode — all interfaces defined in `/types/index.ts`

---

## DO NOT TOUCH (Without Explicit Instruction)

- `/supabase/migrations/001_initial.sql` — schema is finalized; do not alter without creating a new migration file
- `globals.css` CSS custom properties block — design tokens are locked; extend only via new variables
- Stripe webhook handler logic in `/api/checkout/webhook/route.ts` — modify only if adding new Stripe events
- `middleware.ts` role check logic — only modify if adding new protected routes

---

## COMMON MISTAKES TO AVOID

- Do NOT use `<button>` bare — always use `<GoldButton>`, `<BlushButton>`, or `<GhostButton>` from the design system
- Do NOT use native `<input>` — always use `<Input>` from `/components/ui/Input.tsx`
- Do NOT use `alert()` for errors — always use `<Toast>` notifications
- Do NOT hardcode store data in page files — always import from `/lib/mock-data.ts`
- Do NOT use `router.push()` for page transitions — always use the `<PageTransition>` component
- Do NOT skip animation cleanup in `useEffect` — memory leaks will degrade scroll performance
- Do NOT render Three.js on SSR — always use `dynamic(() => import(...), { ssr: false })`
- Do NOT use `px` for font sizes — use the Tailwind type scale or CSS clamp for responsive sizing

---

## TASKMASTER INTEGRATION

This project uses **TaskMaster AI MCP** for task orchestration. The PRD lives at `.taskmaster/docs/prd.txt`.

Key TaskMaster commands:
- `next_task` — get the current dependency-unblocked task
- `set_task_status` — mark a task done before moving to next
- `analyze_complexity` — run before starting any page or feature component
- `expand_task` — break any task with complexity > 7 into subtasks before building

Every session should begin with `next_task` to resume from the correct build position.
