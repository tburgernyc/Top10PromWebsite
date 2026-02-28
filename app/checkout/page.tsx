'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/components/shop/CartContext'
import { Input } from '@/components/ui/Input'
import { GoldButton } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'

// ── TYPES ─────────────────────────────────────────────────────

type Step = 'review' | 'shipping' | 'payment'

const STEPS: Step[] = ['review', 'shipping', 'payment']
const STEP_LABELS: Record<Step, string> = {
  review: 'Review',
  shipping: 'Shipping',
  payment: 'Payment',
}

// ── STEP INDICATOR ─────────────────────────────────────────────

function CheckoutSteps({ current }: { current: Step }) {
  const idx = STEPS.indexOf(current)
  return (
    <div className="flex items-center gap-3 mb-10">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-3">
          <div className={cn(
            'flex items-center gap-2',
            i <= idx ? 'text-[var(--gold)]' : 'text-[var(--white-soft)]/25'
          )}>
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all',
              i < idx ? 'bg-[var(--gold)] border-transparent text-[var(--bg-primary)]' :
              i === idx ? 'border-[var(--gold)] text-[var(--gold)]' :
              'border-white/15 text-[var(--white-soft)]/20'
            )}>
              {i < idx ? '✓' : i + 1}
            </div>
            <span className="text-xs font-sans font-semibold tracking-[0.1em] uppercase hidden sm:block">
              {STEP_LABELS[s]}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn('h-px w-8 transition-all', i < idx ? 'bg-[var(--gold)]/40' : 'bg-white/10')} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── ORDER SUMMARY ──────────────────────────────────────────────

function OrderSummary({ minimal = false }: { minimal?: boolean }) {
  const { items, subtotal } = useCart()
  const shipping = subtotal >= 200 ? 0 : 9.99
  const tax = subtotal * 0.07
  const total = subtotal + shipping + tax

  return (
    <div className={cn('flex flex-col gap-4', minimal ? '' : 'p-6 rounded-2xl bg-[var(--glass-light)] border border-white/10')}>
      {!minimal && <h3 className="font-serif text-lg text-[var(--white-soft)]">Order Summary</h3>}

      <div className="flex flex-col gap-3">
        {items.map(item => (
          <div key={`${item.dress.id}-${item.selected_color}-${item.selected_size}`} className="flex items-center gap-3">
            <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={item.dress.imageUrls[0] ?? `https://picsum.photos/seed/${item.dress.id}/100/133`}
                alt={item.dress.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-sans font-semibold text-[var(--white-soft)]/80 truncate">{item.dress.name}</p>
              <p className="text-[10px] font-sans text-[var(--white-soft)]/35">
                {item.selected_color} · {item.selected_size ? `Size ${item.selected_size}` : 'One Size'} · Qty {item.quantity}
              </p>
            </div>
            <p className="text-xs font-sans text-[var(--white-soft)]/70 flex-shrink-0">
              {formatPrice(item.dress.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="h-px bg-white/8" />

      <div className="flex flex-col gap-2">
        {[
          { label: 'Subtotal', value: formatPrice(subtotal) },
          { label: `Shipping${shipping === 0 ? ' (Free)' : ''}`, value: shipping === 0 ? 'FREE' : formatPrice(shipping) },
          { label: 'Estimated Tax', value: formatPrice(tax) },
        ].map(row => (
          <div key={row.label} className="flex justify-between">
            <span className="text-xs font-sans text-[var(--white-soft)]/45">{row.label}</span>
            <span className="text-xs font-sans text-[var(--white-soft)]/70">{row.value}</span>
          </div>
        ))}
        <div className="flex justify-between mt-2 pt-2 border-t border-white/8">
          <span className="text-sm font-sans font-semibold text-[var(--white-soft)]">Total</span>
          <span className="text-sm font-sans font-semibold text-[var(--gold)]">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}

// ── PAGE ──────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { items, subtotal } = useCart()
  const { toast } = useToast()
  const [step, setStep] = useState<Step>('review')
  const [processing, setProcessing] = useState(false)
  const [shipping, setShipping] = useState({
    name: '', email: '', address: '', city: '', state: '', zip: '',
  })

  const handleProceedToStripe = async () => {
    setProcessing(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            dress_id: i.dress.id,
            quantity: i.quantity,
            color: i.selected_color,
            size: i.selected_size,
          })),
          customerEmail: shipping.email,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch {
      toast({ type: 'error', message: 'Checkout failed. Please try again.' })
      setProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-28 pb-24 flex flex-col items-center justify-center gap-6 px-6">
        <p className="font-serif text-3xl text-[var(--white-soft)]">Your cart is empty</p>
        <a href="/shop" className="text-sm font-sans text-[var(--gold)]/70 hover:text-[var(--gold)] transition-colors" style={{ cursor: 'none' }}>
          Browse our collection →
        </a>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-20 pb-24 px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
      <div className="py-10">
        <p className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-[var(--gold)] mb-2">Secure Checkout</p>
        <h1 className="font-serif text-4xl text-[var(--white-soft)]">Checkout</h1>
      </div>

      <CheckoutSteps current={step} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        {/* Main content */}
        <AnimatePresence mode="wait">
          {step === 'review' && (
            <motion.div key="review" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="flex flex-col gap-6">
              <h2 className="font-serif text-2xl text-[var(--white-soft)]">Review Your Order</h2>
              <OrderSummary />
              <GoldButton onClick={() => setStep('shipping')}>Continue to Shipping</GoldButton>
            </motion.div>
          )}

          {step === 'shipping' && (
            <motion.div key="shipping" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="flex flex-col gap-6">
              <h2 className="font-serif text-2xl text-[var(--white-soft)]">Shipping Information</h2>
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[var(--glass-light)] border border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" value={shipping.name} onChange={e => setShipping(p => ({ ...p, name: e.target.value }))} placeholder="Jane Smith" required />
                  <Input label="Email" type="email" value={shipping.email} onChange={e => setShipping(p => ({ ...p, email: e.target.value }))} placeholder="jane@email.com" required />
                </div>
                <Input label="Street Address" value={shipping.address} onChange={e => setShipping(p => ({ ...p, address: e.target.value }))} placeholder="123 Main St" required />
                <div className="grid grid-cols-[1fr_100px_80px] gap-3">
                  <Input label="City" value={shipping.city} onChange={e => setShipping(p => ({ ...p, city: e.target.value }))} placeholder="Asheville" />
                  <Input label="State" value={shipping.state} onChange={e => setShipping(p => ({ ...p, state: e.target.value }))} placeholder="NC" />
                  <Input label="ZIP" value={shipping.zip} onChange={e => setShipping(p => ({ ...p, zip: e.target.value }))} placeholder="28803" />
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep('review')} className="text-sm font-sans text-[var(--white-soft)]/35 hover:text-[var(--white-soft)]/60 transition-colors" style={{ cursor: 'none' }}>← Back</button>
                <GoldButton onClick={() => setStep('payment')} disabled={!shipping.name || !shipping.email || !shipping.address}>Continue to Payment</GoldButton>
              </div>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="flex flex-col gap-6">
              <h2 className="font-serif text-2xl text-[var(--white-soft)]">Payment</h2>
              <div className="p-6 rounded-2xl bg-[var(--glass-light)] border border-white/10 flex flex-col gap-4">
                <p className="text-sm font-sans text-[var(--white-soft)]/55 leading-relaxed">
                  You'll be redirected to our secure Stripe checkout to complete your payment. We accept all major credit cards, Apple Pay, and Google Pay.
                </p>
                <div className="flex gap-2">
                  {['Visa', 'MC', 'Amex', 'Apple Pay', 'Google Pay'].map(pm => (
                    <span key={pm} className="px-2 py-1 rounded-md bg-[var(--glass-light)] border border-white/10 text-[9px] font-sans text-[var(--white-soft)]/35">{pm}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-sans text-[var(--white-soft)]/25">
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Secured by Stripe. Your payment info is never stored on our servers.
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep('shipping')} className="text-sm font-sans text-[var(--white-soft)]/35 hover:text-[var(--white-soft)]/60 transition-colors" style={{ cursor: 'none' }}>← Back</button>
                <GoldButton onClick={handleProceedToStripe} loading={processing} disabled={processing}>
                  {processing ? 'Redirecting...' : `Pay ${formatPrice(subtotal * 1.07 + (subtotal >= 200 ? 0 : 9.99))}`}
                </GoldButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar summary */}
        <div className="hidden lg:block">
          <OrderSummary />
        </div>
      </div>
    </main>
  )
}
