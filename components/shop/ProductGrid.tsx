'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ProductCard, FeaturedProductCard } from '@/components/shop/ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { QuickViewModal } from '@/components/shop/QuickViewModal'
import type { Dress } from '@/types'

// ── TYPES ─────────────────────────────────────────────────────

interface ProductGridProps {
  dresses: Dress[]
  loading?: boolean
  columns?: 2 | 3 | 4
  showFeatured?: boolean
  className?: string
  emptyMessage?: string
  infiniteScroll?: boolean
  pageSize?: number
}

// ── COMPONENT ─────────────────────────────────────────────────

export function ProductGrid({
  dresses,
  loading = false,
  columns = 3,
  showFeatured = true,
  className,
  emptyMessage = 'No styles found for your filters.',
  infiniteScroll = false,
  pageSize = 12,
}: ProductGridProps) {
  const [quickViewDress, setQuickViewDress] = useState<Dress | null>(null)
  const [visibleCount, setVisibleCount] = useState(pageSize)

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + pageSize, dresses.length))
  }, [pageSize, dresses.length])

  const visible = useMemo(
    () => dresses.slice(0, visibleCount),
    [dresses, visibleCount]
  )

  const colClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }[columns]

  if (loading) {
    return <ProductGridSkeleton count={columns * 2} className={className} />
  }

  if (dresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="font-serif text-2xl text-[var(--white-soft)]/30">
          {emptyMessage}
        </p>
        <p className="text-sm text-[var(--white-soft)]/20 font-sans">
          Try adjusting your filters or browse all styles.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Grid */}
      <motion.div
        className={cn(
          'grid gap-6',
          colClass,
          showFeatured && 'auto-rows-auto',
          className
        )}
        layout
      >
        <AnimatePresence mode="popLayout">
          {visible.map((dress, i) => {
            // Every 7th card (0-indexed: 6, 13, 20…) is a featured editorial card
            const isFeatured = showFeatured && columns === 3 && (i + 1) % 7 === 0

            return isFeatured ? (
              <motion.div
                key={dress.id}
                layout
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.55, delay: (i % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="row-span-2"
              >
                <FeaturedProductCard
                  dress={dress}
                  onQuickView={setQuickViewDress}
                />
              </motion.div>
            ) : (
              <motion.div
                key={dress.id}
                layout
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.55, delay: (i % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard
                  dress={dress}
                  priority={i < 6}
                  onQuickView={setQuickViewDress}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {/* Load more */}
      {infiniteScroll && visibleCount < dresses.length && (
        <div className="flex justify-center mt-12">
          <button
            onClick={loadMore}
            className={cn(
              'h-12 px-10 rounded border border-white/20',
              'text-xs font-sans font-semibold tracking-[0.2em] uppercase',
              'text-[var(--white-soft)]/70 hover:text-[var(--white-soft)] hover:border-gold/40',
              'transition-all duration-200'
            )}
            style={{ cursor: 'none' }}
          >
            Load More Styles ({dresses.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        dress={quickViewDress}
        isOpen={!!quickViewDress}
        onClose={() => setQuickViewDress(null)}
      />
    </>
  )
}

export default ProductGrid
