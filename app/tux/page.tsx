'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { GoldButton } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// ── TUX MATCH TOOL ────────────────────────────────────────────

const DRESS_COLORS = ['Black', 'Navy', 'Champagne', 'Blush', 'Burgundy', 'Emerald', 'Royal Blue', 'Red', 'Silver', 'White']

interface TuxRec { name: string; reason: string; accessory: string }

function TuxMatchTool() {
  const [color, setColor] = useState('')
  const [loading, setLoading] = useState(false)
  const [recs, setRecs] = useState<TuxRec[]>([])
  const [error, setError] = useState('')

  const handleMatch = async () => {
    if (!color) return
    setLoading(true)
    setError('')
    setRecs([])
    try {
      const res = await fetch('/api/tux/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dressColor: color, occasion: 'prom' }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setRecs(data.recommendations)
    } catch {
      setError('Could not generate recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-sans font-semibold tracking-[0.15em] uppercase text-[var(--white-soft)]/30">
          Select your date's dress color
        </p>
        <div className="flex flex-wrap gap-2">
          {DRESS_COLORS.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                'px-3 py-1.5 rounded-full text-[10px] font-sans font-semibold tracking-[0.1em] uppercase border transition-all duration-200',
                color === c
                  ? 'bg-[var(--gold)] border-transparent text-[var(--bg-primary)]'
                  : 'bg-[var(--glass-light)] border-white/10 text-[var(--white-soft)]/40 hover:border-gold/25'
              )}
              style={{ cursor: 'none' }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <GoldButton onClick={handleMatch} disabled={!color || loading} loading={loading}>
        {loading ? 'Matching...' : 'Find My Match ✦'}
      </GoldButton>

      {error && <p className="text-xs font-sans text-red-400/70">{error}</p>}

      <AnimatePresence>
        {recs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4"
          >
            {recs.map((rec, i) => (
              <motion.div
                key={rec.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-2xl bg-[var(--glass-light)] border border-white/10"
              >
                <div className="flex items-start gap-3">
                  <span className="text-[var(--gold)] text-sm mt-0.5">0{i + 1}</span>
                  <div className="flex flex-col gap-1">
                    <p className="font-sans font-semibold text-sm text-[var(--white-soft)]/80">{rec.name}</p>
                    <p className="text-xs font-sans text-[var(--white-soft)]/50 leading-relaxed">{rec.reason}</p>
                    <p className="text-xs font-sans text-[var(--gold)]/70 mt-1">✦ {rec.accessory}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            <Link
              href="/appointments"
              className="text-center text-xs font-sans text-[var(--gold)]/60 hover:text-[var(--gold)] transition-colors mt-2"
              style={{ cursor: 'none' }}
            >
              Book a fitting to try these on →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── TUX OPTIONS ───────────────────────────────────────────────

const TUX_STYLES = [
  { name: 'Classic Black Tuxedo', price: 249, seed: 'tux-black', desc: 'Perennial elegance. Black lapel, white shirt, black bow tie.' },
  { name: 'Slim-Fit Navy Suit', price: 229, seed: 'tux-navy', desc: 'Modern and sophisticated. Pairs with champagne or blush.' },
  { name: 'White Dinner Jacket', price: 219, seed: 'tux-white', desc: 'Resort-formal cool. Perfect for spring and summer events.' },
  { name: 'Charcoal Grey Suit', price: 199, seed: 'tux-charcoal', desc: 'Understated and versatile. Works with any dress color.' },
  { name: 'Velvet Blazer Set', price: 279, seed: 'tux-velvet', desc: 'Bold statement pieces in burgundy, emerald, and black.' },
  { name: 'Powder Blue Tuxedo', price: 239, seed: 'tux-blue', desc: 'Classic prom-ready style with a fresh, modern feel.' },
]

// ── PAGE ──────────────────────────────────────────────────────

export default function TuxPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative w-full min-h-[65vh] flex items-end pb-16 px-6 md:px-12 lg:px-20 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #07081a 0%, var(--bg-primary) 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'url(https://picsum.photos/seed/tux-hero-bg/1600/900)', backgroundSize: 'cover', backgroundPosition: 'center top' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/50 to-transparent" />
        {/* Cool navy tint */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(59,92,162,0.12) 0%, transparent 60%)' }} />

        <div className="relative z-10 max-w-screen-xl mx-auto w-full flex flex-col gap-4">
          <p className="text-[10px] font-sans font-semibold tracking-[0.4em] uppercase text-white/40">Menswear · Tuxedo · Suits</p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--white-soft)] max-w-xl leading-tight">
            The Look<br />
            <span className="text-[var(--gold)]">That Defines You</span>
          </h1>
          <p className="text-base font-sans text-[var(--white-soft)]/50 max-w-md leading-relaxed">
            Sharp, modern, and perfectly fitted. From classic black tie to bold statement suits — find the look that matches the moment.
          </p>
        </div>
      </section>

      {/* ── STYLES GRID ── */}
      <section className="py-20 px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
        <h2 className="font-serif text-3xl text-[var(--white-soft)] mb-10">Signature Styles</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {TUX_STYLES.map((tux, i) => (
            <ScrollReveal key={tux.name} delay={i * 0.08}>
              <Link
                href="/appointments"
                className="group flex flex-col rounded-2xl overflow-hidden border border-white/10 hover:border-gold/30 transition-all duration-300"
                style={{ cursor: 'none' }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
                  <Image
                    src={`https://picsum.photos/seed/${tux.seed}/600/800`}
                    alt={tux.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/80 via-transparent to-transparent" />
                </div>
                <div className="p-4 bg-[var(--glass-light)]">
                  <p className="font-serif text-lg text-[var(--white-soft)]/80 group-hover:text-[var(--gold)] transition-colors">{tux.name}</p>
                  <p className="text-xs font-sans text-[var(--white-soft)]/40 mt-1">{tux.desc}</p>
                  <p className="text-sm font-sans text-[var(--gold)] mt-2">From ${tux.price}</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── MATCH YOUR LOOK TOOL ── */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-[var(--bg-elevated)] border-y border-white/5">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <p className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-[var(--gold)]">AI-Powered</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[var(--white-soft)] leading-tight">
              Match Your Look
            </h2>
            <div className="h-px w-12 bg-gradient-to-r from-[var(--gold)] to-transparent" />
            <p className="text-base font-sans text-[var(--white-soft)]/55 leading-relaxed">
              Tell us your date's dress color and our AI style engine will recommend the perfect tux or suit pairings — including accessories to tie the whole look together.
            </p>
            <TuxMatchTool />
          </div>
          <div className="relative rounded-3xl overflow-hidden border border-white/10 hidden lg:block" style={{ aspectRatio: '4/5' }}>
            <Image
              src="https://picsum.photos/seed/tux-match-feature/800/1000"
              alt="Tux matching visualization"
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(59,92,162,0.15) 0%, transparent 60%)' }} />
          </div>
        </div>
      </section>

      {/* ── ACCESSORIES HORIZONTAL SCROLL ── */}
      <section className="py-20 px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto overflow-hidden">
        <h2 className="font-serif text-3xl text-[var(--white-soft)] mb-8">Complete the Look</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4">
          {['Bow Ties', 'Pocket Squares', 'Suspenders', 'Cufflinks', 'Shoes', 'Vest Sets'].map((acc, i) => (
            <div
              key={acc}
              className="flex-shrink-0 w-48 rounded-2xl overflow-hidden border border-white/10 group cursor-none hover:border-gold/30 transition-all"
            >
              <div className="relative h-48">
                <Image
                  src={`https://picsum.photos/seed/acc-${i}/192/192`}
                  alt={acc}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="192px"
                />
              </div>
              <div className="p-3 bg-[var(--glass-light)]">
                <p className="text-sm font-sans text-[var(--white-soft)]/70 group-hover:text-[var(--gold)] transition-colors">{acc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ChatWidget pageContext="tux" />
    </>
  )
}
