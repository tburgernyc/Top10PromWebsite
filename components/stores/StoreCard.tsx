'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge, StatusDot } from '@/components/ui/Badge'
import { GoldButton, GhostButton } from '@/components/ui/Button'
import { useCursor } from '@/components/layout/CustomCursor'
import type { Store } from '@/types'

// ── HELPERS ───────────────────────────────────────────────────

function isStoreOpen(store: Store): boolean {
  const now = new Date()
  const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const hoursStr = store.hours?.[day as keyof typeof store.hours]
  if (!hoursStr || hoursStr.toLowerCase() === 'closed') return false

  // Parse plain string format like "10am – 7pm" or "10:00am - 7:00pm"
  const match = hoursStr.match(/(\d+)(?::(\d+))?(am|pm)\s*[–\-]\s*(\d+)(?::(\d+))?(am|pm)/i)
  if (!match) return false

  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  let openH = parseInt(match[1])
  const openM = parseInt(match[2] ?? '0')
  const openMeridiem = match[3].toLowerCase()
  let closeH = parseInt(match[4])
  const closeM = parseInt(match[5] ?? '0')
  const closeMeridiem = match[6].toLowerCase()

  if (openMeridiem === 'pm' && openH !== 12) openH += 12
  if (openMeridiem === 'am' && openH === 12) openH = 0
  if (closeMeridiem === 'pm' && closeH !== 12) closeH += 12
  if (closeMeridiem === 'am' && closeH === 12) closeH = 0

  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes
}

// ── STORE CARD ────────────────────────────────────────────────

interface StoreCardProps {
  store: Store
  isSelected?: boolean
  distanceMiles?: number
  onSelect?: (store: Store) => void
  className?: string
  compact?: boolean
}

export function StoreCard({
  store,
  isSelected,
  distanceMiles,
  onSelect,
  className,
  compact = false,
}: StoreCardProps) {
  const isOpen = isStoreOpen(store)
  const { setCursorState, resetCursor } = useCursor()

  return (
    <motion.div
      layout
      whileHover={{ y: compact ? 0 : -2 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect?.(store)}
      className={cn(
        'p-5 rounded-2xl border transition-all duration-200',
        'flex flex-col gap-3',
        isSelected
          ? 'bg-[var(--glass-gold)] border-gold/40 shadow-[var(--shadow-gold)]'
          : 'bg-[var(--glass-light)] border-white/10 hover:border-gold/25',
        onSelect && 'cursor-none',
        className
      )}
      style={{ cursor: onSelect ? 'none' : undefined }}
      onMouseEnter={() => onSelect && setCursorState('hover')}
      onMouseLeave={() => onSelect && resetCursor()}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Status dot */}
          <div className="mt-1.5 flex-shrink-0">
            <StatusDot status={isOpen ? 'online' : 'offline'} pulse={isOpen} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={cn(
                'font-serif leading-tight',
                compact ? 'text-base' : 'text-lg',
                isSelected ? 'text-[var(--gold)]' : 'text-[var(--white-soft)]'
              )}>
                {store.name}
              </h3>
              {store.isHQ && (
                <Badge variant="hq" size="sm">HQ</Badge>
              )}
            </div>
            <p className="text-xs text-[var(--white-soft)]/40 font-sans mt-0.5">
              {store.city}, {store.state}
            </p>
          </div>
        </div>

        {/* Distance */}
        {distanceMiles !== undefined && (
          <span className="flex-shrink-0 text-xs font-sans text-[var(--gold)]/70">
            {distanceMiles.toFixed(1)} mi
          </span>
        )}
      </div>

      {/* Address + phone */}
      {!compact && (
        <div className="flex flex-col gap-1 ml-5">
          <p className="text-sm text-[var(--white-soft)]/60 font-sans">
            {store.address}
          </p>
          {store.phone && (
            <a
              href={`tel:${store.phone.replace(/\D/g, '')}`}
              className="text-sm text-[var(--white-soft)]/50 font-sans hover:text-[var(--gold)] transition-colors"
              style={{ cursor: 'none' }}
            >
              {store.phone}
            </a>
          )}
          <p className="text-xs font-sans mt-0.5">
            <span className={isOpen ? 'text-emerald-400' : 'text-[var(--white-soft)]/30'}>
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
          </p>
        </div>
      )}

      {/* CTA buttons */}
      {!compact && (
        <div className="flex gap-2 ml-5 mt-1">
          <GhostButton
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              window.open(
                `https://maps.google.com/?q=${encodeURIComponent(store.address + ', ' + store.city + ', ' + store.state)}`,
                '_blank'
              )
            }}
          >
            Get Directions
          </GhostButton>
          <GoldButton
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <Link
              href={`/appointments?store=${store.id}`}
              style={{ cursor: 'none' }}
            >
              Book Here
            </Link>
          </GoldButton>
        </div>
      )}
    </motion.div>
  )
}

// ── STORE LIST ────────────────────────────────────────────────

interface StoreListProps {
  stores: Store[]
  selectedStoreId?: string
  onSelect?: (store: Store) => void
  userLocation?: { lat: number; lng: number }
  className?: string
}

export function StoreList({
  stores,
  selectedStoreId,
  onSelect,
  userLocation,
  className,
}: StoreListProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {stores.map((store) => {
        let distance: number | undefined
        if (userLocation) {
          const { calculateDistance } = require('@/lib/utils')
          distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            store.coordinates.lat,
            store.coordinates.lng
          )
        }

        return (
          <StoreCard
            key={store.id}
            store={store}
            isSelected={String(store.id) === selectedStoreId}
            distanceMiles={distance}
            onSelect={onSelect}
          />
        )
      })}
    </div>
  )
}

export default StoreCard
