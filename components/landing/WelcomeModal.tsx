'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Modal } from '@/components/ui/Modal'
import { GoldButton, BlushButton, GhostButton } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

// ── WELCOME MODAL ──────────────────────────────────────────────
// Shows on first visit, stores dismissal in localStorage

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Show after 2s delay on first visit
    const dismissed = localStorage.getItem('top10prom_welcome_dismissed')
    if (!dismissed) {
      const t = setTimeout(() => setIsOpen(true), 2000)
      return () => clearTimeout(t)
    }
  }, [])

  const dismiss = () => {
    setIsOpen(false)
    localStorage.setItem('top10prom_welcome_dismissed', '1')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={dismiss}
      size="md"
      title="Welcome to Top 10 Prom"
    >
      <div className="flex flex-col">
        {/* Hero image area */}
        <div
          className="relative h-48 bg-[var(--glass-gold)] overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgba(212,175,114,0.15) 0%, rgba(242,181,199,0.1) 100%)',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="font-serif text-5xl text-[var(--gold)] tracking-[0.4em] uppercase leading-none">
                Top 10
              </p>
              <p className="font-sans text-xs text-[var(--gold)]/50 tracking-[1em] uppercase font-semibold mt-2">
                Prom
              </p>
            </div>
          </div>
          {/* Decorative sparkles */}
          {['top-4 left-8', 'top-8 right-12', 'bottom-6 left-16', 'bottom-4 right-6'].map((pos, i) => (
            <span
              key={i}
              className="absolute text-[var(--gold)]/30 text-lg animate-pulse"
              style={{ top: pos.split(' ')[0].replace('top-', ''), left: pos.split(' ')[1] }}
            >
              ✦
            </span>
          ))}
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col gap-5">
          <div className="text-center">
            <h2 className="font-serif text-2xl text-[var(--white-soft)] mb-2">
              Welcome to Top 10 Prom
            </h2>
            <p className="text-sm text-[var(--white-soft)]/60 font-sans leading-relaxed">
              Asheville's premier destination for prom, bridal, and formalwear —
              with 50+ boutique partner locations nationwide.
            </p>
          </div>

          {/* Occasion selector */}
          <div>
            <p className="text-[10px] font-sans font-semibold tracking-[0.25em] uppercase text-[var(--gold)] mb-3 text-center">
              What brings you here?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Prom Dress', emoji: '✨', href: '/prom' },
                { label: 'Bridal Gown', emoji: '🌸', href: '/bridal' },
                { label: 'Tuxedo', emoji: '🤵', href: '/tux' },
                { label: 'Just Browsing', emoji: '👀', href: '/shop' },
              ].map((opt) => (
                <Link
                  key={opt.label}
                  href={opt.href}
                  onClick={dismiss}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 rounded-xl',
                    'border border-white/10 bg-[var(--glass-light)]',
                    'hover:border-gold/35 hover:bg-[var(--glass-gold)]',
                    'transition-all duration-200',
                    'text-sm font-sans text-[var(--white-soft)]/80 hover:text-[var(--white-soft)]'
                  )}
                  style={{ cursor: 'none' }}
                >
                  <span>{opt.emoji}</span>
                  <span>{opt.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <GoldButton fullWidth>
            <Link href="/appointments" onClick={dismiss} style={{ cursor: 'none' }}>
              Book a Styling Appointment
            </Link>
          </GoldButton>

          {/* Dismiss */}
          <button
            onClick={dismiss}
            className="text-xs text-[var(--white-soft)]/30 hover:text-[var(--white-soft)]/50 font-sans text-center transition-colors"
            style={{ cursor: 'none' }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default WelcomeModal
