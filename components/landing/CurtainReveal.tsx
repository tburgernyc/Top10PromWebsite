'use client'

import { useRef, useEffect, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { prefersReducedMotion } from '@/lib/utils'

// ── CURTAIN REVEAL ─────────────────────────────────────────────
// Gold curtain panels sweep away to reveal content beneath

interface CurtainRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  threshold?: number
  curtainColor?: string
}

export function CurtainReveal({
  children,
  className,
  delay = 0,
  threshold = 0.3,
  curtainColor = 'var(--gold)',
}: CurtainRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, amount: threshold })
  const reduced = prefersReducedMotion()

  if (reduced) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {/* Content */}
      <motion.div
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
        transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>

      {/* Left curtain panel */}
      <motion.div
        initial={{ scaleX: 1, originX: 0 }}
        animate={isInView ? { scaleX: 0 } : {}}
        transition={{ duration: 0.75, delay: delay + 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-y-0 left-0 w-1/2"
        style={{ backgroundColor: curtainColor, transformOrigin: 'right' }}
        aria-hidden="true"
      />

      {/* Right curtain panel */}
      <motion.div
        initial={{ scaleX: 1, originX: 1 }}
        animate={isInView ? { scaleX: 0 } : {}}
        transition={{ duration: 0.75, delay: delay + 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-y-0 right-0 w-1/2"
        style={{ backgroundColor: curtainColor, transformOrigin: 'left' }}
        aria-hidden="true"
      />
    </div>
  )
}

// ── TEXT CURTAIN (inline text reveal) ─────────────────────────

interface TextCurtainProps {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export function TextCurtain({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: TextCurtainProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, amount: 0.5 })
  const reduced = prefersReducedMotion()

  const MotionTag = motion[Tag as keyof typeof motion] as typeof motion.div

  return (
    <div ref={ref} className="overflow-hidden">
      <MotionTag
        initial={reduced ? { opacity: 0 } : { y: '110%' }}
        animate={isInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: reduced ? 0.3 : 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </MotionTag>
    </div>
  )
}

// ── HERO CURTAIN (full-viewport split curtain) ─────────────────

interface HeroCurtainProps {
  onComplete?: () => void
  delay?: number
  children?: ReactNode
}

export function HeroCurtain({ onComplete, delay = 0.5, children }: HeroCurtainProps) {
  const reduced = prefersReducedMotion()

  return (
    <div className="relative">
      {children}

      {/* Full-screen curtain panels that sweep on page load */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'top' }}
        className="fixed inset-0 z-[400] bg-[var(--bg-primary)]"
        onAnimationComplete={onComplete}
        aria-hidden="true"
      />
    </div>
  )
}

export default CurtainReveal
