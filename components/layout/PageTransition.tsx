'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ── TYPES ─────────────────────────────────────────────────────

interface PageTransitionProps {
  children: ReactNode
}

// ── WIPE OVERLAY ──────────────────────────────────────────────

function WipeOverlay({ isTransitioning }: { isTransitioning: boolean }) {
  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="wipe"
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'fixed inset-0 z-[300] flex items-center justify-center',
            'bg-[var(--bg-primary)]'
          )}
          aria-hidden="true"
        >
          {/* Wordmark flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.55, times: [0, 0.2, 0.7, 1] }}
            className="flex flex-col items-center gap-1 select-none"
          >
            <span className="font-serif text-xl text-[var(--gold)] tracking-[0.4em] uppercase">
              Top 10
            </span>
            <span className="font-sans text-xs text-[var(--gold)]/60 tracking-[0.6em] uppercase font-semibold">
              Prom
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── PAGE CONTENT WRAPPER ──────────────────────────────────────

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
  },
}

// ── COMPONENT ─────────────────────────────────────────────────

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      setIsTransitioning(true)
      prevPathname.current = pathname

      const timer = setTimeout(() => {
        setIsTransitioning(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [pathname])

  return (
    <>
      <WipeOverlay isTransitioning={isTransitioning} />

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={contentVariants}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default PageTransition
