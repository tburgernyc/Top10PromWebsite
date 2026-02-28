// ============================================================
// TOP 10 PROM — Shared Utility Functions
// ============================================================

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Region, Store } from '@/types'

// ── CN — Conditional Tailwind Classes ────────────────────────

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// ── PRICE FORMATTING ──────────────────────────────────────────

export function formatPrice(
  price: number,
  options?: {
    showCents?: boolean
    currency?: string
  }
): string {
  const { showCents = true, currency = 'USD' } = options ?? {}
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(price)
}

// ── DATE FORMATTING ───────────────────────────────────────────

export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(d)
}

export function formatDateShort(date: string | Date): string {
  return formatDate(date, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatTime(time: string): string {
  // Convert "14:00" to "2:00 PM"
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`
}

export function getDaysUntil(date: string): number {
  const target = new Date(date)
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// ── REGION COLORS ─────────────────────────────────────────────

export function getRegionColor(region: Region): string {
  const colors: Record<Region, string> = {
    northeast: '#4A90D9',
    southeast: '#D4AF72',
    south: '#F2B5C7',
    midwest: '#9B6FD4',
    west: '#50C878',
  }
  return colors[region] ?? '#D4AF72'
}

export function getRegionLabel(region: Region): string {
  const labels: Record<Region, string> = {
    northeast: 'Northeast',
    southeast: 'Southeast',
    south: 'South',
    midwest: 'Midwest',
    west: 'West',
  }
  return labels[region] ?? region
}

// ── DISTANCE CALCULATION (Haversine Formula) ──────────────────

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959 // Earth radius in miles
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function sortStoresByDistance(
  stores: Store[],
  userLat: number,
  userLng: number
): Array<Store & { distance: number }> {
  return stores
    .map((store) => ({
      ...store,
      distance: calculateDistance(
        userLat,
        userLng,
        store.coordinates.lat,
        store.coordinates.lng
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
}

export function formatDistance(miles: number): string {
  if (miles < 1) return `${Math.round(miles * 5280)} ft`
  return `${miles.toFixed(1)} mi`
}

// ── SLUG GENERATION ───────────────────────────────────────────

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── TEXT UTILITIES ────────────────────────────────────────────

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '…'
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return `${count} ${count === 1 ? singular : (plural ?? singular + 's')}`
}

// ── STOCK STATUS ──────────────────────────────────────────────

export function getStockStatusColor(status: string): string {
  const colors: Record<string, string> = {
    in_stock: '#10B981',
    low_stock: '#D4AF72',
    backordered: '#F59E0B',
    discontinued: 'rgba(248,244,240,0.4)',
  }
  return colors[status] ?? colors.in_stock
}

export function getStockStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    in_stock: 'In Stock',
    low_stock: 'Low Stock',
    backordered: 'Backordered',
    discontinued: 'Discontinued',
  }
  return labels[status] ?? status
}

// ── ORDER STATUS ──────────────────────────────────────────────

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    processing: '#3B82F6',
    confirmed: '#8B5CF6',
    shipped: '#D4AF72',
    delivered: '#10B981',
    returned: 'rgba(248,244,240,0.4)',
    cancelled: '#EF4444',
  }
  return colors[status] ?? '#D4AF72'
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    processing: 'Processing',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    returned: 'Returned',
    cancelled: 'Cancelled',
  }
  return labels[status] ?? status
}

// ── BADGE VARIANT ─────────────────────────────────────────────

export function getBadgeVariant(dress: {
  isNew: boolean
  isSale: boolean
  isExclusive: boolean
  isFeatured: boolean
}): 'new' | 'sale' | 'exclusive' | 'featured' | null {
  if (dress.isFeatured) return 'featured'
  if (dress.isExclusive) return 'exclusive'
  if (dress.isNew) return 'new'
  if (dress.isSale) return 'sale'
  return null
}

// ── LOCAL STORAGE ─────────────────────────────────────────────

export function getLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable
  }
}

// ── RECENTLY VIEWED ───────────────────────────────────────────

const RECENTLY_VIEWED_KEY = 'top10_recently_viewed'
const MAX_RECENTLY_VIEWED = 12

export function addToRecentlyViewed(dressId: string): void {
  const current = getLocalStorage<string[]>(RECENTLY_VIEWED_KEY, [])
  const updated = [dressId, ...current.filter((id) => id !== dressId)].slice(
    0,
    MAX_RECENTLY_VIEWED
  )
  setLocalStorage(RECENTLY_VIEWED_KEY, updated)
}

export function getRecentlyViewed(): string[] {
  return getLocalStorage<string[]>(RECENTLY_VIEWED_KEY, [])
}

// ── URL HELPERS ───────────────────────────────────────────────

export function buildStoreContactUrl(storeName: string): string {
  return `/contact?store=${encodeURIComponent(storeName)}`
}

export function buildProductUrl(slug: string): string {
  return `/shop/${slug}`
}

// ── REDUCED MOTION CHECK ──────────────────────────────────────

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ── DEBOUNCE ──────────────────────────────────────────────────

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// ── CLAMP ─────────────────────────────────────────────────────

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// ── LERP ──────────────────────────────────────────────────────

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}
