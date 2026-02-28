'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ── TYPES ─────────────────────────────────────────────────────

type BadgeVariant =
  | 'sale'
  | 'new'
  | 'exclusive'
  | 'featured'
  | 'hq'
  | 'processing'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'returned'
  | 'cancelled'
  | 'in_stock'
  | 'low_stock'
  | 'backordered'
  | 'discontinued'
  | 'gold'
  | 'blush'
  | 'glass'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
  size?: 'sm' | 'md'
}

// ── VARIANT STYLES ────────────────────────────────────────────

const variantStyles: Record<BadgeVariant, string> = {
  // Product badges
  sale: 'bg-blush/20 text-blush border border-blush/35',
  new: 'bg-gold/15 text-gold border border-gold/35',
  exclusive: 'bg-purple-accent/15 text-purple-accent border border-purple-accent/35 animate-[gradient-rotate_3s_ease_infinite]',
  featured: 'bg-gold text-bg-primary font-semibold',
  hq: 'bg-gradient-to-r from-gold to-gold-light text-bg-primary font-semibold',

  // Order status
  processing: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  confirmed: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
  shipped: 'bg-gold/15 text-gold border border-gold/30',
  delivered: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  returned: 'bg-white/5 text-white-soft/40 border border-white/10',
  cancelled: 'bg-red-500/15 text-red-400 border border-red-500/30',

  // Stock status
  in_stock: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  low_stock: 'bg-gold/15 text-gold border border-gold/30',
  backordered: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  discontinued: 'bg-white/5 text-white-soft/40 border border-white/10',

  // Generic
  gold: 'bg-gold/15 text-gold border border-gold/35',
  blush: 'bg-blush/15 text-blush border border-blush/35',
  glass: 'bg-[var(--glass-light)] text-white-soft/70 border border-white/10',
}

// ── COMPONENT ─────────────────────────────────────────────────

export function Badge({ variant = 'glass', children, className, size = 'md' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-sans font-semibold tracking-[0.1em] uppercase',
        size === 'sm' ? 'text-[9px] px-2 py-0.5' : 'text-[10px] px-3 py-1',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

// ── CORNER BADGE (for product cards) ────────────────────────

interface CornerBadgeProps {
  variant: 'sale' | 'new' | 'exclusive' | 'featured'
  className?: string
}

export function CornerBadge({ variant, className }: CornerBadgeProps) {
  const styles: Record<string, string> = {
    sale: 'bg-blush text-bg-primary',
    new: 'bg-gold text-bg-primary',
    exclusive: 'bg-purple-accent text-white',
    featured: 'bg-gold text-bg-primary',
  }

  const labels: Record<string, string> = {
    sale: 'SALE',
    new: 'NEW',
    exclusive: 'EXCLUSIVE',
    featured: 'FEATURED LOOK',
  }

  return (
    <div
      className={cn(
        'absolute top-3 left-3 z-10',
        'px-2.5 py-1 rounded-full',
        'text-[9px] font-sans font-bold tracking-[0.15em] uppercase',
        styles[variant],
        className
      )}
    >
      {labels[variant]}
    </div>
  )
}

// ── STATUS DOT ────────────────────────────────────────────────

interface StatusDotProps {
  status: 'online' | 'offline' | 'busy'
  className?: string
  pulse?: boolean
}

export function StatusDot({ status, className, pulse = false }: StatusDotProps) {
  const colors = {
    online: 'bg-emerald-400',
    offline: 'bg-white/30',
    busy: 'bg-gold',
  }

  return (
    <span
      className={cn(
        'inline-block w-2 h-2 rounded-full',
        colors[status],
        pulse && 'animate-pulse',
        className
      )}
    />
  )
}

export default Badge
