import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { VendorLoginForm } from '@/components/auth/VendorLoginForm'

const AuthCanvas = dynamic(() => import('@/components/landing/HeroCanvas'), { ssr: false })

export const metadata: Metadata = {
  title: 'Vendor Login | Top 10 Prom',
  description: 'Sign in to the Top 10 Prom vendor partner portal.',
  robots: { index: false },
}

export default function VendorLoginPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex relative items-end p-12 overflow-hidden bg-[var(--bg-secondary)]">
        <AuthCanvas />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)]/90 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col gap-6 max-w-md">
          <div className="w-8 h-px bg-[var(--gold)]/60" />
          <h2 className="font-serif text-3xl text-[var(--white-soft)] leading-tight">Partner Portal</h2>
          <p className="text-sm font-sans text-[var(--white-soft)]/50 leading-relaxed">
            Access your boutique analytics, manage inventory, track orders, and download marketing assets — all from your dedicated partner dashboard.
          </p>
          <div className="flex flex-col gap-2">
            {['Real-time revenue analytics', 'Inventory management', 'Order tracking & fulfillment', 'Marketing asset library'].map(f => (
              <div key={f} className="flex items-center gap-2">
                <span className="text-[var(--gold)]/50 text-xs">✦</span>
                <p className="text-xs font-sans text-[var(--white-soft)]/55">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center px-6 py-16 lg:px-16 bg-[var(--bg-primary)]">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-2 mb-10">
            <p className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-[var(--gold)]">Partner Access</p>
            <h1 className="font-serif text-3xl text-[var(--white-soft)]">Vendor Login</h1>
            <p className="text-sm font-sans text-[var(--white-soft)]/35">
              Authorized boutique partners only.
            </p>
          </div>
          <VendorLoginForm />
        </div>
      </div>
    </main>
  )
}
