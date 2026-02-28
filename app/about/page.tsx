import type { Metadata } from 'next'
import Image from 'next/image'
import { FeatureBlock } from '@/components/landing/FeatureBlock'
import { StatBlock } from '@/components/animations/CounterAnimation'
import { SectionHeading } from '@/components/animations/ScrollReveal'
import { ChatWidget } from '@/components/chat/ChatWidget'

export const metadata: Metadata = {
  title: 'Our Story | Top 10 Prom',
  description: 'Meet the team behind Top 10 Prom. We\'ve been helping customers find their perfect look for over 25 years from our flagship in Asheville, NC.',
  openGraph: {
    title: 'Our Story | Top 10 Prom',
    description: '25 years of styling expertise, 50+ boutique partners, and a passion for helping you look your best.',
    images: [{ url: 'https://picsum.photos/seed/about-og/1200/630', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://top10prom.com'}/about` },
}

const MILESTONES = [
  { year: '1999', title: 'Founded in Asheville', desc: 'Best Bride Prom & Tux opens its doors at 800-3 Fairview Rd, Asheville, NC.' },
  { year: '2005', title: 'First Partner Boutique', desc: 'The Top 10 Prom network grows beyond Asheville, welcoming the first regional partner.' },
  { year: '2012', title: '100,000 Customers', desc: 'A milestone celebration — 100,000 customers have found their perfect look with us.' },
  { year: '2018', title: 'Virtual Try-On Launch', desc: 'First in the region to offer AI-powered virtual try-on technology.' },
  { year: '2022', title: '50 Partner Locations', desc: 'The network reaches 50 boutique partner locations across the United States.' },
  { year: '2024', title: 'Meet Aria', desc: 'Launch of our AI style concierge, available 24/7 to guide every customer.' },
]

const STATS = [
  { label: 'Years in Business', value: 25 },
  { label: 'Partner Boutiques', value: 50, suffix: '+' },
  { label: 'Customers Styled', value: 120, suffix: 'K+' },
  { label: 'Designer Brands', value: 6, suffix: '+' },
]

export default function AboutPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative w-full min-h-[60vh] flex items-end pb-16 px-6 md:px-12 lg:px-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: 'url(https://picsum.photos/seed/about-hero/1600/900)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/70 to-transparent" />
        <div className="relative z-10 max-w-screen-xl mx-auto w-full">
          <p className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-[var(--gold)] mb-3">Est. 1999 · Asheville, NC</p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--white-soft)] max-w-2xl leading-tight">
            Our Story
          </h1>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-24 px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <p className="text-xs font-sans font-semibold tracking-[0.3em] uppercase text-[var(--gold)]">Who We Are</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[var(--white-soft)] leading-tight">
              More Than a Dress Shop
            </h2>
            <div className="h-px w-12 bg-gradient-to-r from-[var(--gold)] to-transparent" />
            <p className="text-base font-sans text-[var(--white-soft)]/60 leading-relaxed">
              Top 10 Prom began as a single boutique in Asheville, North Carolina — a passion project rooted in the belief that every person deserves to feel extraordinary on their biggest nights. Over 25 years later, we've grown to a nationwide network of 50+ partner boutiques, but our mission remains the same: to be the best part of your best night.
            </p>
            <p className="text-base font-sans text-[var(--white-soft)]/60 leading-relaxed">
              We carry designers like Johnathan Kayne, Ashley Lauren, Jessica Angel, and Tiffany Designs — names chosen for their exceptional craftsmanship, inclusive sizing, and ability to make every customer feel like the main character.
            </p>
          </div>
          <div className="relative rounded-3xl overflow-hidden border border-white/10" style={{ aspectRatio: '4/5' }}>
            <Image
              src="https://picsum.photos/seed/about-mission/800/1000"
              alt="Top 10 Prom boutique interior"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-6 border-y border-white/5 bg-[var(--bg-elevated)]">
        <StatBlock stats={STATS} className="max-w-4xl mx-auto" />
      </section>

      {/* ── FEATURE BLOCKS ── */}
      <div className="flex flex-col gap-24 py-24 px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
        <FeatureBlock
          eyebrow="Our Flagship"
          heading="Best Bride Prom & Tux, Asheville"
          body="Our HQ at 800-3 Fairview Rd is where it all started. Still family-operated, still the same commitment to personal service. Walk in, or call us at 828-774-5588 to schedule your private appointment."
          cta={{ label: 'Get Directions', href: '/stores' }}
          secondaryCta={{ label: 'Book Appointment', href: '/appointments' }}
          imageSeed="about-flagship"
          imageAlt="Top 10 Prom Asheville flagship boutique"
          features={[
            { icon: '✦', label: 'Private styling suites' },
            { icon: '✦', label: 'Complimentary alterations consultation' },
            { icon: '✦', label: 'Same-day rush available' },
          ]}
        />

        <FeatureBlock
          eyebrow="Our Designers"
          heading="Only the Best in Every Price Range"
          body="From $149 party dresses to $2,400 couture gowns, we've hand-selected every designer and style in our collection for quality, variety, and the ability to make every customer feel beautiful — regardless of budget."
          cta={{ label: 'Shop Collection', href: '/shop' }}
          imageSeed="about-designers"
          imageAlt="Designer dress collection"
          reverse
          accent="blush"
          features={[
            { icon: '◇', label: 'Johnathan Kayne' },
            { icon: '◇', label: 'Ashley Lauren' },
            { icon: '◇', label: 'Jessica Angel & more' },
          ]}
        />
      </div>

      {/* ── TIMELINE ── */}
      <section className="py-24 px-6 md:px-12 lg:px-20 bg-[var(--bg-elevated)] border-t border-white/5">
        <div className="max-w-screen-xl mx-auto">
          <SectionHeading
            eyebrow="25 Years of Excellence"
            heading="Our Journey"
            className="mb-16 max-w-lg"
          />
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--gold)]/30 via-[var(--gold)]/15 to-transparent" />

            <div className="flex flex-col gap-12">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className={`relative flex gap-8 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={`flex-1 md:w-1/2 pl-12 md:pl-0 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <span className="text-xs font-sans font-semibold tracking-[0.15em] text-[var(--gold)] mb-1 block">{m.year}</span>
                    <h3 className="font-serif text-xl text-[var(--white-soft)] mb-2">{m.title}</h3>
                    <p className="text-sm font-sans text-[var(--white-soft)]/50 leading-relaxed">{m.desc}</p>
                  </div>
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 top-1 md:-translate-x-1/2 w-3 h-3 rounded-full bg-[var(--gold)] border-2 border-[var(--bg-elevated)] shadow-[var(--shadow-gold)]" />
                  {/* Spacer */}
                  <div className="hidden md:block flex-1 md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ChatWidget pageContext="about" />
    </>
  )
}
