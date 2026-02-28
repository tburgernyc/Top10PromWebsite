import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { StoreList } from '@/components/stores/StoreCard'
import { STORES } from '@/lib/mock-data'
import { RegionFilter } from '@/components/stores/RegionFilter'
import { ChatWidget } from '@/components/chat/ChatWidget'

const StoreMap = dynamic(() => import('@/components/stores/StoreMap'), { ssr: false })

export const metadata: Metadata = {
  title: 'Find a Store | Top 10 Prom',
  description: 'Find Top 10 Prom partner boutiques near you. 50+ locations across the US. Book a styling appointment at your nearest store.',
  openGraph: {
    title: 'Find a Store | Top 10 Prom',
    description: '50+ partner boutiques nationwide. Find your nearest Top 10 Prom location.',
    images: [{ url: 'https://picsum.photos/seed/stores-og/1200/630', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://top10prom.com'}/stores` },
}

export default function StoresPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="pt-28 pb-10 px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
        <p className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-[var(--gold)] mb-2">
          50+ Locations
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--white-soft)] mb-3">Find a Store</h1>
        <p className="text-base font-sans text-[var(--white-soft)]/45 max-w-lg leading-relaxed">
          Our boutique partner locations span the country. Each offers expert styling, a curated selection, and complimentary appointment services.
        </p>
      </section>

      {/* ── 50/50 SPLIT ── */}
      <section className="px-6 md:px-0 pb-24">
        <div className="flex flex-col lg:flex-row gap-0 min-h-[600px]">
          {/* Map */}
          <div className="lg:w-1/2 h-[400px] lg:h-[700px] lg:sticky lg:top-20">
            <StoreMap className="h-full" stores={STORES} />
          </div>

          {/* Store list */}
          <div className="lg:w-1/2 flex flex-col px-6 md:px-12 py-6">
            <RegionFilter className="mb-6" />
            <StoreList />
          </div>
        </div>
      </section>

      <ChatWidget pageContext="stores" />
    </>
  )
}
