'use client'

import {
  useRef,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { motion, useInView, useAnimation, type TargetAndTransition } from 'framer-motion'
import { cn } from '@/lib/utils'
import { prefersReducedMotion } from '@/lib/utils'

// ── TYPES ─────────────────────────────────────────────────────

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade'

interface ScrollRevealProps {
  children: ReactNode
  direction?: RevealDirection
  delay?: number
  duration?: number
  distance?: number
  threshold?: number
  once?: boolean
  className?: string
  style?: CSSProperties
  as?: keyof JSX.IntrinsicElements
}

// ── DIRECTION → INITIAL VARIANT MAP ──────────────────────────

function getInitialVariant(
  direction: RevealDirection,
  distance: number,
  reduced: boolean
): TargetAndTransition {
  if (reduced) return { opacity: 0 }

  const map: Record<RevealDirection, TargetAndTransition> = {
    up: { opacity: 0, y: distance },
    down: { opacity: 0, y: -distance },
    left: { opacity: 0, x: distance },
    right: { opacity: 0, x: -distance },
    fade: { opacity: 0 },
  }
  return map[direction]
}

// ── COMPONENT ─────────────────────────────────────────────────

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  distance = 32,
  threshold = 0.15,
  once = true,
  className,
  style,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })
  const controls = useAnimation()
  const reduced = prefersReducedMotion()

  const hidden = getInitialVariant(direction, distance, reduced)
  const visible = { opacity: 1, x: 0, y: 0 }

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    } else if (!once) {
      controls.start('hidden')
    }
  }, [isInView, controls, once])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: hidden,
        visible: {
          ...visible,
          transition: {
            duration: reduced ? 0.2 : duration,
            delay,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

// ── SECTION HEADING REVEAL ─────────────────────────────────────
// Eyebrow → heading → gold rule → subtext stagger pattern

interface SectionHeadingProps {
  eyebrow?: string
  heading: string
  subtext?: string
  align?: 'left' | 'center' | 'right'
  eyebrowColor?: 'gold' | 'blush'
  className?: string
  headingClassName?: string
}

export function SectionHeading({
  eyebrow,
  heading,
  subtext,
  align = 'center',
  eyebrowColor = 'gold',
  className,
  headingClassName,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const reduced = prefersReducedMotion()

  const alignClass = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }[align]

  const eyebrowColorClass =
    eyebrowColor === 'blush' ? 'text-[var(--blush)]' : 'text-[var(--gold)]'

  const baseTransition = {
    duration: reduced ? 0.2 : 0.7,
    ease: [0.16, 1, 0.3, 1],
  }

  return (
    <div
      ref={ref}
      className={cn('flex flex-col gap-4', alignClass, className)}
    >
      {/* Eyebrow */}
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...baseTransition, delay: 0 }}
          className={cn(
            'text-xs font-sans font-semibold tracking-[0.3em] uppercase',
            eyebrowColorClass
          )}
        >
          {eyebrow}
        </motion.p>
      )}

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: reduced ? 0 : 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ ...baseTransition, delay: eyebrow ? 0.08 : 0 }}
        className={cn(
          'font-serif text-4xl md:text-5xl text-[var(--white-soft)] leading-tight',
          headingClassName
        )}
      >
        {heading}
      </motion.h2>

      {/* Gold rule */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
        transition={{
          duration: reduced ? 0.2 : 0.6,
          delay: eyebrow ? 0.18 : 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={cn(
          'h-px w-16 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent',
          align === 'left' ? 'origin-left' : align === 'right' ? 'origin-right' : 'origin-center'
        )}
      />

      {/* Subtext */}
      {subtext && (
        <motion.p
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...baseTransition, delay: 0.28 }}
          className="text-base text-[var(--white-soft)]/60 font-sans leading-relaxed max-w-xl"
        >
          {subtext}
        </motion.p>
      )}
    </div>
  )
}

export default ScrollReveal
