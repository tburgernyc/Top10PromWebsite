import type { Metadata } from 'next'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { FilterPanel } from '@/components/shop/FilterPanel'
import { SectionHeading } from '@/components/animations/ScrollReveal'
import { DesignerStrip } from '@/components/landing/DesignerStrip'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { DRESSES } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Prom Dresses | Top 10 Prom',
  description: 'Shop thousands of designer prom dresses at Top 10 Prom. Find your perfect style in every color, silhouette, and price range. New arrivals daily.',
  openGraph: {
    title: 'Prom Dresses | Top 10 Prom',
    description: 'Thousands of designer prom dresses — new arrivals daily.',
    images: [{ url: 'https://picsum.photos/seed/prom-og/1200/630', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://top10prom.com'}/prom` },
}

const promDresses = DRESSES.filter(d => d.occasions.includes('prom'))

export default function PromPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative w-full min-h-[65vh] flex items-end pb-16 px-6 md:px-12 lg:px-20 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)' }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'url(https://picsum.photos/seed/prom-hero-bg/1600/900)', backgroundSize: 'cover', backgroundPosition: 'center top' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/60 to-transparent" />

        {/* Gold accent line */}
        <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

        <div className="relative z-10 max-w-screen-xl mx-auto w-full flex flex-col gap-4">
          <p className="text-[10px] font-sans font-semibold tracking-[0.4em] uppercase text-[var(--gold)]">
            New Season · {new Date().getFullYear()}
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--white-soft)] leading-tight max-w-2xl">
            Prom Collection
          </h1>
          <p className="text-base font-sans text-[var(--white-soft)]/50 max-w-md leading-relaxed">
            Find the gown that tells your story. Thousands of styles from the designers you love.
          </p>
        </div>
      </section>

      {/* ── DESIGNER STRIP ── */}
      <DesignerStrip />

      {/* ── GRID + FILTER ── */}
      <section className="py-16 px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
        <FilterPanel variant="bar" className="mb-10" />
        <ProductGrid
          dresses={promDresses}
          showLoadMore
        />
      </section>

      {/* ── EDITORIAL SPOTLIGHT ── */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-[var(--bg-elevated)] border-t border-white/5">
        <div className="max-w-screen-xl mx-auto">
          <SectionHeading
            eyebrow="Style Guides"
            heading="Prom Trends for {year}"
            subtext="Our stylists have curated the looks, silhouettes, and color stories that will define this prom season."
            className="mb-12 max-w-xl"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Classic Ball Gown', desc: 'Timeless princess silhouettes in ivory, champagne, and blush', seed: 'trend-ballgown' },
              { title: 'Sleek & Modern', desc: 'Minimalist column and sheath styles in bold, striking colors', seed: 'trend-modern' },
              { title: 'Floral Fantasy', desc: '3D florals, appliqués, and botanical embroideries in full bloom', seed: 'trend-floral' },
            ].map(trend => (
              <div key={trend.title} className="rounded-2xl overflow-hidden border border-white/10 group">
                <div
                  className="h-64 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(https://picsum.photos/seed/${trend.seed}/600/400)` }}
                />
                <div className="p-5 bg-[var(--glass-light)]">
                  <h3 className="font-serif text-xl text-[var(--white-soft)] mb-1">{trend.title}</h3>
                  <p className="text-xs font-sans text-[var(--white-soft)]/50">{trend.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ChatWidget pageContext="prom" />
    </>
  )
}
