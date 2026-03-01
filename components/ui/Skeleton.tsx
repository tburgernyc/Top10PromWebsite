'use client'

import React from 'react'
import { cn } from '@/lib/utils'

// ── BASE SKELETON ─────────────────────────────────────────────

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  style?: React.CSSProperties
}

export function Skeleton({ className, width, height, style }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton rounded-lg animate-shimmer', className)}
      style={{ width, height, ...style }}
    />
  )
}

// ── TEXT SKELETON ─────────────────────────────────────────────

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          width={i === lines - 1 ? '65%' : '100%'}
        />
      ))}
    </div>
  )
}

// ── PRODUCT CARD SKELETON ─────────────────────────────────────

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Image */}
      <Skeleton className="w-full rounded-xl animate-shimmer" style={{ aspectRatio: '3/4' }} />
      {/* Designer name */}
      <Skeleton className="h-3 w-24" />
      {/* Dress name */}
      <Skeleton className="h-5 w-full" />
      {/* Price */}
      <Skeleton className="h-4 w-16" />
      {/* Color dots */}
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="w-4 h-4 rounded-full" />
        ))}
      </div>
    </div>
  )
}

// ── PRODUCT GRID SKELETON ────────────────────────────────────

export function ProductGridSkeleton({
  count = 6,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ── METRIC CARD SKELETON ──────────────────────────────────────

export function MetricCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'p-6 rounded-2xl bg-[var(--glass-light)] border border-white/10',
        className
      )}
    >
      <Skeleton className="h-3 w-28 mb-4" />
      <Skeleton className="h-10 w-24 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

// ── TABLE ROW SKELETON ────────────────────────────────────────

export function TableRowSkeleton({
  cols = 5,
  className,
}: {
  cols?: number
  className?: string
}) {
  return (
    <tr className={className}>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4" width={i === 0 ? '80%' : i === 1 ? '60%' : '40%'} />
        </td>
      ))}
    </tr>
  )
}

// ── STORE CARD SKELETON ───────────────────────────────────────

export function StoreCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'p-5 rounded-2xl bg-[var(--glass-light)] border border-white/10',
        'flex justify-between items-start',
        className
      )}
    >
      <div className="flex gap-3 items-start">
        <Skeleton className="w-3 h-3 rounded-full mt-1" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <Skeleton className="h-3 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default Skeleton
