'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { GoldButton } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { createClient } from '@/lib/supabase'

// ── LOGIN FORM ────────────────────────────────────────────────

export function LoginForm() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const errs: typeof errors = {}
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address.'
    }
    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!validate()) return

      setLoading(true)
      try {
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
          if (error.message.includes('Invalid login')) {
            showError('Incorrect email or password. Please try again.')
          } else {
            showError(error.message)
          }
          return
        }

        success('Welcome back! Redirecting...')
        router.push('/dashboard')
        router.refresh()
      } catch {
        showError('Something went wrong. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [email, password, router, success, showError]
  )

  const handleGoogleSignIn = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-5"
      noValidate
    >
      <Input
        type="email"
        label="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        valid={!errors.email && email.length > 0}
        placeholder="your@email.com"
        autoComplete="email"
      />

      <Input
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        placeholder="Your password"
        autoComplete="current-password"
      />

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs text-[var(--white-soft)]/40 hover:text-[var(--gold)] font-sans transition-colors"
          style={{ cursor: 'none' }}
        >
          Forgot password?
        </Link>
      </div>

      <GoldButton type="submit" fullWidth loading={loading}>
        Sign In
      </GoldButton>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-[var(--white-soft)]/30 font-sans">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className={cn(
          'w-full h-12 flex items-center justify-center gap-3 rounded',
          'border border-white/15 bg-[var(--glass-light)]',
          'text-sm font-sans text-[var(--white-soft)]/70 hover:text-[var(--white-soft)]',
          'hover:border-white/25 transition-all'
        )}
        style={{ cursor: 'none' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <p className="text-center text-xs text-[var(--white-soft)]/30 font-sans">
        Don't have an account?{' '}
        <Link
          href="/register"
          className="text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
          style={{ cursor: 'none' }}
        >
          Create one free
        </Link>
      </p>
    </motion.form>
  )
}

export default LoginForm
