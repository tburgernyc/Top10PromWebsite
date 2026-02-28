'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Input } from '@/components/ui/Input'
import { GoldButton } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { cn } from '@/lib/utils'

const StoreMap = dynamic(() => import('@/components/stores/StoreMap'), { ssr: false })

// ── CONTACT FORM ───────────────────────────────────────────────

function ContactForm() {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const set = (k: keyof typeof form, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSent(true)
      toast({ type: 'success', message: 'Message sent! We\'ll be in touch within 24 hours.' })
    } catch {
      toast({ type: 'error', message: 'Something went wrong. Please try again or call us directly.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="w-14 h-14 rounded-full border border-[var(--gold)]/40 flex items-center justify-center">
          <span className="text-2xl text-[var(--gold)]">✓</span>
        </div>
        <h3 className="font-serif text-2xl text-[var(--white-soft)]">Message Received</h3>
        <p className="text-sm font-sans text-[var(--white-soft)]/50 max-w-xs leading-relaxed">
          Thank you for reaching out! Our team will respond within 24 hours. For urgent matters, call us at 828-774-5588.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Name" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" required />
        <Input label="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Phone" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 000-0000" />
        <Input label="Subject" value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="How can we help?" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-sans font-semibold tracking-[0.15em] uppercase text-[var(--white-soft)]/40">Message *</label>
        <textarea
          value={form.message}
          onChange={e => set('message', e.target.value)}
          placeholder="Tell us how we can help you..."
          required
          rows={5}
          className="w-full px-4 py-3 rounded-xl bg-[var(--glass-light)] border border-white/10 text-sm font-sans text-[var(--white-soft)]/80 placeholder-[var(--white-soft)]/20 focus:outline-none focus:border-gold/40 resize-none transition-colors"
          style={{ cursor: 'none' }}
        />
      </div>
      <GoldButton type="submit" disabled={submitting || !form.name || !form.email || !form.message} loading={submitting}>
        {submitting ? 'Sending...' : 'Send Message'}
      </GoldButton>
    </form>
  )
}

// ── PAGE ──────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <>
      <main className="min-h-screen pt-20 pb-24">
        {/* Header */}
        <div className="px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto py-10">
          <p className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-[var(--gold)] mb-2">Get in Touch</p>
          <h1 className="font-serif text-4xl md:text-5xl text-[var(--white-soft)]">Contact Us</h1>
        </div>

        {/* 2-col layout */}
        <div className="px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left — Form */}
          <div className="bg-[var(--glass-light)] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md">
            <h2 className="font-serif text-2xl text-[var(--white-soft)] mb-6">Send a Message</h2>
            <ContactForm />
          </div>

          {/* Right — Info + Map */}
          <div className="flex flex-col gap-8">
            {/* Contact info */}
            <div className="flex flex-col gap-5">
              <h2 className="font-serif text-2xl text-[var(--white-soft)]">Visit Our Flagship</h2>
              {[
                { icon: '◉', label: 'Address', value: '800-3 Fairview Rd, Asheville, NC 28803' },
                { icon: '◈', label: 'Phone', value: '828-774-5588', href: 'tel:+18287745588' },
                { icon: '✦', label: 'Hours', value: 'Mon–Sat 10am–7pm · Sun 12pm–5pm' },
                { icon: '◇', label: 'Email', value: 'info@top10prom.com', href: 'mailto:info@top10prom.com' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <span className="text-[var(--gold)]/50 text-sm mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-[10px] font-sans font-semibold tracking-[0.1em] uppercase text-[var(--white-soft)]/25 mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-sans text-[var(--white-soft)]/70 hover:text-[var(--gold)] transition-colors" style={{ cursor: 'none' }}>{item.value}</a>
                    ) : (
                      <p className="text-sm font-sans text-[var(--white-soft)]/70">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Mini map */}
            <div className="rounded-2xl overflow-hidden border border-white/10 h-64">
              <StoreMap className="h-full" initialStoreId="hq" />
            </div>

            <a
              href="https://maps.google.com/?q=800-3+Fairview+Rd+Asheville+NC+28803"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-sans text-[var(--gold)]/60 hover:text-[var(--gold)] transition-colors"
              style={{ cursor: 'none' }}
            >
              Get directions in Google Maps →
            </a>
          </div>
        </div>
      </main>

      <ChatWidget pageContext="contact" />
    </>
  )
}
