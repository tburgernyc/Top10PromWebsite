'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, formatDate } from '@/lib/utils'
import { TableRowSkeleton } from '@/components/ui/Skeleton'
import type { Order } from '@/types'

// ── ORDER ROW ─────────────────────────────────────────────────

function OrderRow({ order, isExpanded, onToggle }: {
  order: Order
  isExpanded: boolean
  onToggle: () => void
}) {
  const statusVariant = {
    processing: 'processing',
    confirmed: 'confirmed',
    shipped: 'shipped',
    delivered: 'delivered',
    returned: 'returned',
    cancelled: 'cancelled',
  }[order.status] as any

  return (
    <>
      <tr
        className="border-b border-white/8 hover:bg-white/3 transition-colors cursor-none"
        onClick={onToggle}
        style={{ cursor: 'none' }}
      >
        <td className="px-4 py-4">
          <div className="flex flex-col">
            <span className="text-sm font-sans text-[var(--white-soft)]">
              #{order.id.slice(-8).toUpperCase()}
            </span>
            <span className="text-xs text-[var(--white-soft)]/40 font-sans">
              {formatDate(order.createdAt)}
            </span>
          </div>
        </td>
        <td className="px-4 py-4">
          <div className="flex -space-x-2">
            {order.items?.slice(0, 3).map((item, i) => (
              <div
                key={i}
                className="w-10 h-12 rounded-lg overflow-hidden border-2 border-[var(--bg-elevated)] bg-[var(--glass-light)]"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.dressName ?? 'Item'}
                  width={40}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
            {(order.items?.length ?? 0) > 3 && (
              <div className="w-10 h-12 rounded-lg flex items-center justify-center bg-[var(--glass-medium)] border-2 border-[var(--bg-elevated)] text-xs text-[var(--white-soft)]/50 font-sans">
                +{(order.items?.length ?? 0) - 3}
              </div>
            )}
          </div>
        </td>
        <td className="px-4 py-4">
          <Badge variant={statusVariant} size="sm">
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </td>
        <td className="px-4 py-4">
          <span className="font-serif text-sm text-[var(--white-soft)]">
            {formatPrice(order.total ?? 0)}
          </span>
        </td>
        <td className="px-4 py-4">
          <button
            className="text-[var(--white-soft)]/40 hover:text-[var(--gold)] transition-colors"
            style={{ cursor: 'none' }}
            aria-label={isExpanded ? 'Collapse order' : 'Expand order'}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className={cn('transition-transform', isExpanded && 'rotate-180')}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </td>
      </tr>

      {/* Expanded row */}
      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan={5} className="p-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="px-4 py-4 bg-[var(--glass-light)] border-b border-white/8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Items */}
                    <div>
                      <p className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[var(--white-soft)]/40 mb-3">
                        Items
                      </p>
                      <div className="flex flex-col gap-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-10 rounded-lg overflow-hidden bg-[var(--glass-medium)] flex-shrink-0">
                              <Image
                                src={item.imageUrl}
                                alt={item.dressName ?? 'Item'}
                                width={32}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-sans text-[var(--white-soft)]/80">
                                {item.dressName}
                              </p>
                              <p className="text-[10px] text-[var(--white-soft)]/40 font-sans">
                                {item.color} · Size {item.size} · Qty {item.quantity}
                              </p>
                            </div>
                            <span className="ml-auto text-xs font-serif text-[var(--white-soft)]/60">
                              {formatPrice((item.price ?? 0) * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping */}
                    <div>
                      <p className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[var(--white-soft)]/40 mb-3">
                        Shipping
                      </p>
                      {order.shippingAddress && (
                        <div className="text-xs text-[var(--white-soft)]/60 font-sans leading-relaxed">
                          <p>{order.shippingAddress.fullName}</p>
                          <p>{order.shippingAddress.line1}</p>
                          {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                        </div>
                      )}
                      {order.trackingNumber && (
                        <p className="text-xs text-[var(--gold)] font-sans mt-2">
                          Tracking: {order.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  )
}

// ── ORDER HISTORY TABLE ────────────────────────────────────────

interface OrderHistoryTableProps {
  orders: Order[]
  loading?: boolean
  className?: string
}

export function OrderHistoryTable({ orders, loading = false, className }: OrderHistoryTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className={cn('rounded-2xl bg-[var(--glass-light)] border border-white/10 overflow-hidden', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            {['Order', 'Items', 'Status', 'Total', ''].map((h) => (
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
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <TableRowSkeleton key={i} cols={5} />
              ))
            : orders.length === 0
            ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <p className="font-serif text-lg text-[var(--white-soft)]/30">No orders yet</p>
                  <p className="text-xs text-[var(--white-soft)]/20 font-sans mt-1">
                    Your order history will appear here.
                  </p>
                </td>
              </tr>
            )
            : orders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                isExpanded={expandedId === order.id}
                onToggle={() => toggle(order.id)}
              />
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrderHistoryTable
