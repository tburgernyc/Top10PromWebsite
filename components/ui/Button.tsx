'use client'

import {
  forwardRef,
  useRef,
  useCallback,
  type ButtonHTMLAttributes,
  type ReactNode,
  type MouseEvent,
} from 'react'
import { cn } from '@/lib/utils'

// ── TYPES ─────────────────────────────────────────────────────

type ButtonVariant = 'gold' | 'blush' | 'ghost' | 'icon'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children?: ReactNode
  className?: string
  fullWidth?: boolean
}

// ── RIPPLE EFFECT ─────────────────────────────────────────────

function createRipple(button: HTMLButtonElement, e: MouseEvent<HTMLButtonElement>) {
  const existing = button.querySelector('.ripple')
  if (existing) existing.remove()

  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height) * 2
  const x = e.clientX - rect.left - size / 2
  const y = e.clientY - rect.top - size / 2

  const ripple = document.createElement('span')
  ripple.className = 'ripple'
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    transform: scale(0);
    animation: ripple-expand 0.6s linear;
    pointer-events: none;
  `
  button.appendChild(ripple)
  setTimeout(() => ripple.remove(), 700)
}

// ── MAGNETIC HOVER (desktop only) ────────────────────────────

function useMagneticRef() {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleMouseMove = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    const btn = buttonRef.current
    if (!btn) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const rect = btn.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = e.clientX - centerX
    const deltaY = e.clientY - centerY
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)
    const radius = 20

    if (distance < radius) {
      const strength = (radius - distance) / radius
      btn.style.transform = `translate(${deltaX * strength * 0.3}px, ${deltaY * strength * 0.3}px)`
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    const btn = buttonRef.current
    if (!btn) return
    btn.style.transform = 'translate(0, 0)'
    btn.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
  }, [])

  return { buttonRef, handleMouseMove, handleMouseLeave }
}

// ── GOLD BUTTON ───────────────────────────────────────────────

export const GoldButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, children, loading, fullWidth, size = 'md', onClick, ...props },
    ref
  ) => {
    const { buttonRef, handleMouseMove, handleMouseLeave } = useMagneticRef()
    const combinedRef = useCallback(
      (node: HTMLButtonElement | null) => {
        ;(buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ref, buttonRef]
    )

    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        if (buttonRef.current) createRipple(buttonRef.current, e)
        onClick?.(e)
      },
      [onClick, buttonRef]
    )

    return (
      <button
        ref={combinedRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        disabled={loading || props.disabled}
        className={cn(
          'btn-base btn-gold relative overflow-hidden',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          fullWidth && 'w-full',
          size === 'sm' && 'h-10 min-w-0 text-[11px] px-4',
          size === 'lg' && 'h-14 px-8',
          className
        )}
        style={{ cursor: 'none' }}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading…</span>
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)
GoldButton.displayName = 'GoldButton'

// ── BLUSH BUTTON ──────────────────────────────────────────────

export const BlushButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, loading, fullWidth, size = 'md', onClick, ...props }, ref) => {
    const { buttonRef, handleMouseMove, handleMouseLeave } = useMagneticRef()
    const combinedRef = useCallback(
      (node: HTMLButtonElement | null) => {
        ;(buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ref, buttonRef]
    )

    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        if (buttonRef.current) createRipple(buttonRef.current, e)
        onClick?.(e)
      },
      [onClick, buttonRef]
    )

    return (
      <button
        ref={combinedRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        disabled={loading || props.disabled}
        className={cn(
          'btn-base btn-blush relative overflow-hidden',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          fullWidth && 'w-full',
          size === 'sm' && 'h-10 min-w-0 text-[11px] px-4',
          size === 'lg' && 'h-14 px-8',
          className
        )}
        style={{ cursor: 'none' }}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading…</span>
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)
BlushButton.displayName = 'BlushButton'

// ── GHOST BUTTON ──────────────────────────────────────────────

export const GhostButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, loading, fullWidth, size = 'md', onClick, ...props }, ref) => {
    const { buttonRef, handleMouseMove, handleMouseLeave } = useMagneticRef()
    const combinedRef = useCallback(
      (node: HTMLButtonElement | null) => {
        ;(buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ref, buttonRef]
    )

    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        if (buttonRef.current) createRipple(buttonRef.current, e)
        onClick?.(e)
      },
      [onClick, buttonRef]
    )

    return (
      <button
        ref={combinedRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        disabled={loading || props.disabled}
        className={cn(
          'btn-base btn-ghost relative overflow-hidden',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          fullWidth && 'w-full',
          size === 'sm' && 'h-10 min-w-0 text-[11px] px-4',
          size === 'lg' && 'h-14 px-8',
          className
        )}
        style={{ cursor: 'none' }}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading…</span>
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)
GhostButton.displayName = 'GhostButton'

// ── ICON BUTTON ───────────────────────────────────────────────

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string
  children: ReactNode
  className?: string
  active?: boolean
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, children, active, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'w-10 h-10 flex items-center justify-center rounded-lg',
          'bg-[var(--glass-light)] backdrop-blur-sm border border-white/10',
          'transition-all duration-200 hover:border-gold/35 hover:bg-[var(--glass-gold)]',
          'focus-visible:outline-2 focus-visible:outline-gold',
          active && 'border-gold/35 bg-[var(--glass-gold)] text-gold',
          className
        )}
        style={{ cursor: 'none' }}
        {...props}
      >
        {children}
      </button>
    )
  }
)
IconButton.displayName = 'IconButton'

// ── RIPPLE KEYFRAME (injected once) ───────────────────────────

if (typeof document !== 'undefined') {
  const styleId = 'ripple-keyframe'
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      @keyframes ripple-expand {
        to { transform: scale(1); opacity: 0; }
      }
    `
    document.head.appendChild(style)
  }
}
