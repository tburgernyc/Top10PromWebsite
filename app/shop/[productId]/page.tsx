import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { DRESSES } from '@/lib/mock-data'
import { formatPrice } from '@/lib/utils'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { CartDrawer } from '@/components/shop/CartDrawer'
import { ProductGrid } from '@/components/shop/ProductGrid'

interface Props {
  params: { productId: string }
}

export async function generateStaticParams() {
  return DRESSES.map(d => ({ productId: d.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const dress = DRESSES.find(d => d.id === params.productId)
  if (!dress) return { title: 'Product Not Found | Top 10 Prom' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://top10prom.com'
  return {
    title: `${dress.name} by ${dress.designer} | Top 10 Prom`,
    description: dress.description,
    openGraph: {
      title: `${dress.name} by ${dress.designer}`,
      description: dress.description,
      images: [{ url: dress.imageUrls[0] ?? `https://picsum.photos/seed/${dress.id}/1200/630`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' },
    alternates: { canonical: `${siteUrl}/shop/${dress.id}` },
  }
}

export default function ProductDetailPage({ params }: Props) {
  const dress = DRESSES.find(d => d.id === params.productId)
  if (!dress) notFound()

  const related = DRESSES.filter(
    d => d.id !== dress.id && d.occasions.some(o => dress.occasions.includes(o))
  ).slice(0, 8)

  const primaryColor = dress.colors[0]

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: dress.name,
    description: dress.description,
    brand: { '@type': 'Brand', name: dress.designer },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: dress.price,
      availability: 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://top10prom.com'}/shop/${dress.id}`,
    },
    image: dress.imageUrls[0] ?? `https://picsum.photos/seed/${dress.id}/800/1000`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="pt-20 pb-24 px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] font-sans text-[var(--white-soft)]/30 mb-10">
          <Link href="/" className="hover:text-[var(--gold)] transition-colors" style={{ cursor: 'none' }}>Home</Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-[var(--gold)] transition-colors" style={{ cursor: 'none' }}>Shop</Link>
          <span>›</span>
          <span className="text-[var(--white-soft)]/60">{dress.name}</span>
        </nav>

        {/* Product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="flex flex-col gap-4">
            <div className="relative rounded-3xl overflow-hidden border border-white/10" style={{ aspectRatio: '3/4' }}>
              <Image
                src={dress.imageUrls[0] ?? `https://picsum.photos/seed/${dress.id}/800/1000`}
                alt={dress.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Thumbnail row */}
            <div className="flex gap-3">
              {dress.imageUrls.slice(0, 3).map((url, i) => (
                <div key={i} className="relative w-20 h-28 rounded-xl overflow-hidden border border-white/10 cursor-none">
                  <Image
                    src={url}
                    alt={`${dress.name} view ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-6 lg:pt-4">
            {/* Badge */}
            {dress.isNew && (
              <span className="w-fit px-3 py-1 rounded-full text-[9px] font-sans font-bold tracking-[0.2em] uppercase bg-[var(--glass-gold)] border border-gold/35 text-[var(--gold)]">
                New Arrival
              </span>
            )}

            <div className="flex flex-col gap-2">
              <p className="text-xs font-sans text-[var(--white-soft)]/40 tracking-[0.15em] uppercase">{dress.designer}</p>
              <h1 className="font-serif text-3xl md:text-4xl text-[var(--white-soft)]">{dress.name}</h1>
              <div className="flex items-center gap-4 mt-1">
                {dress.isSale ? (
                  <>
                    <p className="text-2xl font-sans text-[var(--blush)]">{formatPrice(Math.round(dress.price * 0.8))}</p>
                    <p className="text-base font-sans text-[var(--white-soft)]/30 line-through">{formatPrice(dress.price)}</p>
                  </>
                ) : (
                  <p className="text-2xl font-sans text-[var(--gold)]">{formatPrice(dress.price)}</p>
                )}
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-[var(--gold)]/30 to-transparent w-16" />

            <p className="text-sm font-sans text-[var(--white-soft)]/60 leading-relaxed">{dress.description}</p>

            {/* Colors */}
            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-sans font-semibold tracking-[0.15em] uppercase text-[var(--white-soft)]/30">
                Color: <span className="text-[var(--white-soft)]/60 normal-case tracking-normal font-normal">{primaryColor?.name}</span>
              </p>
              <div className="flex gap-2">
                {dress.colors.map(color => (
                  <button
                    key={color.name}
                    className="w-8 h-8 rounded-full border-2 border-white/20 hover:border-white/60 transition-colors"
                    style={{ backgroundColor: color.hex, cursor: 'none' }}
                    title={color.name}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-sans font-semibold tracking-[0.15em] uppercase text-[var(--white-soft)]/30">Size</p>
                <button className="text-[10px] font-sans text-[var(--gold)]/60 hover:text-[var(--gold)] transition-colors" style={{ cursor: 'none' }}>Size Guide →</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {dress.sizes.map(size => (
                  <button
                    key={size}
                    className="w-12 h-10 rounded-xl border border-white/15 text-xs font-sans text-[var(--white-soft)]/60 hover:border-gold/40 hover:text-[var(--gold)] transition-all"
                    style={{ cursor: 'none' }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 mt-2">
              <button
                className="w-full h-[52px] bg-[var(--gold)] text-[var(--bg-primary)] font-sans text-xs font-bold tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
                style={{ cursor: 'none' }}
              >
                Add to Cart
              </button>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/virtual-try-on"
                  className="h-12 border border-white/15 text-[var(--white-soft)]/60 font-sans text-xs font-semibold tracking-[0.1em] uppercase flex items-center justify-center gap-2 hover:border-gold/30 hover:text-[var(--gold)] transition-all"
                  style={{ cursor: 'none' }}
                >
                  ✦ Try On
                </Link>
                <Link
                  href="/appointments"
                  className="h-12 border border-white/15 text-[var(--white-soft)]/60 font-sans text-xs font-semibold tracking-[0.1em] uppercase flex items-center justify-center gap-2 hover:border-gold/30 hover:text-[var(--gold)] transition-all"
                  style={{ cursor: 'none' }}
                >
                  ◇ Book Fitting
                </Link>
              </div>
            </div>

            {/* Details accordion */}
            <div className="flex flex-col gap-0 border-t border-white/8 mt-2">
              {[
                { label: 'Occasions', value: dress.occasions.map(o => o.charAt(0).toUpperCase() + o.slice(1)).join(', ') },
                { label: 'Available Sizes', value: dress.sizes.join(', ') },
                { label: 'Shipping', value: 'Free standard shipping on orders over $200. Express available.' },
                { label: 'Returns', value: '30-day returns on unworn items with original tags attached.' },
              ].map(detail => (
                <div key={detail.label} className="flex gap-4 py-3 border-b border-white/5">
                  <span className="text-[10px] font-sans font-semibold tracking-[0.1em] uppercase text-[var(--white-soft)]/30 w-24 flex-shrink-0 pt-0.5">{detail.label}</span>
                  <span className="text-xs font-sans text-[var(--white-soft)]/55 leading-relaxed">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="font-serif text-3xl text-[var(--white-soft)] mb-10">You May Also Love</h2>
            <ProductGrid dresses={related} />
          </section>
        )}
      </main>

      <CartDrawer />
      <ChatWidget pageContext="product detail" />
    </>
  )
}
