'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ── TYPES ─────────────────────────────────────────────────────

interface CalendarPickerProps {
  selectedDate: Date | null
  onSelect: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  disabledDates?: Date[]
  className?: string
}

// ── HELPERS ───────────────────────────────────────────────────

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function isDisabled(date: Date, min?: Date, max?: Date, disabled?: Date[]) {
  if (min && date < min) return true
  if (max && date > max) return true
  if (disabled?.some((d) => isSameDay(d, date))) return true
  return false
}

// ── CALENDAR PICKER ────────────────────────────────────────────

export function CalendarPicker({
  selectedDate,
  onSelect,
  minDate = new Date(),
  maxDate,
  disabledDates = [],
  className,
}: CalendarPickerProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(
    selectedDate?.getFullYear() ?? today.getFullYear()
  )
  const [viewMonth, setViewMonth] = useState(
    selectedDate?.getMonth() ?? today.getMonth()
  )
  const [direction, setDirection] = useState(1)

  const navigate = (delta: number) => {
    setDirection(delta)
    let m = viewMonth + delta
    let y = viewYear
    if (m > 11) { m = 0; y++ }
    if (m < 0) { m = 11; y-- }
    setViewMonth(m)
    setViewYear(y)
  }

  const { blanks, days } = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    return {
      blanks: Array.from({ length: firstDay }),
      days: Array.from({ length: daysInMonth }, (_, i) => i + 1),
    }
  }, [viewYear, viewMonth])

  return (
    <div className={cn('flex flex-col gap-4 select-none', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--glass-light)] border border-white/10 text-[var(--white-soft)]/60 hover:text-[var(--white-soft)] hover:border-gold/30 transition-all"
          style={{ cursor: 'none' }}
          aria-label="Previous month"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <AnimatePresence mode="wait">
          <motion.h3
            key={`${viewYear}-${viewMonth}`}
            initial={{ opacity: 0, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -20 }}
            transition={{ duration: 0.25 }}
            className="font-serif text-base text-[var(--white-soft)]"
          >
            {MONTHS[viewMonth]} {viewYear}
          </motion.h3>
        </AnimatePresence>

        <button
          onClick={() => navigate(1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--glass-light)] border border-white/10 text-[var(--white-soft)]/60 hover:text-[var(--white-soft)] hover:border-gold/30 transition-all"
          style={{ cursor: 'none' }}
          aria-label="Next month"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[9px] font-sans font-semibold tracking-[0.1em] uppercase text-[var(--white-soft)]/30 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewYear}-${viewMonth}`}
          initial={{ opacity: 0, x: direction * 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -30 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-7 gap-1"
        >
          {/* Blank cells */}
          {blanks.map((_, i) => <div key={`blank-${i}`} />)}

          {/* Day cells */}
          {days.map((day) => {
            const date = new Date(viewYear, viewMonth, day)
            const disabled = isDisabled(date, minDate, maxDate, disabledDates)
            const isToday = isSameDay(date, today)
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false
            const isPast = date < today && !isToday

            return (
              <button
                key={day}
                onClick={() => !disabled && !isPast && onSelect(date)}
                disabled={disabled || isPast}
                className={cn(
                  'w-full aspect-square flex items-center justify-center rounded-xl',
                  'text-sm font-sans transition-all duration-150',
                  isSelected
                    ? 'bg-[var(--gold)] text-[var(--bg-primary)] font-semibold shadow-[var(--shadow-gold)]'
                    : isToday
                    ? 'border border-gold/40 text-[var(--gold)] font-semibold'
                    : isPast || disabled
                    ? 'text-[var(--white-soft)]/15 cursor-not-allowed'
                    : 'text-[var(--white-soft)]/70 hover:bg-[var(--glass-gold)] hover:text-[var(--gold)] hover:border hover:border-gold/30'
                )}
                style={{ cursor: disabled || isPast ? 'not-allowed' : 'none' }}
                aria-label={`${MONTHS[viewMonth]} ${day}, ${viewYear}`}
                aria-pressed={isSelected}
              >
                {day}
              </button>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default CalendarPicker
