import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Preloader } from '@/components/landing/Preloader'
import { CurtainReveal } from '@/components/landing/CurtainReveal'
import { WelcomeModal } from '@/components/landing/WelcomeModal'
import { OccasionCard } from '@/components/landing/OccasionCard'
import { DesignerStrip } from '@/components/landing/DesignerStrip'
import { FeatureBlock } from '@/components/landing/FeatureBlock'
import { SectionHeading } from '@/components/animations/ScrollReveal'
import { StatBlock } from '@/components/animations/CounterAnimation'
import { ChatWidget } from '@/components/chat/ChatWidget'

const HeroCanvas = dynamic(() => import('@/components/landing/HeroCanvas'), { ssr: false })

// ── METADATA ──────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Top 10 Prom | Luxury Prom, Bridal & Formalwear',
  description: 'Discover thousands of designer prom dresses, bridal gowns, and tuxedos at Top 10 Prom. 50+ boutique partner locations nationwide. Book your personalized styling appointment today.',
  openGraph: {
    title: 'Top 10 Prom | Luxury Prom, Bridal & Formalwear',
    description: 'Discover thousands of designer prom dresses, bridal gowns, and tuxedos at Top 10 Prom.',
    images: [{ url: 'https://picsum.photos/seed/top10prom-og/1200/630', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Top 10 Prom | Luxury Formalwear', description: 'Designer prom dresses, bridal gowns & tuxedos. 50+ boutique locations.' },
  alternates: { canonical: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://top10prom.com' },
}

// ── STATS ─────────────────────────────────────────────────────

const STATS = [
  { label: 'Styles', value: 5000, suffix: '+' },
  { label: 'Partner Boutiques', value: 50, suffix: '+' },
  { label: 'Happy Customers', value: 120000, suffix: '+', prefix: '' },
  { label: 'Years of Expertise', value: 25, suffix: '' },
]

// ── OCCASION CARDS ────────────────────────────────────────────

const OCCASIONS = [
  { title: 'Prom', subtitle: 'Make your entrance unforgettable', href: '/prom', imageSeed: 'prom-hero-1', accent: 'gold' as const, badge: 'New Arrivals' },
  { title: 'Bridal', subtitle: 'For every role in the wedding party', href: '/bridal', imageSeed: 'bridal-hero-1', accent: 'blush' as const, badge: 'Exclusive' },
  { title: 'Tuxedos', subtitle: 'Sharp, modern menswear for any occasion', href: '/tux', imageSeed: 'tux-hero-1', accent: 'gold' as const },
  { title: 'Evening', subtitle: 'Galas, banquets & black-tie events', href: '/shop?occasion=evening', imageSeed: 'evening-hero-1', accent: 'purple' as const },
]

// ── PAGE ──────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <Preloader />
      <WelcomeModal />

      {/* ── HERO ── */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <HeroCanvas />

        {/* Radial gradient vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--bg-primary)_80%)]" />

        <CurtainReveal>
          <div className="relative z-10 flex flex-col items-center text-center gap-6 px-6 max-w-4xl mx-auto">
            <p className="text-[10px] font-sans font-semibold tracking-[0.4em] uppercase text-[var(--gold)] opacity-0 animate-[fadeInUp_0.8s_1s_forwards]">
              Since 1999 · Asheville, NC
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[var(--white-soft)] leading-[0.95] opacity-0 animate-[fadeInUp_0.8s_1.2s_forwards]">
              Your Most<br />
              <span className="text-[var(--gold)]">Unforgettable</span><br />
              Moment
            </h1>
            <p className="text-base md:text-lg text-[var(--white-soft)]/50 font-sans max-w-md leading-relaxed opacity-0 animate-[fadeInUp_0.8s_1.4s_forwards]">
              Thousands of designer gowns, tuxedos, and bridal looks — curated for the moments that define you.
            </p>
            <div className="flex flex-wrap gap-4 justify-center opacity-0 animate-[fadeInUp_0.8s_1.6s_forwards]">
              <a
                href="/shop"
                className="h-[52px] px-8 bg-[var(--gold)] text-[var(--bg-primary)] font-sans text-xs font-bold tracking-[0.2em] uppercase flex items-center hover:opacity-90 transition-opacity"
                style={{ cursor: 'none' }}
              >
                Shop Collection
              </a>
              <a
                href="/appointments"
                className="h-[52px] px-8 border border-white/20 text-[var(--white-soft)]/70 font-sans text-xs font-bold tracking-[0.2em] uppercase flex items-center hover:border-gold/40 hover:text-[var(--gold)] transition-all"
                style={{ cursor: 'none' }}
              >
                Book Appointment
              </a>
            </div>
          </div>
        </CurtainReveal>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-[fadeIn_1s_2.5s_forwards]">
          <span className="text-[9px] font-sans tracking-[0.3em] uppercase text-[var(--white-soft)]/25">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[var(--gold)]/40 to-transparent" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-6 border-y border-white/5">
        <StatBlock stats={STATS} className="max-w-4xl mx-auto" />
      </section>

      {/* ── DESIGNER STRIP ── */}
      <DesignerStrip />

      {/* ── OCCASIONS ── */}
      <section className="py-24 px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
        <SectionHeading
          eyebrow="Shop by Occasion"
          heading="Every Moment Deserves a Story"
          subtext="From prom night to wedding day, we carry the designers and styles that make every occasion extraordinary."
          className="mb-16 max-w-xl"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {OCCASIONS.map((occ, i) => (
            <OccasionCard key={occ.title} {...occ} index={i} />
          ))}
        </div>
      </section>

      {/* ── FEATURE BLOCKS ── */}
      <div className="flex flex-col gap-32 py-16 px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
        <FeatureBlock
          eyebrow="Virtual Try-On"
          heading="See Yourself in Your Dream Dress"
          body="Upload your photo and virtually try on thousands of gowns with our AI-powered try-on tool. Visualize colors, silhouettes, and styles before you ever step foot in a boutique."
          cta={{ label: 'Try It Free', href: '/virtual-try-on' }}
          secondaryCta={{ label: 'Learn More', href: '/about' }}
          imageSeed="tryon-feature"
          imageAlt="Virtual try-on preview"
          features={[
            { icon: '✦', label: 'AI-powered dress visualization' },
            { icon: '✦', label: 'Personalized style tips from Aria' },
            { icon: '✦', label: 'Save looks to your wishlist' },
          ]}
        />

        <FeatureBlock
          eyebrow="Complimentary Appointments"
          heading="In-Store Styling, Elevated"
          body="Book a personal styling appointment at any of our 50+ partner boutiques. Our expert stylists will guide you through every detail — from silhouette to accessories — in a private, unhurried setting."
          cta={{ label: 'Book Now', href: '/appointments' }}
          secondaryCta={{ label: 'Find a Store', href: '/stores' }}
          imageSeed="appointment-feature"
          imageAlt="In-store styling appointment"
          reverse
          accent="blush"
          features={[
            { icon: '◇', label: '60–90 minute private session' },
            { icon: '◇', label: 'Expert stylists at every location' },
            { icon: '◇', label: 'Complimentary, no pressure' },
          ]}
        />
      </div>

      {/* ── ARIA CTA STRIP ── */}
      <section className="py-20 px-6 text-center border-y border-white/5 bg-[var(--bg-elevated)]">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold/20 to-blush/10 border border-gold/25 flex items-center justify-center">
            <span className="text-xl text-[var(--gold)]">✦</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-[var(--white-soft)]">
            Meet Aria, Your Style Concierge
          </h2>
          <p className="text-base font-sans text-[var(--white-soft)]/50 leading-relaxed">
            Ask about dress colors, designer availability, store hours, or get personalized styling advice — Aria is available 24/7 in the chat widget below.
          </p>
          <button
            onClick={() => document.querySelector<HTMLButtonElement>('[data-chat-toggle]')?.click()}
            className="h-[52px] px-8 border border-[var(--gold)]/40 text-[var(--gold)] font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-[var(--glass-gold)] transition-all"
            style={{ cursor: 'none' }}
          >
            Chat with Aria ✦
          </button>
        </div>
      </section>

      <ChatWidget pageContext="home" />
    </>
  )
}
