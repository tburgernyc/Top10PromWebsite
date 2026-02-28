'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ── PRELOADER ──────────────────────────────────────────────────
// Shows on first visit, persists in sessionStorage

interface PreloaderProps {
  onComplete?: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'reveal'>('loading')

  useEffect(() => {
    // Already seen this session — skip
    if (sessionStorage.getItem('top10prom_loaded')) {
      setVisible(false)
      onComplete?.()
      return
    }

    // Simulate loading progress
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 12 + 3
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setTimeout(() => {
          setPhase('reveal')
          setTimeout(() => {
            setVisible(false)
            sessionStorage.setItem('top10prom_loaded', '1')
            onComplete?.()
          }, 900)
        }, 200)
      }
      setProgress(Math.min(p, 100))
    }, 80)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[500] bg-[var(--bg-primary)] flex flex-col items-center justify-center"
          aria-live="polite"
          aria-label="Loading Top 10 Prom"
        >
          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center gap-1 mb-12"
          >
            <span className="font-serif text-4xl text-[var(--gold)] tracking-[0.5em] uppercase">
              Top 10
            </span>
            <span className="font-sans text-xs text-[var(--gold)]/50 tracking-[1em] uppercase font-semibold">
              Prom
            </span>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-48 flex flex-col items-center gap-3"
          >
            <div className="w-full h-px bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-transparent via-[var(--gold)] to-[var(--gold-light)]"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="font-sans text-[10px] text-[var(--gold)]/50 tracking-[0.3em] uppercase">
              {Math.round(progress)}%
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-10 font-sans text-xs text-[var(--white-soft)] tracking-[0.3em] uppercase"
          >
            Where Every Dream Dress Lives
          </motion.p>

          {/* Radial gold glow */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212,175,114,0.06) 0%, transparent 70%)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Preloader
