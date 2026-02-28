'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useCursor } from '@/components/layout/CustomCursor'

// ── TYPES ─────────────────────────────────────────────────────

interface RegionFilterProps {
  regions: string[]
  selectedRegion: string
  onSelect: (region: string) => void
  onSearch?: (query: string) => void
  className?: string
}

// ── COMPONENT ─────────────────────────────────────────────────

export function RegionFilter({
  regions,
  selectedRegion,
  onSelect,
  onSearch,
  className,
}: RegionFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { setCursorState, resetCursor } = useCursor()

  const handleSearch = (q: string) => {
    setSearchQuery(q)
    onSearch?.(q)
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Search */}
      {onSearch && (
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--white-soft)]/30">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by city or zip code..."
            className={cn(
              'w-full h-10 pl-9 pr-4 rounded-xl',
              'bg-[var(--glass-medium)] border border-white/10',
              'text-sm text-[var(--white-soft)] placeholder:text-[var(--white-soft)]/25 font-sans',
              'outline-none focus:border-gold/40 transition-colors'
            )}
            style={{ cursor: 'text' }}
          />
        </div>
      )}

      {/* Region chips */}
      <div className="flex flex-wrap gap-2">
        <RegionChip
          label="All Locations"
          active={selectedRegion === ''}
          onClick={() => onSelect('')}
        />
        {regions.map((region) => (
          <RegionChip
            key={region}
            label={region}
            active={selectedRegion === region}
            onClick={() => onSelect(region)}
          />
        ))}
      </div>
    </div>
  )
}

// ── REGION CHIP ───────────────────────────────────────────────

function RegionChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  const { setCursorState, resetCursor } = useCursor()
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-full text-xs font-sans font-semibold tracking-[0.12em] uppercase',
        'border transition-all duration-200',
        active
          ? 'bg-[var(--glass-gold)] border-gold/40 text-[var(--gold)]'
          : 'bg-[var(--glass-light)] border-white/10 text-[var(--white-soft)]/60 hover:border-gold/25 hover:text-[var(--white-soft)]'
      )}
      style={{ cursor: 'none' }}
      onMouseEnter={() => setCursorState('hover')}
      onMouseLeave={resetCursor}
    >
      {label}
    </button>
  )
}

export default RegionFilter
