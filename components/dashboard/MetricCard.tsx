'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CounterAnimation } from '@/components/animations/CounterAnimation'

// ── TYPES ─────────────────────────────────────────────────────

type MetricTrend = 'up' | 'down' | 'neutral'

interface MetricCardProps {
  label: string
  value: number | string
  prefix?: string
  suffix?: string
  trend?: MetricTrend
  trendValue?: string
  trendLabel?: string
  icon?: ReactNode
  animate?: boolean
  className?: string
  accentColor?: 'gold' | 'blush' | 'emerald' | 'purple'
}

// ── TREND ICON ────────────────────────────────────────────────

function TrendIcon({ trend }: { trend: MetricTrend }) {
  if (trend === 'neutral') return null
  return (
    <svg
      width="12"
      height="12"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      className={trend === 'up' ? 'text-emerald-400' : 'text-red-400'}
    >
      {trend === 'up' ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
      )}
    </svg>
  )
}

// ── ACCENT STYLES ─────────────────────────────────────────────

const accentStyles = {
  gold: {
    glow: 'shadow-[var(--shadow-gold)]',
    border: 'border-gold/20',
    value: 'text-[var(--gold)]',
    icon: 'bg-[var(--glass-gold)] text-[var(--gold)]',
  },
  blush: {
    glow: 'shadow-[var(--shadow-blush)]',
    border: 'border-blush/20',
    value: 'text-[var(--blush)]',
    icon: 'bg-[var(--glass-blush)] text-[var(--blush)]',
  },
  emerald: {
    glow: '',
    border: 'border-emerald-500/20',
    value: 'text-emerald-400',
    icon: 'bg-emerald-500/10 text-emerald-400',
  },
  purple: {
    glow: '',
    border: 'border-purple-500/20',
    value: 'text-[var(--purple-accent)]',
    icon: 'bg-purple-500/10 text-[var(--purple-accent)]',
  },
}

// ── COMPONENT ─────────────────────────────────────────────────

export function MetricCard({
  label,
  value,
  prefix,
  suffix,
  trend,
  trendValue,
  trendLabel,
  icon,
  animate = true,
  className,
  accentColor = 'gold',
}: MetricCardProps) {
  const styles = accentStyles[accentColor]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'p-6 rounded-2xl',
        'bg-[var(--glass-light)] backdrop-blur-md',
        'border',
        styles.border,
        styles.glow,
        className
      )}
    >
      {/* Label row */}
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-sans font-semibold tracking-[0.2em] uppercase text-[var(--white-soft)]/50">
          {label}
        </p>
        {icon && (
          <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center', styles.icon)}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div className={cn('font-serif text-4xl leading-none mb-2', styles.value)}>
        {typeof value === 'number' && animate ? (
          <CounterAnimation
            value={value}
            prefix={prefix}
            suffix={suffix}
            duration={1.8}
          />
        ) : (
          <span>
            {prefix}
            {value}
            {suffix}
          </span>
        )}
      </div>

      {/* Trend */}
      {trend && trendValue && (
        <div className="flex items-center gap-1.5 mt-3">
          <TrendIcon trend={trend} />
          <span
            className={cn(
              'text-xs font-sans font-semibold',
              trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-[var(--white-soft)]/40'
            )}
          >
            {trendValue}
          </span>
          {trendLabel && (
            <span className="text-xs text-[var(--white-soft)]/30 font-sans">{trendLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ── METRIC GRID ───────────────────────────────────────────────

interface MetricGridProps {
  metrics: MetricCardProps[]
  columns?: 2 | 3 | 4
  className?: string
}

export function MetricGrid({ metrics, columns = 4, className }: MetricGridProps) {
  const colClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  }[columns]

  return (
    <div className={cn('grid gap-4', colClass, className)}>
      {metrics.map((metric, i) => (
        <MetricCard key={i} {...metric} />
      ))}
    </div>
  )
}

export default MetricCard
