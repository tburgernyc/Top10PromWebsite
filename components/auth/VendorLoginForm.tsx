'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/Input'
import { GoldButton } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { createClient } from '@/lib/supabase'

// ── VENDOR LOGIN FORM ─────────────────────────────────────────

export function VendorLoginForm() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const errs: typeof errors = {}
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'Please enter a valid email address.'
    if (!password || password.length < 6)
      errs.password = 'Password must be at least 6 characters.'
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
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
          showError('Invalid partner credentials. Please contact support.')
          return
        }

        // Verify vendor role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (!profile || profile.role !== 'vendor') {
          await supabase.auth.signOut()
          showError('This account is not authorized as a vendor partner.')
          return
        }

        success('Welcome to the Partner Portal!')
        router.push('/vendor/dashboard')
        router.refresh()
      } catch {
        showError('Something went wrong. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [email, password, router, success, showError]
  )

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-5"
      noValidate
    >
      {/* Vendor badge */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--glass-gold)] border border-gold/25">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--gold)" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
        </svg>
        <span className="text-xs font-sans font-semibold tracking-[0.15em] uppercase text-[var(--gold)]">
          Vendor Partner Portal
        </span>
      </div>

      <Input
        type="email"
        label="Partner Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        valid={!errors.email && email.length > 0}
        placeholder="partner@yourboutique.com"
        autoComplete="email"
      />

      <Input
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        placeholder="Your partner password"
        autoComplete="current-password"
      />

      <GoldButton type="submit" fullWidth loading={loading}>
        Access Partner Portal
      </GoldButton>

      <div className="text-center space-y-2">
        <p className="text-xs text-[var(--white-soft)]/30 font-sans">
          Not a partner yet?{' '}
          <Link
            href="/contact?subject=vendor"
            className="text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
            style={{ cursor: 'none' }}
          >
            Apply to join our network
          </Link>
        </p>
        <p className="text-xs text-[var(--white-soft)]/20 font-sans">
          Customer?{' '}
          <Link
            href="/login"
            className="text-[var(--white-soft)]/40 hover:text-[var(--white-soft)] transition-colors"
            style={{ cursor: 'none' }}
          >
            Sign in to your account
          </Link>
        </p>
      </div>
    </motion.form>
  )
}

export default VendorLoginForm
