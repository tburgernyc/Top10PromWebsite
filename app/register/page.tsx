import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { RegisterForm } from '@/components/auth/RegisterForm'

const AuthCanvas = dynamic(() => import('@/components/landing/HeroCanvas'), { ssr: false })

export const metadata: Metadata = {
  title: 'Create Account | Top 10 Prom',
  description: 'Create your Top 10 Prom account to save your wishlist, track orders, and book styling appointments.',
  robots: { index: false },
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex relative items-end p-12 overflow-hidden bg-[var(--bg-secondary)]">
        <AuthCanvas />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)]/90 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col gap-6 max-w-md">
          <div className="w-8 h-px bg-[var(--gold)]/60" />
          <h2 className="font-serif text-3xl text-[var(--white-soft)] leading-tight">
            Your Perfect Look<br />
            <span className="text-[var(--gold)]">Starts Here</span>
          </h2>
          <div className="flex flex-col gap-3">
            {[
              'Save your favorite styles to your wishlist',
              'Book and manage styling appointments',
              'Access order history and tracking',
              'Get personalized style recommendations',
            ].map(benefit => (
              <div key={benefit} className="flex items-center gap-3">
                <span className="text-[var(--gold)]/60 text-xs">✦</span>
                <p className="text-sm font-sans text-[var(--white-soft)]/60">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center px-6 py-16 lg:px-16 bg-[var(--bg-primary)]">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-2 mb-10">
            <p className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-[var(--gold)]">Get Started</p>
            <h1 className="font-serif text-3xl text-[var(--white-soft)]">Create Account</h1>
            <p className="text-sm font-sans text-[var(--white-soft)]/40">
              Already have an account?{' '}
              <a href="/login" className="text-[var(--gold)] hover:opacity-80 transition-opacity" style={{ cursor: 'none' }}>
                Sign in →
              </a>
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </main>
  )
}
