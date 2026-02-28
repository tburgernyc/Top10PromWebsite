'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Input, PasswordStrength } from '@/components/ui/Input'
import { GoldButton } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { createClient } from '@/lib/supabase'

// ── REGISTER FORM ─────────────────────────────────────────────

export function RegisterForm() {
  const router = useRouter()
  const { success, error: showError } = useToast()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [loading, setLoading] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const errs: Partial<typeof form> = {}
    if (!form.firstName.trim()) errs.firstName = 'First name is required.'
    if (!form.lastName.trim()) errs.lastName = 'Last name is required.'
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Valid email required.'
    if (form.password.length < 8)
      errs.password = 'Password must be at least 8 characters.'
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!validate()) return
      if (!agreeToTerms) {
        showError('Please agree to the Terms of Service to continue.')
        return
      }

      setLoading(true)
      try {
        const supabase = createClient()
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              first_name: form.firstName,
              last_name: form.lastName,
              full_name: `${form.firstName} ${form.lastName}`,
            },
          },
        })

        if (error) {
          showError(error.message)
          return
        }

        success('Account created! Check your email to confirm, then sign in.')
        router.push('/login')
      } catch {
        showError('Something went wrong. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [form, agreeToTerms, router, success, showError]
  )

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-4"
      noValidate
    >
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="First Name"
          value={form.firstName}
          onChange={update('firstName')}
          error={errors.firstName}
          valid={!errors.firstName && form.firstName.length > 0}
          placeholder="Jane"
          autoComplete="given-name"
        />
        <Input
          label="Last Name"
          value={form.lastName}
          onChange={update('lastName')}
          error={errors.lastName}
          valid={!errors.lastName && form.lastName.length > 0}
          placeholder="Smith"
          autoComplete="family-name"
        />
      </div>

      <Input
        type="email"
        label="Email Address"
        value={form.email}
        onChange={update('email')}
        error={errors.email}
        valid={!errors.email && form.email.length > 0}
        placeholder="your@email.com"
        autoComplete="email"
      />

      <div>
        <Input
          type="password"
          label="Create Password"
          value={form.password}
          onChange={update('password')}
          error={errors.password}
          placeholder="Min. 8 characters"
          autoComplete="new-password"
        />
        <PasswordStrength password={form.password} className="mt-2" />
      </div>

      <Input
        type="password"
        label="Confirm Password"
        value={form.confirmPassword}
        onChange={update('confirmPassword')}
        error={errors.confirmPassword}
        valid={form.confirmPassword.length > 0 && form.password === form.confirmPassword}
        placeholder="Repeat password"
        autoComplete="new-password"
      />

      {/* Terms */}
      <label className="flex items-start gap-3" style={{ cursor: 'none' }}>
        <input
          type="checkbox"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
          className="mt-1 w-4 h-4 accent-[var(--gold)]"
        />
        <span className="text-xs text-[var(--white-soft)]/50 font-sans leading-relaxed">
          I agree to the{' '}
          <Link
            href="/terms"
            className="text-[var(--gold)] hover:underline"
            style={{ cursor: 'none' }}
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="text-[var(--gold)] hover:underline"
            style={{ cursor: 'none' }}
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      <GoldButton type="submit" fullWidth loading={loading} className="mt-2">
        Create Account
      </GoldButton>

      <p className="text-center text-xs text-[var(--white-soft)]/30 font-sans">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
          style={{ cursor: 'none' }}
        >
          Sign in
        </Link>
      </p>
    </motion.form>
  )
}

export default RegisterForm
