'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Dress } from '@/types'

// ── TYPES ─────────────────────────────────────────────────────

interface StyleTipCardProps {
  dress: Dress | null
  selectedColor?: string
  className?: string
}

// ── STYLE TIP CARD ─────────────────────────────────────────────

export function StyleTipCard({ dress, selectedColor, className }: StyleTipCardProps) {
  const [tip, setTip] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [requested, setRequested] = useState(false)

  const fetchTip = async () => {
    if (!dress) return
    setLoading(true)
    setError(null)
    setRequested(true)

    try {
      const res = await fetch('/api/tryon/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dressName: dress.name,
          designer: dress.designer,
          color: selectedColor ?? dress.colors[0]?.name,
          occasion: dress.occasions[0],
        }),
      })

      if (!res.ok) throw new Error('Failed to get style tip')
      const data = await res.json()
      setTip(data.tip)
    } catch {
      setError('Aria is unavailable right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!dress) {
    return (
      <div className={cn('flex items-center justify-center py-8', className)}>
        <p className="text-sm font-sans text-[var(--white-soft)]/25 text-center">
          Select a dress to get personalized style tips from Aria.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Aria header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--gold)]/30 to-[var(--blush)]/20 border border-[var(--gold)]/30 flex items-center justify-center flex-shrink-0">
          <span className="text-sm text-[var(--gold)]">✦</span>
        </div>
        <div>
          <p className="text-xs font-sans font-semibold text-[var(--gold)]">Aria</p>
          <p className="text-[10px] font-sans text-[var(--white-soft)]/30">Your style concierge</p>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-2xl bg-[var(--glass-light)] border border-white/10 p-4 min-h-[120px] flex flex-col gap-3">
        <AnimatePresence mode="wait">
          {!requested ? (
            <motion.div
              key="cta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-4"
            >
              <p className="text-sm font-sans text-[var(--white-soft)]/50 text-center leading-relaxed">
                Get personalized styling advice for{' '}
                <span className="text-[var(--white-soft)]/80 font-semibold">{dress.name}</span>.
              </p>
              <button
                onClick={fetchTip}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--gold)]/15 to-[var(--blush)]/10 border border-gold/30 text-xs font-sans font-semibold text-[var(--gold)] hover:border-gold/50 hover:bg-[var(--glass-gold)] transition-all duration-200"
                style={{ cursor: 'none' }}
              >
                <span className="text-sm">✦</span>
                Ask Aria for style tips
              </button>
            </motion.div>
          ) : loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 py-4"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]/50"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>
              <p className="text-xs font-sans text-[var(--white-soft)]/40">Aria is thinking...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3 py-2"
            >
              <p className="text-xs font-sans text-red-400/70">{error}</p>
              <button
                onClick={fetchTip}
                className="text-xs font-sans text-[var(--gold)]/60 hover:text-[var(--gold)] transition-colors self-start"
                style={{ cursor: 'none' }}
              >
                Try again →
              </button>
            </motion.div>
          ) : tip ? (
            <motion.div
              key="tip"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3"
            >
              <p className="text-sm font-sans text-[var(--white-soft)]/75 leading-relaxed">{tip}</p>
              <button
                onClick={fetchTip}
                className="text-[10px] font-sans text-[var(--white-soft)]/25 hover:text-[var(--gold)]/60 transition-colors self-start"
                style={{ cursor: 'none' }}
              >
                Refresh tip ↺
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2">
        <a
          href="/appointments"
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-[var(--glass-light)] text-xs font-sans text-[var(--white-soft)]/60 hover:border-gold/30 hover:text-[var(--gold)] transition-all"
          style={{ cursor: 'none' }}
        >
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Book Fitting
        </a>
        <a
          href={`/shop/${dress.id}`}
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-[var(--glass-light)] text-xs font-sans text-[var(--white-soft)]/60 hover:border-gold/30 hover:text-[var(--gold)] transition-all"
          style={{ cursor: 'none' }}
        >
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
          </svg>
          Shop This Look
        </a>
      </div>
    </div>
  )
}

export default StyleTipCard
