'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView, useMotionValue, useSpring, animate } from 'framer-motion'
import { cn } from '@/lib/utils'
import { prefersReducedMotion } from '@/lib/utils'

// ── TYPES ─────────────────────────────────────────────────────

interface CounterProps {
  value: number
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
  decimals?: number
  separator?: string
  className?: string
  once?: boolean
}

interface StatBlockProps {
  stats: {
    value: number
    label: string
    prefix?: string
    suffix?: string
    decimals?: number
  }[]
  className?: string
  itemClassName?: string
}

// ── COUNTER ANIMATION ─────────────────────────────────────────

export function CounterAnimation({
  value,
  duration = 2,
  delay = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  separator = ',',
  className,
  once = true,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, amount: 0.5 })
  const reduced = prefersReducedMotion()
  const [displayValue, setDisplayValue] = useState('0')

  useEffect(() => {
    if (!isInView) return

    if (reduced) {
      setDisplayValue(formatNumber(value, decimals, separator))
      return
    }

    const start = 0
    const end = value
    const startTime = performance.now() + delay * 1000

    let frame: number

    const tick = (now: number) => {
      const elapsed = Math.max(0, now - startTime)
      const progress = Math.min(elapsed / (duration * 1000), 1)

      // Ease out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = start + (end - start) * eased

      setDisplayValue(formatNumber(current, decimals, separator))

      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [isInView, value, duration, delay, decimals, separator, reduced])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}

// ── HELPER ─────────────────────────────────────────────────────

function formatNumber(value: number, decimals: number, separator: string): string {
  const fixed = value.toFixed(decimals)
  const [int, dec] = fixed.split('.')
  const intFormatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  return decimals > 0 ? `${intFormatted}.${dec}` : intFormatted
}

// ── STAT BLOCK (group of counters) ────────────────────────────

export function StatBlock({ stats, className, itemClassName }: StatBlockProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <div
      ref={ref}
      className={cn(
        'grid grid-cols-2 md:grid-cols-4 gap-8',
        className
      )}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className={cn(
            'flex flex-col items-center text-center gap-2',
            itemClassName
          )}
        >
          <div className="font-serif text-4xl md:text-5xl text-[var(--gold)] leading-none">
            {isInView && (
              <CounterAnimation
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                decimals={stat.decimals ?? 0}
                delay={i * 0.15}
                duration={2}
              />
            )}
          </div>
          <p className="text-xs font-sans font-semibold tracking-[0.2em] uppercase text-[var(--white-soft)]/50">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  )
}

// ── PROGRESS BAR COUNTER ──────────────────────────────────────

interface ProgressCounterProps {
  value: number
  max?: number
  label?: string
  color?: 'gold' | 'blush' | 'emerald'
  className?: string
}

export function ProgressCounter({
  value,
  max = 100,
  label,
  color = 'gold',
  className,
}: ProgressCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const reduced = prefersReducedMotion()

  const percentage = Math.min((value / max) * 100, 100)

  const barColor = {
    gold: 'bg-[var(--gold)]',
    blush: 'bg-[var(--blush)]',
    emerald: 'bg-emerald-400',
  }[color]

  return (
    <div ref={ref} className={cn('flex flex-col gap-2', className)}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-xs font-sans font-semibold tracking-[0.15em] uppercase text-[var(--white-soft)]/60">
            {label}
          </span>
          <span className="text-sm font-serif text-[var(--gold)]">
            {isInView && (
              <CounterAnimation value={percentage} decimals={0} suffix="%" duration={1.5} />
            )}
          </span>
        </div>
      )}
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', barColor)}
          style={{
            width: isInView ? `${percentage}%` : '0%',
            transitionDuration: reduced ? '0ms' : '1500ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
    </div>
  )
}

export default CounterAnimation
