'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { GoldButton, GhostButton } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import type { Appointment, AppointmentStatus } from '@/types'

// ── STATUS BADGE VARIANT MAP ──────────────────────────────────

const statusVariant: Record<AppointmentStatus, string> = {
  pending: 'processing',
  confirmed: 'confirmed',
  completed: 'delivered',
  cancelled: 'cancelled',
  no_show: 'cancelled',
}

// ── APPOINTMENT CARD ──────────────────────────────────────────

interface AppointmentCardProps {
  appointment: Appointment
  onCancel?: (id: string) => void
  onReschedule?: (id: string) => void
  className?: string
}

export function AppointmentCard({
  appointment,
  onCancel,
  onReschedule,
  className,
}: AppointmentCardProps) {
  const isPast = new Date(appointment.appointmentDate) < new Date()
  const isUpcoming = !isPast && appointment.status !== 'cancelled'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'p-5 rounded-2xl border transition-all duration-200',
        isUpcoming
          ? 'bg-[var(--glass-gold)] border-gold/25'
          : 'bg-[var(--glass-light)] border-white/10',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Date block */}
        <div
          className={cn(
            'flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center',
            isUpcoming
              ? 'bg-[var(--gold)] text-[var(--bg-primary)]'
              : 'bg-[var(--glass-medium)] text-[var(--white-soft)]/50'
          )}
        >
          <span className="text-lg font-serif font-bold leading-none">
            {new Date(appointment.appointmentDate).getDate()}
          </span>
          <span className="text-[9px] font-sans font-semibold tracking-[0.1em] uppercase">
            {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { month: 'short' })}
          </span>
        </div>

        {/* Center: Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-serif text-base text-[var(--white-soft)]">
              {appointment.occasion?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </h3>
            <Badge variant={statusVariant[appointment.status]} size="sm">
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Badge>
          </div>

          <p className="text-xs text-[var(--white-soft)]/50 font-sans">
            {appointment.appointmentTime}
          </p>

          {appointment.storeName && (
            <p className="text-xs text-[var(--gold)]/70 font-sans mt-1">
              📍 {appointment.storeName}
            </p>
          )}

          {appointment.notes && (
            <p className="text-xs text-[var(--white-soft)]/35 font-sans mt-2 italic">
              "{appointment.notes}"
            </p>
          )}
        </div>

        {/* Right: Actions */}
        {isUpcoming && (
          <div className="flex flex-col gap-2 flex-shrink-0">
            {onReschedule && (
              <GhostButton
                size="sm"
                onClick={() => onReschedule(appointment.id)}
              >
                Reschedule
              </GhostButton>
            )}
            {onCancel && (
              <button
                onClick={() => onCancel(appointment.id)}
                className="text-[10px] font-sans text-[var(--white-soft)]/30 hover:text-red-400 transition-colors tracking-[0.1em] uppercase"
                style={{ cursor: 'none' }}
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reminder for upcoming */}
      {isUpcoming && appointment.status === 'confirmed' && (
        <div className="mt-4 pt-3 border-t border-gold/15 flex items-center justify-between">
          <p className="text-xs text-[var(--white-soft)]/40 font-sans">
            {Math.ceil((new Date(appointment.appointmentDate).getTime() - Date.now()) / 86400000)} days away
          </p>
          <Link
            href={`/stores?store=${appointment.storeId}`}
            className="text-xs text-[var(--gold)]/70 hover:text-[var(--gold)] font-sans transition-colors"
            style={{ cursor: 'none' }}
          >
            Get directions →
          </Link>
        </div>
      )}
    </motion.div>
  )
}

// ── APPOINTMENT LIST ──────────────────────────────────────────

interface AppointmentListProps {
  appointments: Appointment[]
  onCancel?: (id: string) => void
  onReschedule?: (id: string) => void
  className?: string
}

export function AppointmentList({
  appointments,
  onCancel,
  onReschedule,
  className,
}: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--glass-light)] flex items-center justify-center">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-[var(--white-soft)]/20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </div>
        <div>
          <p className="font-serif text-lg text-[var(--white-soft)]/30 mb-1">
            No appointments scheduled
          </p>
          <p className="text-xs text-[var(--white-soft)]/20 font-sans">
            Book your in-store styling session today.
          </p>
        </div>
        <GoldButton>
          <Link href="/appointments" style={{ cursor: 'none' }}>
            Book Appointment
          </Link>
        </GoldButton>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {appointments.map((appt) => (
        <AppointmentCard
          key={appt.id}
          appointment={appt}
          onCancel={onCancel}
          onReschedule={onReschedule}
        />
      ))}
    </div>
  )
}

export default AppointmentCard
