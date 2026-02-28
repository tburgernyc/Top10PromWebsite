'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Dropdown } from '@/components/ui/Dropdown'
import { formatPrice, formatDate } from '@/lib/utils'
import { TableRowSkeleton } from '@/components/ui/Skeleton'
import type { Order } from '@/types'

// ── STATUS OPTIONS ─────────────────────────────────────────────

const STATUS_OPTIONS = [
  { label: 'Processing', value: 'processing' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Returned', value: 'returned' },
  { label: 'Cancelled', value: 'cancelled' },
]

// ── ORDER MANAGEMENT TABLE ─────────────────────────────────────

interface OrderManagementTableProps {
  orders: Order[]
  loading?: boolean
  onStatusChange?: (orderId: string, status: string) => void
  className?: string
}

export function OrderManagementTable({
  orders,
  loading = false,
  onStatusChange,
  className,
}: OrderManagementTableProps) {
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = [...orders]
    if (statusFilter) result = result.filter((o) => o.status === statusFilter)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
          o.shippingAddress?.email?.toLowerCase().includes(q)
      )
    }
    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [orders, statusFilter, search])

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Controls */}
      <div className="flex gap-3 flex-wrap items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders..."
          className={cn(
            'flex-1 min-w-[200px] h-10 px-4 rounded-xl',
            'bg-[var(--glass-medium)] border border-white/10',
            'text-sm text-[var(--white-soft)] placeholder:text-[var(--white-soft)]/25 font-sans outline-none',
            'focus:border-gold/40 transition-colors'
          )}
          style={{ cursor: 'text' }}
        />
        <div className="flex gap-2 flex-wrap">
          {['', ...STATUS_OPTIONS.map((s) => s.value)].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-sans font-semibold tracking-[0.1em] uppercase border transition-all',
                statusFilter === s
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
              {['Order ID', 'Customer', 'Date', 'Total', 'Status', 'Actions'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[var(--white-soft)]/40"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <p className="font-serif text-base text-[var(--white-soft)]/30">No orders found</p>
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="border-b border-white/6 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-[var(--white-soft)]/70">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm text-[var(--white-soft)] font-sans">
                        {order.shippingAddress?.fullName ?? 'Guest'}
                      </p>
                      <p className="text-xs text-[var(--white-soft)]/40 font-sans">
                        {order.shippingAddress?.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-[var(--white-soft)]/50 font-sans">
                      {formatDate(order.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-serif text-sm text-[var(--white-soft)]">
                      {formatPrice(order.total ?? 0)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={order.status as any}
                      size="sm"
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Dropdown
                      trigger={
                        <button
                          className="text-xs text-[var(--white-soft)]/40 hover:text-[var(--gold)] font-sans transition-colors flex items-center gap-1"
                          style={{ cursor: 'none' }}
                        >
                          Update Status
                          <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      }
                      items={STATUS_OPTIONS.filter((s) => s.value !== order.status)}
                      onSelect={(val) => onStatusChange?.(order.id, val)}
                      placement="bottom-right"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[var(--white-soft)]/30 font-sans">
        {filtered.length} of {orders.length} orders
      </p>
    </div>
  )
}

export default OrderManagementTable
