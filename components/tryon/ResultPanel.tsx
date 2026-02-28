'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { StyleTipCard } from './StyleTipCard'
import { useCart } from '@/components/shop/CartContext'
import { useToast } from '@/components/ui/Toast'
import { formatPrice } from '@/lib/utils'
import type { Dress } from '@/types'

// ── TYPES ─────────────────────────────────────────────────────

interface ResultPanelProps {
  userPhoto: string | null
  dress: Dress | null
  selectedColor?: string
  className?: string
}

// ── RESULT PANEL ───────────────────────────────────────────────

export function ResultPanel({ userPhoto, dress, selectedColor, className }: ResultPanelProps) {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [view, setView] = useState<'result' | 'tips'>('result')

  const primaryColor = selectedColor
    ? dress?.colors.find(c => c.name === selectedColor)
    : dress?.colors[0]

  const handleAddToCart = () => {
    if (!dress) return
    const colorName = primaryColor?.name ?? dress.colors[0]?.name
    addItem(dress, 1, colorName, undefined)
    toast({ type: 'success', message: `Added ${dress.name} to cart` })
  }

  // Neither photo nor dress selected
  if (!userPhoto && !dress) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-4 py-12', className)}>
        <div className="w-16 h-16 rounded-2xl border border-white/10 bg-[var(--glass-light)] flex items-center justify-center">
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-[var(--white-soft)]/20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <p className="text-sm font-sans text-[var(--white-soft)]/25 text-center leading-relaxed">
          Upload your photo and select a dress<br />to see your virtual try-on result.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Tab toggle */}
      {userPhoto && dress && (
        <div className="flex gap-1 p-1 rounded-xl bg-[var(--glass-light)] border border-white/10">
          {(['result', 'tips'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={cn(
                'flex-1 py-2 rounded-lg text-xs font-sans font-semibold transition-all duration-200',
                view === tab
                  ? 'bg-[var(--glass-medium)] text-[var(--gold)] shadow-sm'
                  : 'text-[var(--white-soft)]/40 hover:text-[var(--white-soft)]/60'
              )}
              style={{ cursor: 'none' }}
            >
              {tab === 'result' ? 'Try-On Preview' : 'Style Tips ✦'}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {view === 'result' ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            {/* Side-by-side preview */}
            {userPhoto && dress ? (
              <div className="grid grid-cols-2 gap-3">
                {/* User photo */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-[9px] font-sans font-semibold tracking-[0.15em] uppercase text-[var(--white-soft)]/30 text-center">
                    Your Photo
                  </p>
                  <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{ aspectRatio: '3/4' }}>
                    <Image
                      src={userPhoto}
                      alt="Your photo"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Dress preview */}
                <div className="flex flex-col gap-1.5">
                  <p className="text-[9px] font-sans font-semibold tracking-[0.15em] uppercase text-[var(--white-soft)]/30 text-center">
                    Selected Style
                  </p>
                  <div className="relative rounded-2xl overflow-hidden border border-[var(--gold)]/25" style={{ aspectRatio: '3/4' }}>
                    <Image
                      src={dress.imageUrls[0] ?? `https://picsum.photos/seed/${dress.id}/400/533`}
                      alt={dress.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/60 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
            ) : userPhoto ? (
              <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{ aspectRatio: '3/4' }}>
                <Image src={userPhoto} alt="Your photo" fill className="object-cover" unoptimized />
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-primary)]/50 backdrop-blur-sm">
                  <p className="text-sm font-sans text-[var(--white-soft)]/60 text-center px-6">
                    Select a dress from the panel to see how it looks on you
                  </p>
                </div>
              </div>
            ) : dress ? (
              <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{ aspectRatio: '3/4' }}>
                <Image
                  src={dress.imageUrls[0] ?? `https://picsum.photos/seed/${dress.id}/400/533`}
                  alt={dress.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}

            {/* Perfect Corp SDK placeholder */}
            {userPhoto && dress && (
              <div className="p-3 rounded-xl bg-[var(--glass-light)] border border-white/8 text-center">
                <p className="text-[10px] font-sans text-[var(--white-soft)]/25 leading-relaxed">
                  AI try-on powered by Perfect Corp · Visualization is simulated · In-store fitting recommended
                </p>
              </div>
            )}

            {/* Dress info + CTA */}
            {dress && (
              <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[var(--glass-light)] border border-white/10">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-sans font-semibold text-[var(--white-soft)]/80">{dress.name}</p>
                    <p className="text-xs font-sans text-[var(--white-soft)]/40">{dress.designer}</p>
                  </div>
                  <p className="text-sm font-sans font-semibold text-[var(--gold)] flex-shrink-0">
                    {formatPrice(dress.price)}
                  </p>
                </div>

                {/* Color swatch */}
                {primaryColor && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: primaryColor.hex }}
                    />
                    <span className="text-xs font-sans text-[var(--white-soft)]/50">{primaryColor.name}</span>
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  className="w-full py-2.5 rounded-xl bg-[var(--gold)] text-[var(--bg-primary)] text-xs font-sans font-bold tracking-[0.15em] uppercase hover:opacity-90 transition-opacity"
                  style={{ cursor: 'none' }}
                >
                  Add to Cart
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="tips"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.3 }}
          >
            <StyleTipCard
              dress={dress}
              selectedColor={primaryColor?.name}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ResultPanel
