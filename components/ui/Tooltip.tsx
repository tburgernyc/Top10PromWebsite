'use client'

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ── TYPES ─────────────────────────────────────────────────────

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  placement?: TooltipPlacement
  delay?: number
  className?: string
  maxWidth?: number
  disabled?: boolean
}

// ── PLACEMENT CONFIG ───────────────────────────────────────────

const placementConfig: Record<
  TooltipPlacement,
  { motion: { initial: object; animate: object }; positionClass: string }
> = {
  top: {
    motion: { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 } },
    positionClass: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  },
  bottom: {
    motion: { initial: { opacity: 0, y: -6 }, animate: { opacity: 1, y: 0 } },
    positionClass: 'top-full left-1/2 -translate-x-1/2 mt-2',
  },
  left: {
    motion: { initial: { opacity: 0, x: 6 }, animate: { opacity: 1, x: 0 } },
    positionClass: 'right-full top-1/2 -translate-y-1/2 mr-2',
  },
  right: {
    motion: { initial: { opacity: 0, x: -6 }, animate: { opacity: 1, x: 0 } },
    positionClass: 'left-full top-1/2 -translate-y-1/2 ml-2',
  },
}

// ── ARROW ─────────────────────────────────────────────────────

const arrowConfig: Record<TooltipPlacement, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--bg-elevated)] border-b-transparent border-x-transparent border-[6px]',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--bg-elevated)] border-t-transparent border-x-transparent border-[6px]',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--bg-elevated)] border-r-transparent border-y-transparent border-[6px]',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-[var(--bg-elevated)] border-l-transparent border-y-transparent border-[6px]',
}

// ── COMPONENT ─────────────────────────────────────────────────

export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 300,
  className,
  maxWidth = 220,
  disabled = false,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const config = placementConfig[placement]

  const show = useCallback(() => {
    if (disabled) return
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay)
  }, [disabled, delay])

  const hide = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsVisible(false)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={config.motion.initial}
            animate={config.motion.animate}
            exit={config.motion.initial}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'absolute z-[150] pointer-events-none',
              config.positionClass
            )}
            style={{ maxWidth }}
          >
            {/* Arrow */}
            <div className={cn('absolute border-solid', arrowConfig[placement])} />

            {/* Content */}
            <div
              className={cn(
                'px-3 py-2 rounded-lg',
                'bg-[var(--bg-elevated)] border border-white/15',
                'shadow-[0_8px_24px_rgba(0,0,0,0.5)]',
                'text-xs font-sans text-[var(--white-soft)]/90 leading-snug',
                'whitespace-nowrap',
                className
              )}
            >
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── GOLD TOOLTIP (branded variant) ───────────────────────────

export function GoldTooltip({
  content,
  children,
  placement = 'top',
  delay = 300,
  className,
}: Omit<TooltipProps, 'maxWidth' | 'disabled'>) {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const config = placementConfig[placement]

  const show = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay)
  }, [delay])

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={config.motion.initial}
            animate={config.motion.animate}
            exit={config.motion.initial}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'absolute z-[150] pointer-events-none',
              config.positionClass
            )}
          >
            <div
              className={cn(
                'px-3 py-1.5 rounded-lg',
                'bg-[var(--glass-gold)] border border-gold/35',
                'shadow-[0_8px_24px_rgba(212,175,114,0.2)]',
                'text-xs font-sans font-semibold tracking-[0.1em] uppercase text-[var(--gold)]',
                'whitespace-nowrap backdrop-blur-md',
                className
              )}
            >
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Tooltip
