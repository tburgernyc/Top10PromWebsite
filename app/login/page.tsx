import type { Metadata } from 'next'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { LoginForm } from '@/components/auth/LoginForm'

// Three.js panel - client only
const AuthCanvas = dynamic(() => import('@/components/landing/HeroCanvas'), { ssr: false })

export const metadata: Metadata = {
  title: 'Sign In | Top 10 Prom',
  description: 'Sign in to your Top 10 Prom account to access your wishlist, order history, and appointments.',
  robots: { index: false },
}

const QUOTES = [
  '"Fashion is the armor to survive the reality of everyday life."',
  '"Style is a way to say who you are without having to speak."',
  '"Elegance is not about being noticed, it\'s about being remembered."',
]

export default function LoginPage() {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* ── LEFT PANEL — Three.js / editorial ── */}
      <div className="hidden lg:flex relative items-end p-12 overflow-hidden bg-[var(--bg-secondary)]">
        <AuthCanvas />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)]/90 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col gap-4 max-w-md">
          <div className="w-8 h-px bg-[var(--gold)]/60" />
          <p className="font-serif text-2xl text-[var(--white-soft)]/80 italic leading-relaxed">{quote}</p>
          <div className="flex items-center gap-3 mt-2">
            <Image
              src="https://picsum.photos/seed/auth-avatar/60/60"
              alt="Customer"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-xs font-sans font-semibold text-[var(--white-soft)]/70">Verified Customer</p>
              <p className="text-[10px] font-sans text-[var(--white-soft)]/30">Top 10 Prom Community</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div className="flex items-center justify-center px-6 py-16 lg:px-16 bg-[var(--bg-primary)]">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-2 mb-10">
            <p className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-[var(--gold)]">Welcome Back</p>
            <h1 className="font-serif text-3xl text-[var(--white-soft)]">Sign In</h1>
            <p className="text-sm font-sans text-[var(--white-soft)]/40">
              Don't have an account?{' '}
              <a href="/register" className="text-[var(--gold)] hover:opacity-80 transition-opacity" style={{ cursor: 'none' }}>
                Create one →
              </a>
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
