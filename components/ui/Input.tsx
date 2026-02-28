'use client'

import {
  forwardRef,
  useState,
  useCallback,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

// ── INPUT COMPONENT ───────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  valid?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  variant?: 'gold' | 'blush' | 'default'
  className?: string
  containerClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      valid,
      leftIcon,
      rightIcon,
      variant = 'default',
      className,
      containerClassName,
      type,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const isPassword = type === 'password'

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    const borderColor = isFocused
      ? variant === 'blush'
        ? 'border-blush/60 shadow-[0_0_0_2px_rgba(242,181,199,0.1)]'
        : 'border-gold/60 shadow-[0_0_0_2px_rgba(212,175,114,0.1)]'
      : error
      ? 'border-red-500/60'
      : valid
      ? 'border-emerald-500/60'
      : 'border-white/10'

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label className="text-xs font-semibold tracking-[0.2em] uppercase text-white-soft/70">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white-soft/40">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'w-full h-12 px-4 py-3 rounded-lg',
              'bg-[var(--glass-medium)] backdrop-blur-md',
              'border transition-all duration-300',
              'text-white-soft placeholder:text-white-soft/30',
              'font-sans text-sm',
              'outline-none',
              borderColor,
              leftIcon && 'pl-10',
              (rightIcon || isPassword || valid || error) && 'pr-10',
              className
            )}
            style={{ cursor: 'text' }}
            {...props}
          />
          {/* Right side indicator */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-white-soft/40 hover:text-white-soft/70 transition-colors"
                tabIndex={-1}
                style={{ cursor: 'none' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            )}
            {!isPassword && valid && (
              <span className="text-emerald-400 animate-fadeIn">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}
            {!isPassword && error && (
              <span className="text-red-400 animate-fadeIn">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            )}
            {rightIcon && !valid && !error && !isPassword && rightIcon}
          </div>
        </div>
        {error && (
          <p className="text-xs text-red-400 animate-slideUp">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-white-soft/40">{helperText}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

// ── PASSWORD STRENGTH METER ───────────────────────────────────

interface PasswordStrengthProps {
  password: string
  className?: string
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const getStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    return score
  }

  const strength = password ? getStrength(password) : 0
  const labels = ['', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', '#EF4444', '#F97316', '#EAB308', '#10B981', '#10B981']
  const widths = ['0%', '20%', '40%', '60%', '80%', '100%']

  if (!password) return null

  return (
    <div className={cn('mt-1.5', className)}>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: widths[strength], backgroundColor: colors[strength] }}
        />
      </div>
      <p className="text-xs mt-1 transition-colors duration-300" style={{ color: colors[strength] }}>
        {labels[strength]}
      </p>
    </div>
  )
}

// ── TEXTAREA ──────────────────────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  maxLength?: number
  className?: string
  containerClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      maxLength,
      className,
      containerClassName,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [charCount, setCharCount] = useState(
      typeof value === 'string' ? value.length : 0
    )

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCharCount(e.target.value.length)
        onChange?.(e)
        // Auto-resize
        e.target.style.height = 'auto'
        e.target.style.height = `${e.target.scrollHeight}px`
      },
      [onChange]
    )

    const isNearLimit = maxLength ? charCount > maxLength * 0.8 : false
    const isAtLimit = maxLength ? charCount >= maxLength : false

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label className="text-xs font-semibold tracking-[0.2em] uppercase text-white-soft/70">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={maxLength}
            className={cn(
              'w-full min-h-[120px] px-4 py-3 rounded-lg resize-none',
              'bg-[var(--glass-medium)] backdrop-blur-md',
              'border transition-all duration-300',
              'text-white-soft placeholder:text-white-soft/30',
              'font-sans text-sm leading-relaxed',
              'outline-none',
              isFocused ? 'border-gold/60 shadow-[0_0_0_2px_rgba(212,175,114,0.1)]' : 'border-white/10',
              error && 'border-red-500/60',
              className
            )}
            style={{ cursor: 'text' }}
            {...props}
          />
          {maxLength && (
            <span
              className={cn(
                'absolute bottom-2 right-3 text-[10px] transition-colors',
                isAtLimit ? 'text-red-400' : isNearLimit ? 'text-gold' : 'text-white-soft/30'
              )}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        {helperText && !error && <p className="text-xs text-white-soft/40">{helperText}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
