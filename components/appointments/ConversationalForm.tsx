'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CalendarPicker } from './CalendarPicker'
import { TimeSlotPicker } from './TimeSlotPicker'
import { STORES } from '@/lib/mock-data'
import { Input } from '@/components/ui/Input'
import { GoldButton } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

// ── TYPES ─────────────────────────────────────────────────────

type Step = 'occasion' | 'date' | 'time' | 'store' | 'contact' | 'confirm'

interface BookingData {
  occasion: string
  date: Date | null
  time: string | null
  storeId: string | null
  name: string
  email: string
  phone: string
  notes: string
}

// ── CONSTANTS ─────────────────────────────────────────────────

const OCCASIONS = [
  { id: 'prom', label: 'Prom', icon: '✦', description: 'Find your perfect prom look' },
  { id: 'homecoming', label: 'Homecoming', icon: '♛', description: 'Stand out at homecoming' },
  { id: 'bridal', label: 'Bridal', icon: '◇', description: 'Bridal & wedding party styling' },
  { id: 'tuxedo', label: 'Tuxedo / Menswear', icon: '◈', description: 'Suits & formalwear fitting' },
  { id: 'pageant', label: 'Pageant', icon: '★', description: 'Pageant-ready gowns & styling' },
  { id: 'evening', label: 'Evening / Gala', icon: '◉', description: 'Elegant evening wear' },
]

const STEPS: Step[] = ['occasion', 'date', 'time', 'store', 'contact', 'confirm']

const STEP_LABELS: Record<Step, string> = {
  occasion: 'What\'s the occasion?',
  date: 'When is your event?',
  time: 'What time works for you?',
  store: 'Choose your location',
  contact: 'Your details',
  confirm: 'You\'re all set!',
}

// ── STEP INDICATOR ─────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: Step }) {
  const idx = STEPS.indexOf(currentStep)
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.slice(0, -1).map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-sans font-bold transition-all duration-300',
              i < idx
                ? 'bg-[var(--gold)] text-[var(--bg-primary)]'
                : i === idx
                ? 'border border-[var(--gold)] text-[var(--gold)]'
                : 'border border-white/15 text-[var(--white-soft)]/20'
            )}
          >
            {i < idx ? '✓' : i + 1}
          </div>
          {i < STEPS.length - 2 && (
            <div className={cn('h-px w-6 transition-all duration-300', i < idx ? 'bg-[var(--gold)]/50' : 'bg-white/10')} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── OCCASION STEP ──────────────────────────────────────────────

function OccasionStep({ value, onSelect }: { value: string; onSelect: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {OCCASIONS.map((occ, i) => (
        <motion.button
          key={occ.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => onSelect(occ.id)}
          className={cn(
            'flex flex-col items-start gap-2 p-4 rounded-2xl border text-left transition-all duration-200',
            value === occ.id
              ? 'bg-[var(--glass-gold)] border-gold/40 shadow-[var(--shadow-gold)]'
              : 'bg-[var(--glass-light)] border-white/10 hover:border-gold/25 hover:bg-[var(--glass-gold)]/50'
          )}
          style={{ cursor: 'none' }}
        >
          <span className={cn('text-lg', value === occ.id ? 'text-[var(--gold)]' : 'text-[var(--white-soft)]/40')}>
            {occ.icon}
          </span>
          <div>
            <p className={cn('text-sm font-sans font-semibold', value === occ.id ? 'text-[var(--gold)]' : 'text-[var(--white-soft)]/80')}>
              {occ.label}
            </p>
            <p className="text-[10px] font-sans text-[var(--white-soft)]/30 mt-0.5 leading-tight">
              {occ.description}
            </p>
          </div>
        </motion.button>
      ))}
    </div>
  )
}

// ── STORE STEP ─────────────────────────────────────────────────

function StoreStep({ value, onSelect }: { value: string | null; onSelect: (id: string) => void }) {
  const [search, setSearch] = useState('')
  const filtered = STORES.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase()) ||
    s.state.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Search by city or state..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-[var(--glass-light)] border border-white/10 text-sm font-sans text-[var(--white-soft)] placeholder-[var(--white-soft)]/25 focus:outline-none focus:border-gold/40 transition-colors"
        style={{ cursor: 'none' }}
      />
      <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
        {filtered.map((store, i) => (
          <motion.button
            key={store.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            onClick={() => onSelect(String(store.id))}
            className={cn(
              'flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200',
              value === String(store.id)
                ? 'bg-[var(--glass-gold)] border-gold/40'
                : 'bg-[var(--glass-light)] border-white/10 hover:border-gold/25'
            )}
            style={{ cursor: 'none' }}
          >
            <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0', store.isHQ ? 'bg-[var(--gold)]' : 'bg-white/30')} />
            <div>
              <p className={cn('text-sm font-sans font-semibold', value === String(store.id) ? 'text-[var(--gold)]' : 'text-[var(--white-soft)]/80')}>
                {store.name}
                {store.isHQ && <span className="ml-2 text-[9px] font-bold tracking-[0.15em] uppercase text-[var(--gold)]/60">HQ</span>}
              </p>
              <p className="text-[11px] font-sans text-[var(--white-soft)]/40 mt-0.5">
                {store.address}, {store.city}, {store.state}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ── CONTACT STEP ───────────────────────────────────────────────

function ContactStep({
  data,
  onChange,
}: {
  data: Pick<BookingData, 'name' | 'email' | 'phone' | 'notes'>
  onChange: (key: keyof BookingData, value: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={data.name}
          onChange={e => onChange('name', e.target.value)}
          placeholder="Your name"
          required
        />
        <Input
          label="Email"
          type="email"
          value={data.email}
          onChange={e => onChange('email', e.target.value)}
          placeholder="you@email.com"
          required
        />
      </div>
      <Input
        label="Phone"
        type="tel"
        value={data.phone}
        onChange={e => onChange('phone', e.target.value)}
        placeholder="(555) 000-0000"
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-sans font-semibold tracking-[0.15em] uppercase text-[var(--white-soft)]/40">
          Special requests <span className="font-normal normal-case tracking-normal">(optional)</span>
        </label>
        <textarea
          value={data.notes}
          onChange={e => onChange('notes', e.target.value)}
          placeholder="Any details we should know — dress colors, group size, measurements, etc."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-[var(--glass-light)] border border-white/10 text-sm font-sans text-[var(--white-soft)]/80 placeholder-[var(--white-soft)]/20 focus:outline-none focus:border-gold/40 resize-none transition-colors"
          style={{ cursor: 'none' }}
        />
      </div>
    </div>
  )
}

// ── CONFIRMATION STEP ──────────────────────────────────────────

function ConfirmStep({ data }: { data: BookingData }) {
  const store = STORES.find(s => s.id === data.storeId)
  const occasion = OCCASIONS.find(o => o.id === data.occasion)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-6 text-center py-4"
    >
      {/* Gold ring icon */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-[var(--gold)]/30 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-2 rounded-full border border-[var(--gold)]/60 flex items-center justify-center">
          <span className="text-2xl text-[var(--gold)]">✓</span>
        </div>
      </div>

      <div>
        <h3 className="font-serif text-2xl text-[var(--white-soft)] mb-1">Appointment Requested!</h3>
        <p className="text-sm font-sans text-[var(--white-soft)]/50">
          We'll send a confirmation to <span className="text-[var(--gold)]">{data.email}</span>
        </p>
      </div>

      {/* Summary */}
      <div className="w-full bg-[var(--glass-light)] border border-white/10 rounded-2xl p-5 text-left flex flex-col gap-3">
        {[
          { label: 'Occasion', value: occasion?.label ?? data.occasion },
          {
            label: 'Date & Time',
            value: data.date
              ? `${data.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}${data.time ? ' at ' + data.time : ''}`
              : '—',
          },
          { label: 'Location', value: store ? `${store.name} — ${store.city}, ${store.state}` : '—' },
          { label: 'Name', value: data.name },
        ].map(row => (
          <div key={row.label} className="flex items-start gap-3">
            <span className="text-[10px] font-sans font-semibold tracking-[0.15em] uppercase text-[var(--white-soft)]/30 w-20 flex-shrink-0 pt-0.5">
              {row.label}
            </span>
            <span className="text-sm font-sans text-[var(--white-soft)]/80">{row.value}</span>
          </div>
        ))}
      </div>

      <p className="text-xs font-sans text-[var(--white-soft)]/30 leading-relaxed max-w-sm">
        Our team will call you within 24 hours to confirm. Appointments are 60–90 minutes and are complimentary.
      </p>
    </motion.div>
  )
}

// ── CONVERSATIONAL FORM ────────────────────────────────────────

export function ConversationalForm({ className }: { className?: string }) {
  const { toast } = useToast()
  const [step, setStep] = useState<Step>('occasion')
  const [direction, setDirection] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)

  const [data, setData] = useState<BookingData>({
    occasion: '',
    date: null,
    time: null,
    storeId: null,
    name: '',
    email: '',
    phone: '',
    notes: '',
  })

  const setField = (key: keyof BookingData, value: BookingData[keyof BookingData]) => {
    setData(prev => ({ ...prev, [key]: value }))
  }

  const navigate = (delta: number) => {
    const idx = STEPS.indexOf(step)
    const next = STEPS[idx + delta]
    if (!next) return
    setDirection(delta)
    setStep(next)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  const canProceed = (): boolean => {
    switch (step) {
      case 'occasion': return !!data.occasion
      case 'date': return !!data.date
      case 'time': return !!data.time
      case 'store': return !!data.storeId
      case 'contact': return !!data.name && !!data.email
      default: return true
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion: data.occasion,
          date: data.date?.toISOString(),
          time: data.time,
          store_id: data.storeId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          notes: data.notes,
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setDirection(1)
      setStep('confirm')
    } catch {
      toast({ type: 'error', message: 'Something went wrong. Please try again or call us directly.' })
    } finally {
      setSubmitting(false)
    }
  }

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 32 : -32 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -32 : 32 }),
  }

  const isConfirm = step === 'confirm'

  return (
    <div ref={formRef} className={cn('flex flex-col gap-6', className)}>
      {!isConfirm && <StepIndicator currentStep={step} />}

      {/* Question label */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`label-${step}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {!isConfirm && (
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--white-soft)] mb-6">
              {STEP_LABELS[step]}
            </h2>
          )}

          {/* Step content */}
          {step === 'occasion' && (
            <OccasionStep
              value={data.occasion}
              onSelect={v => { setField('occasion', v); setTimeout(() => navigate(1), 200) }}
            />
          )}
          {step === 'date' && (
            <CalendarPicker
              selectedDate={data.date}
              onSelect={d => setField('date', d)}
            />
          )}
          {step === 'time' && (
            <TimeSlotPicker
              selectedTime={data.time}
              onSelect={t => setField('time', t)}
              date={data.date}
            />
          )}
          {step === 'store' && (
            <StoreStep
              value={data.storeId}
              onSelect={id => setField('storeId', id)}
            />
          )}
          {step === 'contact' && (
            <ContactStep
              data={data}
              onChange={(k, v) => setField(k, v)}
            />
          )}
          {step === 'confirm' && <ConfirmStep data={data} />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {!isConfirm && (
        <div className="flex items-center justify-between pt-2">
          {STEPS.indexOf(step) > 0 ? (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-sans text-[var(--white-soft)]/40 hover:text-[var(--white-soft)]/70 transition-colors"
              style={{ cursor: 'none' }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          ) : (
            <div />
          )}

          {step === 'contact' ? (
            <GoldButton
              onClick={handleSubmit}
              disabled={!canProceed() || submitting}
              loading={submitting}
            >
              {submitting ? 'Booking...' : 'Confirm Appointment'}
            </GoldButton>
          ) : step !== 'occasion' ? (
            <GoldButton
              onClick={() => navigate(1)}
              disabled={!canProceed()}
            >
              Continue
            </GoldButton>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default ConversationalForm
