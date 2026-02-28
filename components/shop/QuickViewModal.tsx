'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { GoldButton, BlushButton, GhostButton } from '@/components/ui/Button'
import { useCart } from '@/components/shop/CartContext'
import { useWishlist } from '@/components/shop/WishlistContext'
import { useToast } from '@/components/ui/Toast'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Dress } from '@/types'

// ── PROPS ─────────────────────────────────────────────────────

interface QuickViewModalProps {
  dress: Dress | null
  isOpen: boolean
  onClose: () => void
}

// ── COMPONENT ─────────────────────────────────────────────────

export function QuickViewModal({ dress, isOpen, onClose }: QuickViewModalProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const { addItem } = useCart()
  const { toggleItem, isWishlisted } = useWishlist()
  const { success, error } = useToast()

  const handleAddToCart = useCallback(() => {
    if (!dress) return
    if (!selectedSize) {
      error('Please select a size.')
      return
    }
    const color = dress.colors[selectedColorIndex]
    addItem(dress, 1, color?.name, selectedSize)
    success(`${dress.name} added to your cart.`, {
      action: { label: 'View Cart', onClick: () => {} },
    })
    onClose()
  }, [dress, selectedSize, selectedColorIndex, addItem, success, error, onClose])

  if (!dress) return null

  const selectedColor = dress.colors[selectedColorIndex]
  const images = dress.imageUrls.length ? dress.imageUrls : [`https://picsum.photos/seed/${dress.id}/600/800`]

  const wishlisted = isWishlisted(dress.id)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={`Quick View — ${dress.name}`}
    >
      <div className="flex flex-col md:flex-row">
        {/* ── Images ─────────────────────────────────────── */}
        <div className="md:w-1/2 flex flex-col gap-3 p-6 pr-3">
          {/* Main image */}
          <div
            className="relative w-full rounded-2xl overflow-hidden bg-[var(--glass-light)]"
            style={{ aspectRatio: '3/4' }}
          >
            <Image
              src={images[mainImageIndex] ?? `https://picsum.photos/seed/${dress.id}/600/800`}
              alt={dress.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImageIndex(i)}
                  className={cn(
                    'flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all',
                    i === mainImageIndex ? 'border-gold/60' : 'border-transparent hover:border-white/20'
                  )}
                  style={{ cursor: 'none' }}
                >
                  <Image
                    src={img}
                    alt={`${dress.name} view ${i + 1}`}
                    width={64}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ───────────────────────────────────────── */}
        <div className="md:w-1/2 flex flex-col gap-5 p-6 pl-3 overflow-y-auto">
          {/* Designer + name */}
          <div>
            <p className="text-[10px] font-sans font-semibold tracking-[0.25em] uppercase text-[var(--gold)] mb-1">
              {dress.designer}
            </p>
            <h2 className="font-serif text-2xl text-[var(--white-soft)] leading-tight">
              {dress.name}
            </h2>
            {dress.sku && (
              <p className="text-xs text-[var(--white-soft)]/30 font-sans mt-1">
                Style #{dress.sku}
              </p>
            )}
          </div>

          {/* Price + badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-baseline gap-2">
              {dress.isSale ? (
                <>
                  <span className="font-serif text-2xl text-[var(--blush)]">
                    {formatPrice(Math.round(dress.price * 0.8))}
                  </span>
                  <span className="text-sm text-[var(--white-soft)]/30 line-through">
                    {formatPrice(dress.price)}
                  </span>
                </>
              ) : (
                <span className="font-serif text-2xl text-[var(--white-soft)]">
                  {formatPrice(dress.price)}
                </span>
              )}
            </div>
            {dress.isNew && <Badge variant="new">New</Badge>}
            {dress.isSale && <Badge variant="sale">Sale</Badge>}
            {dress.isExclusive && <Badge variant="exclusive">Exclusive</Badge>}
          </div>

          {/* Description */}
          {dress.description && (
            <p className="text-sm text-[var(--white-soft)]/60 font-sans leading-relaxed">
              {dress.description}
            </p>
          )}

          {/* Color selector */}
          {dress.colors.length > 0 && (
            <div>
              <p className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[var(--white-soft)]/50 mb-2.5">
                Color —{' '}
                <span className="text-[var(--white-soft)]/80 normal-case tracking-normal">
                  {selectedColor?.name}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {dress.colors.map((color, i) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColorIndex(i)
                      setMainImageIndex(0)
                    }}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-all duration-150',
                      selectedColorIndex === i
                        ? 'border-[var(--gold)] scale-110 shadow-[0_0_0_2px_rgba(212,175,114,0.2)]'
                        : 'border-white/20 hover:border-white/50'
                    )}
                    style={{ backgroundColor: color.hex, cursor: 'none' }}
                    title={color.name}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {dress.sizes && dress.sizes.length > 0 && (
            <div>
              <p className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[var(--white-soft)]/50 mb-2.5">
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {dress.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'w-10 h-10 rounded-lg border text-xs font-sans font-semibold transition-all duration-150',
                      selectedSize === size
                        ? 'border-gold/60 bg-[var(--glass-gold)] text-[var(--gold)]'
                        : 'border-white/10 text-[var(--white-soft)]/60 hover:border-white/25 hover:text-[var(--white-soft)]'
                    )}
                    style={{ cursor: 'none' }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 mt-auto pt-2">
            <GoldButton onClick={handleAddToCart} fullWidth>
              Add to Cart
            </GoldButton>
            <div className="flex gap-3">
              <BlushButton
                onClick={() => toggleItem(dress)}
                fullWidth
              >
                {wishlisted ? '♥ Saved' : '♡ Wishlist'}
              </BlushButton>
              <GhostButton onClick={onClose} fullWidth>
                <Link
                  href={`/shop/${dress.slug}`}
                  style={{ cursor: 'none' }}
                >
                  View Full Details
                </Link>
              </GhostButton>
            </div>
            <Link
              href={`/virtual-try-on?dress=${dress.id}`}
              className="w-full flex items-center justify-center h-10 text-xs font-sans font-semibold tracking-[0.15em] uppercase text-[var(--blush)]/70 hover:text-[var(--blush)] transition-colors"
              style={{ cursor: 'none' }}
            >
              ✦ Try On Virtually
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default QuickViewModal
