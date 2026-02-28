'use client'

import { useState, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { formatPrice } from '@/lib/utils'
import { TableRowSkeleton } from '@/components/ui/Skeleton'
import type { Dress } from '@/types'

// ── TYPES ─────────────────────────────────────────────────────

interface InventoryTableProps {
  dresses: Dress[]
  loading?: boolean
  className?: string
  onEdit?: (dress: Dress) => void
  onToggleActive?: (id: string, active: boolean) => void
}

// ── STOCK STATUS BADGE ─────────────────────────────────────────

function StockBadge({ status }: { status: string }) {
  const variant = {
    in_stock: 'in_stock',
    low_stock: 'low_stock',
    backordered: 'backordered',
    discontinued: 'discontinued',
  }[status] as any ?? 'glass'

  const label = {
    in_stock: 'In Stock',
    low_stock: 'Low Stock',
    backordered: 'Backordered',
    discontinued: 'Discontinued',
  }[status] ?? status

  return <Badge variant={variant} size="sm">{label}</Badge>
}

// ── INVENTORY TABLE ────────────────────────────────────────────

export function InventoryTable({
  dresses,
  loading = false,
  className,
  onEdit,
  onToggleActive,
}: InventoryTableProps) {
  const [search, setSearch] = useState('')
  const [sortCol, setSortCol] = useState<'name' | 'price' | 'stock'>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [stockFilter, setStockFilter] = useState<string>('')

  const filtered = useMemo(() => {
    let result = [...dresses]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.designer.toLowerCase().includes(q) ||
          d.sku?.toLowerCase().includes(q)
      )
    }

    if (stockFilter) {
      result = result.filter((d) => d.stock_status === stockFilter)
    }

    result.sort((a, b) => {
      let av: any, bv: any
      if (sortCol === 'name') { av = a.name; bv = b.name }
      else if (sortCol === 'price') { av = a.sale_price ?? a.price; bv = b.sale_price ?? b.price }
      else { av = a.stock_quantity ?? 0; bv = b.stock_quantity ?? 0 }

      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [dresses, search, sortCol, sortDir, stockFilter])

  const toggleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortCol(col); setSortDir('asc') }
  }

  const SortIcon = ({ col }: { col: string }) => (
    <svg
      width="10"
      height="10"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      className={cn(
        'inline-block ml-1 transition-all',
        sortCol === col ? 'text-[var(--gold)]' : 'text-white/20',
        sortCol === col && sortDir === 'desc' && 'rotate-180'
      )}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
    </svg>
  )

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Controls */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search by name, designer, or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            }
          />
        </div>
        <div className="flex gap-2">
          {['', 'in_stock', 'low_stock', 'backordered'].map((s) => (
            <button
              key={s}
              onClick={() => setStockFilter(s)}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-sans font-semibold tracking-[0.1em] uppercase border transition-all',
                stockFilter === s
                  ? 'bg-[var(--glass-gold)] border-gold/40 text-[var(--gold)]'
                  : 'bg-[var(--glass-light)] border-white/10 text-[var(--white-soft)]/50 hover:border-gold/25'
              )}
              style={{ cursor: 'none' }}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[var(--glass-light)] border border-white/10 overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => toggleSort('name')}
                  className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[var(--white-soft)]/40 hover:text-[var(--gold)] transition-colors"
                  style={{ cursor: 'none' }}
                >
                  Style <SortIcon col="name" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[var(--white-soft)]/40">
                SKU
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => toggleSort('price')}
                  className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[var(--white-soft)]/40 hover:text-[var(--gold)] transition-colors"
                  style={{ cursor: 'none' }}
                >
                  Retail / Wholesale <SortIcon col="price" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => toggleSort('stock')}
                  className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[var(--white-soft)]/40 hover:text-[var(--gold)] transition-colors"
                  style={{ cursor: 'none' }}
                >
                  Stock <SortIcon col="stock" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[var(--white-soft)]/40">
                Status
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[var(--white-soft)]/40">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <p className="font-serif text-base text-[var(--white-soft)]/30">No styles match your filters</p>
                </td>
              </tr>
            ) : (
              filtered.map((dress) => (
                <tr key={dress.id} className="border-b border-white/6 hover:bg-white/2 transition-colors">
                  {/* Style */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded-lg overflow-hidden bg-[var(--glass-medium)] flex-shrink-0">
                        <Image
                          src={dress.imageUrls?.[0] ?? `https://picsum.photos/seed/${dress.id}/80/107`}
                          alt={dress.name}
                          width={40}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-sans text-[var(--white-soft)] line-clamp-1">{dress.name}</p>
                        <p className="text-xs text-[var(--gold)]/60 font-sans">{dress.designer}</p>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-4 py-3">
                    <span className="text-xs text-[var(--white-soft)]/40 font-sans font-mono">
                      {dress.sku ?? '—'}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-serif text-[var(--white-soft)]">
                        {formatPrice(dress.price)}
                      </span>
                      {dress.wholesale_price && (
                        <span className="text-xs text-[var(--gold)]/60 font-sans">
                          {formatPrice(dress.wholesale_price)} wholesale
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Stock qty */}
                  <td className="px-4 py-3">
                    <span className={cn(
                      'text-sm font-sans font-semibold',
                      (dress.stock_quantity ?? 0) > 10 ? 'text-emerald-400'
                      : (dress.stock_quantity ?? 0) > 0 ? 'text-[var(--gold)]'
                      : 'text-red-400'
                    )}>
                      {dress.stock_quantity ?? 0}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StockBadge status={dress.stock_status ?? 'in_stock'} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit?.(dress)}
                        className="text-xs text-[var(--white-soft)]/40 hover:text-[var(--gold)] font-sans transition-colors"
                        style={{ cursor: 'none' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onToggleActive?.(dress.id, !dress.is_active)}
                        className={cn(
                          'text-xs font-sans transition-colors',
                          dress.is_active
                            ? 'text-emerald-400/60 hover:text-red-400'
                            : 'text-[var(--white-soft)]/30 hover:text-emerald-400'
                        )}
                        style={{ cursor: 'none' }}
                      >
                        {dress.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Row count */}
      <p className="text-xs text-[var(--white-soft)]/30 font-sans">
        Showing {filtered.length} of {dresses.length} styles
      </p>
    </div>
  )
}

export default InventoryTable
