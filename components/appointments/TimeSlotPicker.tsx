'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ── TYPES ─────────────────────────────────────────────────────

interface TimeSlotPickerProps {
  selectedTime: string | null
  onSelect: (time: string) => void
  availableSlots?: string[]
  date?: Date | null
  className?: string
}

// ── GENERATE SLOTS ─────────────────────────────────────────────

function generateSlots(date: Date | null): string[] {
  if (!date) return []
  const day = date.getDay()

  // Weekend hours: 10am–6pm, Weekday: 11am–7pm
  const isWeekend = day === 0 || day === 6
  const startHour = isWeekend ? 10 : 11
  const endHour = isWeekend ? 17 : 18 // last slot start

  const slots: string[] = []
  for (let h = startHour; h <= endHour; h++) {
    const suffix = h < 12 ? 'AM' : 'PM'
    const hour = h > 12 ? h - 12 : h
    slots.push(`${hour}:00 ${suffix}`)
    if (h < endHour) slots.push(`${hour}:30 ${suffix}`)
  }
  return slots
}

// ── TIME SLOT PICKER ───────────────────────────────────────────

export function TimeSlotPicker({
  selectedTime,
  onSelect,
  availableSlots,
  date,
  className,
}: TimeSlotPickerProps) {
  const slots = useMemo(
    () => availableSlots ?? generateSlots(date ?? null),
    [availableSlots, date]
  )

  // Simulate some booked slots
  const bookedSlots = useMemo(() => {
    if (!date) return new Set<string>()
    const seed = date.getDate() + date.getMonth() * 31
    return new Set(
      slots.filter((_, i) => (i + seed) % 5 === 0)
    )
  }, [date, slots])

  if (!date) {
    return (
      <div className={cn('flex items-center justify-center py-8', className)}>
        <p className="text-sm text-[var(--white-soft)]/30 font-sans">
          Please select a date first.
        </p>
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-8', className)}>
        <p className="text-sm text-[var(--white-soft)]/30 font-sans">
          No appointments available for this date.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <p className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[var(--white-soft)]/40">
        Available times
      </p>
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot, i) => {
          const booked = bookedSlots.has(slot)
          const isSelected = selectedTime === slot

          return (
            <motion.button
              key={slot}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.3 }}
              onClick={() => !booked && onSelect(slot)}
              disabled={booked}
              className={cn(
                'py-2.5 px-3 rounded-xl text-xs font-sans font-semibold',
                'border transition-all duration-150',
                isSelected
                  ? 'bg-[var(--gold)] border-gold text-[var(--bg-primary)]'
                  : booked
                  ? 'bg-[var(--glass-light)]/50 border-white/5 text-[var(--white-soft)]/15 cursor-not-allowed line-through'
                  : 'bg-[var(--glass-light)] border-white/10 text-[var(--white-soft)]/70 hover:border-gold/40 hover:text-[var(--gold)] hover:bg-[var(--glass-gold)]'
              )}
              style={{ cursor: booked ? 'not-allowed' : 'none' }}
              aria-label={booked ? `${slot} — unavailable` : slot}
              aria-pressed={isSelected}
            >
              {slot}
            </motion.button>
          )
        })}
      </div>
      <p className="text-[9px] text-[var(--white-soft)]/20 font-sans">
        Each appointment is 60 minutes · Times shown in local time
      </p>
    </div>
  )
}

export default TimeSlotPicker
