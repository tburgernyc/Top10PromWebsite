'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import { CornerBadge } from '@/components/ui/Badge'
import { useCursor } from '@/components/layout/CustomCursor'
import { useWishlist } from '@/components/shop/WishlistContext'
import { useCart } from '@/components/shop/CartContext'
import type { Dress } from '@/types'

// ── WISHLIST BUTTON ───────────────────────────────────────────

function WishlistButton({
  dress,
  className,
}: {
  dress: Dress
  className?: string
}) {
  const { isWishlisted, toggleItem } = useWishlist()
  const { setCursorState, resetCursor } = useCursor()
  const wishlisted = isWishlisted(dress.id)

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleItem(dress)
      }}
      className={cn(
        'w-8 h-8 flex items-center justify-center rounded-full',
        'bg-[var(--bg-primary)]/70 backdrop-blur-sm border border-white/10',
        'transition-all duration-200',
        wishlisted
          ? 'text-[var(--blush)] border-blush/40'
          : 'text-[var(--white-soft)]/60 hover:text-[var(--blush)] hover:border-blush/30',
        className
      )}
      style={{ cursor: 'none' }}
      onMouseEnter={() => setCursorState('hover')}
      onMouseLeave={resetCursor}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={wishlisted ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  )
}

// ── COLOR DOTS ────────────────────────────────────────────────

function ColorDots({
  colors,
  selected,
  onSelect,
}: {
  colors: Dress['colors']
  selected: number
  onSelect: (i: number) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      {colors.slice(0, 6).map((color, i) => (
        <button
          key={color.name}
          onClick={(e) => {
            e.preventDefault()
            onSelect(i)
          }}
          className={cn(
            'w-4 h-4 rounded-full border transition-all duration-150',
            selected === i
              ? 'border-[var(--gold)] scale-110'
              : 'border-white/20 hover:border-white/50'
          )}
          style={{ backgroundColor: color.hex, cursor: 'none' }}
          title={color.name}
          aria-label={color.name}
        />
      ))}
      {colors.length > 6 && (
        <span className="text-[10px] text-[var(--white-soft)]/40 font-sans">
          +{colors.length - 6}
        </span>
      )}
    </div>
  )
}

// ── PRODUCT CARD ──────────────────────────────────────────────

interface ProductCardProps {
  dress: Dress
  priority?: boolean
  featured?: boolean
  onQuickView?: (dress: Dress) => void
  className?: string
}

export function ProductCard({
  dress,
  priority = false,
  featured = false,
  onQuickView,
  className,
}: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const { setCursorState, resetCursor } = useCursor()
  const { addItem } = useCart()

  const selectedColor = dress.colors[selectedColorIndex]
  const imageUrl =
    dress.imageUrls[selectedColorIndex] ??
    dress.imageUrls[0] ??
    `https://picsum.photos/seed/${dress.id}/600/800`

  // Determine badge
  const badge = dress.isNew
    ? 'new'
    : dress.isSale
    ? 'sale'
    : dress.isExclusive
    ? 'exclusive'
    : dress.isFeatured
    ? 'featured'
    : null

  return (
    <div
      className={cn(
        'group relative flex flex-col gap-3',
        featured && 'row-span-2',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <Link
        href={`/shop/${dress.slug}`}
        className="relative block overflow-hidden rounded-xl bg-[var(--glass-light)]"
        style={{ aspectRatio: featured ? '3/5' : '3/4', cursor: 'none' }}
        onMouseEnter={() => setCursorState('view')}
        onMouseLeave={resetCursor}
      >
        {/* Main image */}
        <Image
          src={imageUrl}
          alt={`${dress.name} by ${dress.designer}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={cn(
            'object-cover transition-transform duration-700 ease-out',
            isHovered && 'scale-105'
          )}
          priority={priority}
        />

        {/* Gold border glow on hover */}
        <div
          className={cn(
            'absolute inset-0 rounded-xl border transition-all duration-500',
            isHovered ? 'border-gold/40 shadow-[inset_0_0_40px_rgba(212,175,114,0.06)]' : 'border-transparent'
          )}
        />

        {/* Corner badge */}
        {badge && <CornerBadge variant={badge} />}

        {/* Wishlist heart */}
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton dress={dress} />
        </div>

        {/* Hover overlay: QUICK VIEW + TRY ON */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-3 bottom-3 flex gap-2 z-10"
            >
              {onQuickView && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onQuickView(dress)
                  }}
                  className={cn(
                    'flex-1 h-9 rounded',
                    'bg-[var(--bg-primary)]/85 backdrop-blur-sm',
                    'border border-white/20',
                    'text-[10px] font-sans font-semibold tracking-[0.18em] uppercase',
                    'text-[var(--white-soft)] hover:text-[var(--gold)] hover:border-gold/40',
                    'transition-all duration-200'
                  )}
                  style={{ cursor: 'none' }}
                >
                  Quick View
                </button>
              )}
              <Link
                href={`/virtual-try-on?dress=${dress.id}`}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  'flex-1 h-9 flex items-center justify-center rounded',
                  'bg-[var(--glass-blush)] backdrop-blur-sm',
                  'border border-blush/30',
                  'text-[10px] font-sans font-semibold tracking-[0.18em] uppercase',
                  'text-[var(--blush)] hover:bg-blush/20',
                  'transition-all duration-200'
                )}
                style={{ cursor: 'none' }}
              >
                Try On ✦
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      {/* Card info */}
      <div className="flex flex-col gap-1.5">
        {/* Designer */}
        <p className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[var(--gold)]/70">
          {dress.designer}
        </p>

        {/* Name */}
        <Link
          href={`/shop/${dress.slug}`}
          className="font-serif text-base text-[var(--white-soft)] hover:text-[var(--gold)] transition-colors line-clamp-2 leading-snug"
          style={{ cursor: 'none' }}
        >
          {dress.name}
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          {dress.isSale ? (
            <>
              <span className="font-serif text-sm text-[var(--blush)]">
                {formatPrice(Math.round(dress.price * 0.8))}
              </span>
              <span className="text-xs text-[var(--white-soft)]/30 line-through">
                {formatPrice(dress.price)}
              </span>
            </>
          ) : (
            <span className="font-serif text-sm text-[var(--white-soft)]/80">
              {formatPrice(dress.price)}
            </span>
          )}
        </div>

        {/* Color dots */}
        {dress.colors.length > 0 && (
          <ColorDots
            colors={dress.colors}
            selected={selectedColorIndex}
            onSelect={setSelectedColorIndex}
          />
        )}
      </div>
    </div>
  )
}

// ── FEATURED EDITORIAL CARD (2× height, every 7th) ───────────

export function FeaturedProductCard({
  dress,
  onQuickView,
  className,
}: Omit<ProductCardProps, 'featured' | 'priority'>) {
  return (
    <div className={cn('relative col-span-1 row-span-2', className)}>
      <ProductCard
        dress={dress}
        featured
        onQuickView={onQuickView}
        className="h-full"
      />
      {/* Editorial label */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <span className="text-[9px] font-sans font-bold tracking-[0.3em] uppercase text-[var(--gold)] bg-[var(--bg-primary)]/70 backdrop-blur-sm px-2 py-1 rounded-full border border-gold/30">
          Featured Look
        </span>
      </div>
    </div>
  )
}

export default ProductCard
