import type { Metadata } from 'next'
import { FilteredGrid } from '@/components/shop/FilteredGrid'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { DRESSES } from '@/lib/mock-data'

export const metadata: Metadata = {
  title: 'Shop All Styles | Top 10 Prom',
  description: 'Browse thousands of prom dresses, bridal gowns, and formalwear. Filter by occasion, designer, color, size, and price. Free shipping on orders over $200.',
  openGraph: {
    title: 'Shop All Styles | Top 10 Prom',
    description: 'Thousands of designer gowns and formalwear. Shop now.',
    images: [{ url: 'https://picsum.photos/seed/shop-og/1200/630', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://top10prom.com'}/shop` },
}

export default function ShopPage() {
  return (
    <>
      {/* ── COMPACT HERO ── */}
      <section className="pt-28 pb-10 px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-[var(--gold)] mb-2">
              All Collections
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-[var(--white-soft)]">Shop</h1>
          </div>
          <p className="text-sm font-sans text-[var(--white-soft)]/40">
            {DRESSES.length} styles available
          </p>
        </div>
      </section>

      {/* ── FILTER + GRID ── */}
      <section className="pb-24 px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
        <FilteredGrid dresses={DRESSES} showLoadMore />
      </section>

      <CartDrawer />
      <ChatWidget pageContext="shop" />
    </>
  )
}
