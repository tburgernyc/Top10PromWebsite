'use client'

import { forwardRef, type ElementType, type ReactNode, type ComponentPropsWithRef } from 'react'
import { cn } from '@/lib/utils'

// ── TYPES ─────────────────────────────────────────────────────

type GlassVariant = 'light' | 'medium' | 'heavy' | 'gold' | 'blush'
type GlowType = 'gold' | 'blush' | 'purple' | 'none'
type BorderType = 'gold' | 'white' | 'blush' | 'none'
type RadiusType = 'card' | 'chip' | 'modal' | 'sm' | 'full'

interface GlassPanelProps {
  variant?: GlassVariant
  glow?: GlowType
  border?: BorderType
  radius?: RadiusType
  className?: string
  children?: ReactNode
  as?: ElementType
  hover?: boolean
  [key: string]: unknown
}

// ── STYLE MAPS ────────────────────────────────────────────────

const variantStyles: Record<GlassVariant, string> = {
  light: 'bg-[var(--glass-light)] backdrop-blur-md',
  medium: 'bg-[var(--glass-medium)] backdrop-blur-md',
  heavy: 'bg-[var(--glass-heavy)] backdrop-blur-lg',
  gold: 'bg-[var(--glass-gold)] backdrop-blur-md',
  blush: 'bg-[var(--glass-blush)] backdrop-blur-md',
}

const glowStyles: Record<GlowType, string> = {
  gold: 'shadow-gold',
  blush: 'shadow-blush',
  purple: 'shadow-[0_0_40px_rgba(155,111,212,0.15)]',
  none: '',
}

const borderStyles: Record<BorderType, string> = {
  gold: 'border border-gold/35',
  white: 'border border-white/10',
  blush: 'border border-blush/35',
  none: 'border-0',
}

const radiusStyles: Record<RadiusType, string> = {
  card: 'rounded-2xl',      // 16px
  chip: 'rounded-xl',       // 12px
  modal: 'rounded-3xl',     // 24px
  sm: 'rounded-lg',         // 8px
  full: 'rounded-full',
}

// ── COMPONENT ─────────────────────────────────────────────────

const GlassPanel = forwardRef<HTMLElement, GlassPanelProps>(
  (
    {
      variant = 'medium',
      glow = 'none',
      border = 'white',
      radius = 'card',
      className,
      children,
      as: Component = 'div',
      hover = false,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'transition-all duration-300',
          variantStyles[variant],
          glowStyles[glow],
          borderStyles[border],
          radiusStyles[radius],
          hover && 'hover:border-gold/35 hover:shadow-gold hover:-translate-y-0.5 cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

GlassPanel.displayName = 'GlassPanel'

export default GlassPanel
export type { GlassPanelProps, GlassVariant, GlowType, BorderType, RadiusType }
