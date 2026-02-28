'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Toast as ToastType } from '@/types'

// ── CONTEXT ────────────────────────────────────────────────────

interface ToastContextValue {
  toasts: ToastType[]
  toast: (options: Omit<ToastType, 'id'>) => string
  dismiss: (id: string) => void
  success: (message: string, options?: Partial<ToastType>) => string
  error: (message: string, options?: Partial<ToastType>) => string
  info: (message: string, options?: Partial<ToastType>) => string
  warning: (message: string, options?: Partial<ToastType>) => string
}

const ToastContext = createContext<ToastContextValue | null>(null)

// ── HOOK ───────────────────────────────────────────────────────

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

// ── PROVIDER ───────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([])
  const timeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const t = timeouts.current.get(id)
    if (t) {
      clearTimeout(t)
      timeouts.current.delete(id)
    }
  }, [])

  const toast = useCallback(
    (options: Omit<ToastType, 'id'>): string => {
      const id = Math.random().toString(36).slice(2)
      const duration = options.duration ?? 4000

      setToasts((prev) => {
        // Cap at 5 visible toasts
        const next = [...prev, { ...options, id }]
        return next.length > 5 ? next.slice(next.length - 5) : next
      })

      if (duration > 0) {
        const t = setTimeout(() => dismiss(id), duration)
        timeouts.current.set(id, t)
      }

      return id
    },
    [dismiss]
  )

  const success = useCallback(
    (message: string, options?: Partial<ToastType>) =>
      toast({ type: 'success', message, ...options }),
    [toast]
  )
  const error = useCallback(
    (message: string, options?: Partial<ToastType>) =>
      toast({ type: 'error', message, ...options }),
    [toast]
  )
  const info = useCallback(
    (message: string, options?: Partial<ToastType>) =>
      toast({ type: 'info', message, ...options }),
    [toast]
  )
  const warning = useCallback(
    (message: string, options?: Partial<ToastType>) =>
      toast({ type: 'warning', message, ...options }),
    [toast]
  )

  // Cleanup on unmount
  useEffect(() => {
    const map = timeouts.current
    return () => map.forEach((t) => clearTimeout(t))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

// ── ICONS ─────────────────────────────────────────────────────

function SuccessIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
}

// ── VARIANT STYLES ─────────────────────────────────────────────

const variantConfig = {
  success: {
    icon: <SuccessIcon />,
    iconClass: 'text-emerald-400',
    barClass: 'bg-emerald-400',
    borderClass: 'border-emerald-500/30',
  },
  error: {
    icon: <ErrorIcon />,
    iconClass: 'text-red-400',
    barClass: 'bg-red-400',
    borderClass: 'border-red-500/30',
  },
  info: {
    icon: <InfoIcon />,
    iconClass: 'text-[var(--gold)]',
    barClass: 'bg-[var(--gold)]',
    borderClass: 'border-gold/30',
  },
  warning: {
    icon: <WarningIcon />,
    iconClass: 'text-orange-400',
    barClass: 'bg-orange-400',
    borderClass: 'border-orange-500/30',
  },
}

// ── SINGLE TOAST ───────────────────────────────────────────────

interface ToastItemProps {
  toast: ToastType
  onDismiss: (id: string) => void
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const config = variantConfig[toast.type]
  const duration = toast.duration ?? 4000

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.92 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'relative flex items-start gap-3 min-w-[300px] max-w-[420px]',
        'px-4 py-3.5 rounded-xl overflow-hidden',
        'bg-[var(--bg-elevated)] border',
        'shadow-[0_16px_40px_rgba(0,0,0,0.5)]',
        config.borderClass
      )}
      role="alert"
      aria-live="assertive"
    >
      {/* Progress bar */}
      {duration > 0 && (
        <motion.div
          className={cn('absolute bottom-0 left-0 h-0.5 rounded-full', config.barClass)}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}

      {/* Icon */}
      <span className={cn('mt-0.5 flex-shrink-0', config.iconClass)}>
        {config.icon}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--white-soft)] font-sans leading-snug">
          {toast.message}
        </p>
        {toast.action && (
          <button
            onClick={() => {
              toast.action!.onClick()
              onDismiss(toast.id)
            }}
            className="mt-1.5 text-xs font-semibold tracking-[0.12em] uppercase text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
            style={{ cursor: 'none' }}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Close */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 text-[var(--white-soft)]/30 hover:text-[var(--white-soft)]/70 transition-colors mt-0.5"
        style={{ cursor: 'none' }}
        aria-label="Dismiss notification"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  )
}

// ── CONTAINER ─────────────────────────────────────────────────

interface ToastContainerProps {
  toasts: ToastType[]
  onDismiss: (id: string) => void
}

function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 items-end"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>,
    document.body
  )
}

export default ToastProvider
