import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FeatureBlock } from '@/components/landing/FeatureBlock'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { SectionHeading } from '@/components/animations/ScrollReveal'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { DRESSES } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Bridal Collection | Top 10 Prom',
  description: 'Build your entire wedding party wardrobe at Top 10 Prom. Bridal gowns, bridesmaid dresses, mother-of-the-bride, flower girl, and tuxedos — all under one roof.',
  openGraph: {
    title: 'Bridal Collection | Top 10 Prom',
    description: 'Wedding gowns, bridesmaid dresses, and formalwear for every member of your wedding party.',
    images: [{ url: 'https://picsum.photos/seed/bridal-og/1200/630', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://top10prom.com'}/bridal` },
}

const bridalDresses = DRESSES.filter(d => d.occasions.includes('bridal')).slice(0, 16)

const ROLES = [
  { id: 'bride', label: 'Bride', icon: '◇', desc: 'Gowns that begin the story', href: '/shop?occasion=bridal&role=bride' },
  { id: 'bridesmaid', label: 'Bridesmaid', icon: '◈', desc: 'Coordinated, individual', href: '/shop?occasion=bridal&role=bridesmaid' },
  { id: 'mother', label: 'Mother of Bride/Groom', icon: '✦', desc: 'Elegant & timeless', href: '/shop?occasion=bridal&role=mother' },
  { id: 'flower', label: 'Flower Girl', icon: '♛', desc: 'Sweet details, big style', href: '/shop?occasion=bridal&role=flower' },
]

export default function BridalPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative w-full min-h-[70vh] flex items-end pb-16 px-6 md:px-12 lg:px-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'url(https://picsum.photos/seed/bridal-hero-bg/1600/900)', backgroundSize: 'cover', backgroundPosition: 'center top', opacity: 0.3 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/60 to-transparent" />
        {/* Blush tint overlay */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(242,181,199,0.08) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-screen-xl mx-auto w-full">
          <p className="text-[10px] font-sans font-semibold tracking-[0.4em] uppercase text-[var(--blush)] mb-3">For Every Love Story</p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--white-soft)] max-w-2xl leading-tight mb-4">
            Bridal Collection
          </h1>
          <p className="text-base font-sans text-[var(--white-soft)]/50 max-w-lg leading-relaxed mb-8">
            From the first look to the last dance, we dress every member of your wedding party in styles that tell your story.
          </p>
          <Link
            href="/appointments"
            className="inline-flex h-[52px] px-8 items-center bg-[var(--blush)] text-[var(--bg-primary)] font-sans text-xs font-bold tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
            style={{ cursor: 'none' }}
          >
            Book Bridal Appointment
          </Link>
        </div>
      </section>

      {/* ── BUILD YOUR WEDDING PARTY ── */}
      <section className="py-20 px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
        <SectionHeading
          eyebrow="Build Your Wedding Party"
          heading="Every Role, Every Style"
          subtext="Shop by role to find coordinated looks that work beautifully together — without being matchy-matchy."
          accent="blush"
          className="mb-12 max-w-xl"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ROLES.map((role, i) => (
            <Link
              key={role.id}
              href={role.href}
              className="flex flex-col items-center gap-4 p-6 rounded-2xl border border-white/10 bg-[var(--glass-light)] hover:border-blush/30 hover:bg-[var(--glass-blush)] transition-all duration-300 text-center group"
              style={{ cursor: 'none' }}
            >
              <span className="text-2xl text-[var(--white-soft)]/25 group-hover:text-[var(--blush)] transition-colors">{role.icon}</span>
              <div>
                <p className="font-sans font-semibold text-sm text-[var(--white-soft)]/80 group-hover:text-[var(--white-soft)] transition-colors">{role.label}</p>
                <p className="text-[10px] font-sans text-[var(--white-soft)]/35 mt-1">{role.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BRIDAL GRID ── */}
      <section className="pb-16 px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
        <h2 className="font-serif text-3xl text-[var(--white-soft)] mb-10">Featured Bridal Styles</h2>
        <ProductGrid dresses={bridalDresses} />
      </section>

      {/* ── FEATURE ── */}
      <section className="py-8 px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
        <FeatureBlock
          eyebrow="Bridal Appointments"
          heading="Your Private Bridal Suite"
          body="Our bridal appointments are complimentary, unhurried, and completely personal. Bring your whole party — we have space for everyone. Our stylists specialize in finding looks that complement each other beautifully."
          cta={{ label: 'Book Now', href: '/appointments' }}
          secondaryCta={{ label: 'Find a Store', href: '/stores' }}
          imageSeed="bridal-feature"
          imageAlt="Bridal styling appointment"
          accent="blush"
          features={[
            { icon: '◇', label: 'Private suite for your entire party' },
            { icon: '◇', label: 'Coordinated look curation' },
            { icon: '◇', label: 'Alteration services available' },
          ]}
        />
      </section>

      <ChatWidget pageContext="bridal" />
    </>
  )
}
