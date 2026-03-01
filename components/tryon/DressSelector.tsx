'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { DRESSES } from '@/lib/mock-data'
import { formatPrice } from '@/lib/utils'
import type { Dress, Occasion } from '@/types'

// ── TYPES ─────────────────────────────────────────────────────

interface DressSelectorProps {
  selectedDress: Dress | null
  onSelect: (dress: Dress) => void
  className?: string
}

// ── FILTER TABS ────────────────────────────────────────────────

const OCCASIONS = ['All', 'Prom', 'Homecoming', 'Bridal', 'Evening', 'Pageant']

// ── DRESS SELECTOR ─────────────────────────────────────────────

export function DressSelector({ selectedDress, onSelect, className }: DressSelectorProps) {
  const [activeOccasion, setActiveOccasion] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = [...DRESSES]
    if (activeOccasion !== 'All') {
      result = result.filter(d => d.occasions.includes(activeOccasion.toLowerCase() as Occasion))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.designer.toLowerCase().includes(q) ||
        d.colors.some(c => c.name.toLowerCase().includes(q))
      )
    }
    return result.slice(0, 30) // cap for performance
  }, [activeOccasion, search])

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Search */}
      <input
        type="text"
        placeholder="Search styles, designers, colors..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-[var(--glass-light)] border border-white/10 text-sm font-sans text-[var(--white-soft)]/80 placeholder-[var(--white-soft)]/20 focus:outline-none focus:border-gold/40 transition-colors"
        style={{ cursor: 'none' }}
      />

      {/* Occasion tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {OCCASIONS.map(occ => (
          <button
            key={occ}
            onClick={() => setActiveOccasion(occ)}
            className={cn(
              'flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-sans font-semibold tracking-[0.1em] uppercase transition-all duration-200 border',
              activeOccasion === occ
                ? 'bg-[var(--gold)] border-transparent text-[var(--bg-primary)]'
                : 'bg-[var(--glass-light)] border-white/10 text-[var(--white-soft)]/40 hover:border-gold/25 hover:text-[var(--gold)]'
            )}
            style={{ cursor: 'none' }}
          >
            {occ}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {filtered.map((dress, i) => {
            const isSelected = selectedDress?.id === dress.id
            const primaryColor = dress.colors[0]
            const imgSrc = dress.imageUrls[0] ?? `https://picsum.photos/seed/${dress.id}/400/533`

            return (
              <motion.button
                key={dress.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: (i % 9) * 0.04, duration: 0.3 }}
                onClick={() => onSelect(dress)}
                className={cn(
                  'relative rounded-xl overflow-hidden border transition-all duration-200 group',
                  isSelected
                    ? 'border-[var(--gold)] shadow-[var(--shadow-gold)] ring-1 ring-[var(--gold)]/30'
                    : 'border-white/10 hover:border-gold/30'
                )}
                style={{ aspectRatio: '3/4', cursor: 'none' }}
              >
                {/* Dress image */}
                <Image
                  src={imgSrc}
                  alt={dress.name}
                  fill
                  className={cn(
                    'object-cover transition-transform duration-500',
                    isSelected ? 'scale-105' : 'group-hover:scale-105'
                  )}
                  sizes="(max-width: 640px) 33vw, 120px"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/90 via-transparent to-transparent" />

                {/* Selected indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--gold)] flex items-center justify-center"
                    >
                      <span className="text-[8px] text-[var(--bg-primary)] font-bold">✓</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Info */}
                <div className="absolute bottom-0 inset-x-0 p-2">
                  <p className="text-[9px] font-sans font-semibold text-[var(--white-soft)]/80 truncate leading-tight">
                    {dress.name}
                  </p>
                  <p className={cn(
                    'text-[8px] font-sans font-semibold',
                    isSelected ? 'text-[var(--gold)]' : 'text-[var(--white-soft)]/40'
                  )}>
                    {formatPrice(dress.price)}
                  </p>
                </div>

                {/* Color dot */}
                {primaryColor && (
                  <div
                    className="absolute top-2 left-2 w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: primaryColor.hex }}
                    title={primaryColor.name}
                  />
                )}
              </motion.button>
            )
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="col-span-3 py-12 flex items-center justify-center">
            <p className="text-sm font-sans text-[var(--white-soft)]/25 text-center">
              No styles found.<br />Try a different filter or search term.
            </p>
          </div>
        )}
      </div>

      {/* Selected summary */}
      <AnimatePresence>
        {selectedDress && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-[var(--glass-gold)] border border-gold/25"
          >
            <div className="relative w-10 h-14 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={selectedDress.imageUrls[0] ?? `https://picsum.photos/seed/${selectedDress.id}/80/107`}
                alt={selectedDress.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-sans font-semibold text-[var(--gold)] truncate">{selectedDress.name}</p>
              <p className="text-[10px] font-sans text-[var(--white-soft)]/50 truncate">{selectedDress.designer}</p>
              <p className="text-[10px] font-sans text-[var(--white-soft)]/40">{formatPrice(selectedDress.price)}</p>
            </div>
            <button
              onClick={() => onSelect(selectedDress)}
              className="text-[var(--white-soft)]/20 hover:text-[var(--white-soft)]/50 transition-colors text-xs"
              style={{ cursor: 'none' }}
              aria-label="Deselect dress"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DressSelector
