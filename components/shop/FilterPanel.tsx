'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Dropdown, FilterDropdown } from '@/components/ui/Dropdown'
import { useCursor } from '@/components/layout/CustomCursor'
import type { FilterState } from '@/types'

// ── FILTER OPTIONS ─────────────────────────────────────────────

export const OCCASIONS = [
  { label: 'All', value: '' },
  { label: 'Prom', value: 'prom' },
  { label: 'Homecoming', value: 'homecoming' },
  { label: 'Bridal', value: 'bridal' },
  { label: 'Evening', value: 'evening' },
  { label: 'Pageant', value: 'pageant' },
  { label: 'Sweet 16', value: 'sweet16' },
  { label: 'Quinceañera', value: 'quinceanera' },
]

export const COLORS = [
  { label: 'All Colors', value: '', colorHex: undefined },
  { label: 'Black', value: 'black', colorHex: '#0A0A0A' },
  { label: 'Navy', value: 'navy', colorHex: '#1B2A5E' },
  { label: 'Burgundy', value: 'burgundy', colorHex: '#722F37' },
  { label: 'Red', value: 'red', colorHex: '#C0392B' },
  { label: 'Blush', value: 'blush', colorHex: '#F2B5C7' },
  { label: 'Gold', value: 'gold', colorHex: '#D4AF72' },
  { label: 'Champagne', value: 'champagne', colorHex: '#F7E7CE' },
  { label: 'White', value: 'white', colorHex: '#F8F4F0' },
  { label: 'Emerald', value: 'emerald', colorHex: '#2ECC71' },
  { label: 'Royal Blue', value: 'royal-blue', colorHex: '#2980B9' },
  { label: 'Purple', value: 'purple', colorHex: '#8E44AD' },
  { label: 'Silver', value: 'silver', colorHex: '#BDC3C7' },
]

export const PRICE_RANGES = [
  { label: 'All Prices', value: '' },
  { label: 'Under $300', value: '0-300' },
  { label: '$300–$600', value: '300-600' },
  { label: '$600–$1,000', value: '600-1000' },
  { label: '$1,000–$1,500', value: '1000-1500' },
  { label: '$1,500+', value: '1500-9999' },
]

export const SIZES = [
  { label: 'All Sizes', value: '' },
  { label: 'XS (00–0)', value: 'xs' },
  { label: 'S (2–4)', value: 's' },
  { label: 'M (6–8)', value: 'm' },
  { label: 'L (10–12)', value: 'l' },
  { label: 'XL (14–16)', value: 'xl' },
  { label: 'Plus (18+)', value: 'plus' },
]

export const DESIGNERS = [
  { label: 'All Designers', value: '' },
  { label: 'Johnathan Kayne', value: 'johnathan-kayne' },
  { label: 'Ashley Lauren', value: 'ashley-lauren' },
  { label: 'Jessica Angel', value: 'jessica-angel' },
  { label: 'Tiffany Designs', value: 'tiffany-designs' },
  { label: 'Chandalier LA', value: 'chandalier-la' },
  { label: '2Cute Prom', value: '2cute-prom' },
]

export const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low–High', value: 'price_asc' },
  { label: 'Price: High–Low', value: 'price_desc' },
  { label: 'Most Popular', value: 'popular' },
]

// ── FILTER CHIP (mobile) ──────────────────────────────────────

function FilterChip({
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
        'flex-shrink-0 px-4 py-2 rounded-full',
        'text-xs font-sans font-semibold tracking-[0.12em] uppercase',
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

// ── FILTER PANEL ──────────────────────────────────────────────

interface FilterPanelProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  totalResults: number
  className?: string
  variant?: 'bar' | 'sidebar'
}

export function FilterPanel({
  filters,
  onFilterChange,
  totalResults,
  className,
  variant = 'bar',
}: FilterPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { setCursorState, resetCursor } = useCursor()

  const update = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      onFilterChange({ ...filters, [key]: value })
    },
    [filters, onFilterChange]
  )

  const clearAll = useCallback(() => {
    onFilterChange({
      occasion: '',
      color: '',
      priceRange: '',
      size: '',
      designer: '',
      sortBy: 'featured',
      inStock: false,
      onSale: false,
      isNew: false,
      searchQuery: '',
    })
  }, [onFilterChange])

  const hasActiveFilters =
    !!filters.occasion ||
    !!filters.color ||
    !!filters.priceRange ||
    !!filters.size ||
    !!filters.designer ||
    filters.inStock ||
    filters.onSale ||
    filters.isNew

  // ── BAR VARIANT ────────────────────────────────────────────

  if (variant === 'bar') {
    return (
      <div className={cn('w-full', className)}>
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter dropdowns */}
          <FilterDropdown
            label="Occasion"
            items={OCCASIONS}
            onSelect={(v) => update('occasion', v)}
            selectedValue={filters.occasion}
            isActive={!!filters.occasion}
          />
          <FilterDropdown
            label="Color"
            items={COLORS}
            onSelect={(v) => update('color', v)}
            selectedValue={filters.color}
            isActive={!!filters.color}
          />
          <FilterDropdown
            label="Price"
            items={PRICE_RANGES}
            onSelect={(v) => update('priceRange', v)}
            selectedValue={filters.priceRange}
            isActive={!!filters.priceRange}
          />
          <FilterDropdown
            label="Size"
            items={SIZES}
            onSelect={(v) => update('size', v)}
            selectedValue={filters.size}
            isActive={!!filters.size}
          />
          <FilterDropdown
            label="Designer"
            items={DESIGNERS}
            onSelect={(v) => update('designer', v)}
            selectedValue={filters.designer}
            isActive={!!filters.designer}
          />

          {/* Quick toggle chips */}
          <FilterChip
            label="In Stock"
            active={filters.inStock}
            onClick={() => update('inStock', !filters.inStock)}
          />
          <FilterChip
            label="On Sale"
            active={filters.onSale}
            onClick={() => update('onSale', !filters.onSale)}
          />
          <FilterChip
            label="New Arrivals"
            active={filters.isNew}
            onClick={() => update('isNew', !filters.isNew)}
          />

          {/* Spacer */}
          <div className="ml-auto flex items-center gap-4">
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="text-xs text-[var(--white-soft)]/40 hover:text-[var(--blush)] font-sans transition-colors"
                style={{ cursor: 'none' }}
                onMouseEnter={() => setCursorState('hover')}
                onMouseLeave={resetCursor}
              >
                Clear all
              </button>
            )}

            {/* Results count */}
            <span className="text-xs text-[var(--white-soft)]/30 font-sans">
              {totalResults.toLocaleString()} styles
            </span>

            {/* Sort */}
            <FilterDropdown
              label={
                SORT_OPTIONS.find((s) => s.value === filters.sortBy)?.label ??
                'Sort'
              }
              items={SORT_OPTIONS}
              onSelect={(v) => update('sortBy', v as FilterState['sortBy'])}
              selectedValue={filters.sortBy}
              isActive={filters.sortBy !== 'featured'}
            />
          </div>
        </div>
      </div>
    )
  }

  // ── SIDEBAR VARIANT ────────────────────────────────────────

  return (
    <aside className={cn('flex flex-col gap-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-sans font-semibold tracking-[0.25em] uppercase text-[var(--gold)]">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-[var(--white-soft)]/40 hover:text-[var(--blush)] font-sans transition-colors"
            style={{ cursor: 'none' }}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Occasion */}
      <FilterSection title="Occasion">
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((o) => (
            <FilterChip
              key={o.value}
              label={o.label || 'All'}
              active={filters.occasion === o.value}
              onClick={() => update('occasion', o.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Designer */}
      <FilterSection title="Designer">
        <div className="flex flex-col gap-2">
          {DESIGNERS.map((d) => (
            <label
              key={d.value}
              className="flex items-center gap-3 cursor-none"
              style={{ cursor: 'none' }}
            >
              <input
                type="radio"
                name="designer"
                value={d.value}
                checked={filters.designer === d.value}
                onChange={() => update('designer', d.value)}
                className="accent-[var(--gold)]"
              />
              <span className="text-sm text-[var(--white-soft)]/70 font-sans">
                {d.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price Range">
        <div className="flex flex-col gap-2">
          {PRICE_RANGES.map((p) => (
            <label
              key={p.value}
              className="flex items-center gap-3"
              style={{ cursor: 'none' }}
            >
              <input
                type="radio"
                name="price"
                value={p.value}
                checked={filters.priceRange === p.value}
                onChange={() => update('priceRange', p.value)}
                className="accent-[var(--gold)]"
              />
              <span className="text-sm text-[var(--white-soft)]/70 font-sans">
                {p.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Colors */}
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {COLORS.filter((c) => c.colorHex).map((c) => (
            <button
              key={c.value}
              onClick={() => update('color', filters.color === c.value ? '' : c.value)}
              className={cn(
                'w-7 h-7 rounded-full border-2 transition-all duration-150',
                filters.color === c.value
                  ? 'border-[var(--gold)] scale-110'
                  : 'border-white/20 hover:border-white/50'
              )}
              style={{ backgroundColor: c.colorHex, cursor: 'none' }}
              title={c.label}
              aria-label={c.label}
            />
          ))}
        </div>
      </FilterSection>

      {/* Quick toggles */}
      <FilterSection title="Quick Filters">
        <div className="flex flex-col gap-3">
          {[
            { label: 'In Stock Only', key: 'inStock' as const },
            { label: 'On Sale', key: 'onSale' as const },
            { label: 'New Arrivals', key: 'isNew' as const },
          ].map(({ label, key }) => (
            <label key={key} className="flex items-center gap-3" style={{ cursor: 'none' }}>
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={() => update(key, !filters[key])}
                className="w-4 h-4 accent-[var(--gold)] rounded"
              />
              <span className="text-sm text-[var(--white-soft)]/70 font-sans">
                {label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Results */}
      <p className="text-xs text-[var(--white-soft)]/30 font-sans mt-2">
        {totalResults.toLocaleString()} styles found
      </p>
    </aside>
  )
}

// ── FILTER SECTION ─────────────────────────────────────────────

function FilterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[var(--white-soft)]/40">
        {title}
      </p>
      {children}
    </div>
  )
}

// ── APPLY FILTERS UTILITY ──────────────────────────────────────

export function applyFilters(dresses: any[], filters: FilterState): any[] {
  let result = [...dresses]

  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase()
    result = result.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.designer.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q)
    )
  }

  if (filters.occasion) {
    result = result.filter((d) =>
      d.occasions?.includes(filters.occasion)
    )
  }

  if (filters.designer) {
    result = result.filter(
      (d) => d.designer_slug === filters.designer
    )
  }

  if (filters.color) {
    result = result.filter((d) =>
      d.colors?.some((c: any) =>
        c.name.toLowerCase().includes(filters.color.replace('-', ' '))
      )
    )
  }

  if (filters.priceRange) {
    const [min, max] = filters.priceRange.split('-').map(Number)
    result = result.filter((d) => {
      const price = d.sale_price ?? d.price
      return price >= min && price <= max
    })
  }

  if (filters.size) {
    result = result.filter((d) =>
      d.sizes?.some((s: string) => s.toLowerCase().startsWith(filters.size.charAt(0)))
    )
  }

  if (filters.inStock) {
    result = result.filter((d) => d.stock_status === 'in_stock')
  }

  if (filters.onSale) {
    result = result.filter((d) => d.is_sale && d.sale_price)
  }

  if (filters.isNew) {
    result = result.filter((d) => d.is_new)
  }

  // Sort
  switch (filters.sortBy) {
    case 'newest':
      result.sort((a, b) =>
        new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
      )
      break
    case 'price_asc':
      result.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price))
      break
    case 'price_desc':
      result.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price))
      break
    case 'popular':
      result.sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0))
      break
    default:
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
  }

  return result
}

export default FilterPanel
