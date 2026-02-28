import type { Metadata } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const HeroCanvas = dynamic(() => import('@/components/landing/HeroCanvas'), { ssr: false })

export const metadata: Metadata = {
  title: '404 — Page Not Found | Top 10 Prom',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      <HeroCanvas />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--bg-primary)_75%)]" />

      <div className="relative z-10 flex flex-col items-center text-center gap-8">
        {/* Giant 404 */}
        <h1
          className="font-serif text-[140px] md:text-[200px] leading-none select-none"
          style={{
            backgroundImage: 'linear-gradient(180deg, rgba(212,175,114,0.8) 0%, rgba(212,175,114,0.1) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </h1>

        <div className="flex flex-col gap-3 max-w-md">
          <h2 className="font-serif text-2xl text-[var(--white-soft)]">This page has left the building</h2>
          <p className="text-sm font-sans text-[var(--white-soft)]/45 leading-relaxed">
            The page you're looking for may have moved or no longer exists. Let's get you back to something beautiful.
          </p>
        </div>

        {/* CTA cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mt-4">
          {[
            { label: 'Shop Dresses', href: '/shop', icon: '✦', desc: 'Browse our full collection' },
            { label: 'Book Appointment', href: '/appointments', icon: '◇', desc: 'Visit a boutique near you' },
            { label: 'Go Home', href: '/', icon: '←', desc: 'Return to the homepage' },
          ].map(card => (
            <Link
              key={card.href}
              href={card.href}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/10 bg-[var(--glass-light)] hover:border-gold/30 hover:bg-[var(--glass-gold)] transition-all duration-300 group"
              style={{ cursor: 'none' }}
            >
              <span className="text-2xl text-[var(--gold)]/50 group-hover:text-[var(--gold)] transition-colors">{card.icon}</span>
              <p className="font-sans font-semibold text-sm text-[var(--white-soft)]/70 group-hover:text-[var(--white-soft)] transition-colors">{card.label}</p>
              <p className="text-[10px] font-sans text-[var(--white-soft)]/30">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
