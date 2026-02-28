'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/components/shop/CartContext'

// ── GOLD CONFETTI BURST ────────────────────────────────────────

function ConfettiBurst() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; alpha: number }[] = []
    const colors = ['#D4AF72', '#F0D090', '#F2B5C7', '#F8F4F0', '#9B6FD4']

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.8) * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3,
        alpha: 1,
      })
    }

    let raf: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.3
        p.alpha -= 0.015
        if (p.alpha > 0) {
          alive = true
          ctx.globalAlpha = p.alpha
          ctx.fillStyle = p.color
          ctx.fillRect(p.x, p.y, p.size, p.size * 0.5)
        }
      })
      ctx.globalAlpha = 1
      if (alive) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden
    />
  )
}

// ── INNER PAGE (uses useSearchParams — must be inside Suspense) ────

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCart()
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (sessionId) {
      clearCart()
      setShowConfetti(true)
      const t = setTimeout(() => setShowConfetti(false), 4000)
      return () => clearTimeout(t)
    }
  }, [sessionId, clearCart])

  return (
    <>
      <AnimatePresence>
        {showConfetti && <ConfettiBurst />}
      </AnimatePresence>

      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-8 max-w-lg"
        >
          {/* Success ring */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--gold)]/25 animate-ping" style={{ animationDuration: '2.5s' }} />
            <div className="absolute inset-2 rounded-full border border-[var(--gold)]/50 flex items-center justify-center">
              <span className="text-3xl text-[var(--gold)]">✓</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="font-serif text-4xl md:text-5xl text-[var(--white-soft)]">Order Confirmed</h1>
            <p className="text-base font-sans text-[var(--white-soft)]/50 leading-relaxed">
              Thank you for your order! You'll receive a confirmation email shortly with tracking information.
            </p>
            {sessionId && (
              <p className="text-xs font-sans text-[var(--white-soft)]/25 mt-2">
                Order reference: <span className="font-mono text-[var(--white-soft)]/40">{sessionId.slice(-12).toUpperCase()}</span>
              </p>
            )}
          </div>

          {/* What's next */}
          <div className="w-full flex flex-col gap-3 p-6 rounded-2xl bg-[var(--glass-light)] border border-white/10 text-left">
            <p className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[var(--white-soft)]/30">What Happens Next</p>
            {[
              { icon: '✦', text: 'Confirmation email sent to your inbox' },
              { icon: '◈', text: 'Order processed within 1–2 business days' },
              { icon: '◇', text: 'Shipping notification with tracking number' },
              { icon: '◉', text: 'Arrives in 5–7 business days (standard)' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-[var(--gold)]/50 text-xs">{item.icon}</span>
                <p className="text-sm font-sans text-[var(--white-soft)]/60">{item.text}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/dashboard"
              className="h-[52px] px-8 bg-[var(--gold)] text-[var(--bg-primary)] font-sans text-xs font-bold tracking-[0.2em] uppercase flex items-center hover:opacity-90 transition-opacity"
              style={{ cursor: 'none' }}
            >
              View My Orders
            </Link>
            <Link
              href="/shop"
              className="h-[52px] px-8 border border-white/15 text-[var(--white-soft)]/60 font-sans text-xs font-bold tracking-[0.1em] uppercase flex items-center hover:border-gold/30 hover:text-[var(--gold)] transition-all"
              style={{ cursor: 'none' }}
            >
              Continue Shopping
            </Link>
          </div>

          {/* Book appointment CTA */}
          <p className="text-sm font-sans text-[var(--white-soft)]/35">
            Want to ensure the perfect fit?{' '}
            <Link href="/appointments" className="text-[var(--gold)]/70 hover:text-[var(--gold)] transition-colors" style={{ cursor: 'none' }}>
              Book a complimentary styling appointment →
            </Link>
          </p>
        </motion.div>
      </main>
    </>
  )
}

// ── PAGE ──────────────────────────────────────────────────────

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ConfirmationContent />
    </Suspense>
  )
}
