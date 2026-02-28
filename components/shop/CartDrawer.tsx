'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/components/shop/CartContext'
import { GoldButton, GhostButton } from '@/components/ui/Button'
import { useCursor } from '@/components/layout/CustomCursor'
import type { CartItem } from '@/types'

// ── CART ITEM ROW ─────────────────────────────────────────────

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart()
  const { setCursorState, resetCursor } = useCursor()

  const imageUrl =
    item.dress?.imageUrls?.[0] ??
    `https://picsum.photos/seed/${item.dress_id}/200/267`

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4 py-4 border-b border-white/8"
    >
      {/* Image */}
      <div className="relative w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--glass-light)]">
        <Image
          src={imageUrl}
          alt={item.dress?.name ?? 'Product'}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        <div className="flex justify-between gap-2">
          <Link
            href={`/shop/${item.dress?.slug ?? ''}`}
            className="font-serif text-sm text-[var(--white-soft)] hover:text-[var(--gold)] transition-colors line-clamp-2 leading-snug"
            style={{ cursor: 'none' }}
          >
            {item.dress?.name}
          </Link>
          <button
            onClick={() => removeItem(item.id)}
            className="flex-shrink-0 text-[var(--white-soft)]/30 hover:text-red-400 transition-colors mt-0.5"
            style={{ cursor: 'none' }}
            onMouseEnter={() => setCursorState('hover')}
            onMouseLeave={resetCursor}
            aria-label="Remove item"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Designer */}
        <p className="text-[10px] font-sans font-semibold tracking-[0.15em] uppercase text-[var(--gold)]/60">
          {item.dress?.designer}
        </p>

        {/* Color + Size */}
        <div className="flex gap-3">
          {item.selected_color && (
            <span className="text-xs text-[var(--white-soft)]/40 font-sans">
              {item.selected_color}
            </span>
          )}
          {item.selected_size && (
            <span className="text-xs text-[var(--white-soft)]/40 font-sans">
              Size {item.selected_size}
            </span>
          )}
        </div>

        {/* Qty + price */}
        <div className="flex items-center justify-between mt-auto">
          {/* Quantity stepper */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-[var(--glass-light)] border border-white/10 text-[var(--white-soft)]/60 hover:text-[var(--white-soft)] hover:border-white/20 transition-all text-xs"
              style={{ cursor: 'none' }}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="text-sm font-sans w-4 text-center text-[var(--white-soft)]">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-[var(--glass-light)] border border-white/10 text-[var(--white-soft)]/60 hover:text-[var(--white-soft)] hover:border-white/20 transition-all text-xs"
              style={{ cursor: 'none' }}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <span className="font-serif text-sm text-[var(--white-soft)]">
            {formatPrice((item.price ?? 0) * item.quantity)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ── CART DRAWER ────────────────────────────────────────────────

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, itemCount } = useCart()
  const { setCursorState, resetCursor } = useCursor()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] bg-[var(--bg-primary)]/70 backdrop-blur-md"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'fixed top-0 right-0 bottom-0 z-[91] w-full max-w-md',
              'bg-[var(--bg-elevated)] border-l border-white/10',
              'flex flex-col'
            )}
            role="dialog"
            aria-label="Shopping cart"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-xl text-[var(--white-soft)]">
                  Your Cart
                </h2>
                {itemCount > 0 && (
                  <span className="text-xs font-sans font-semibold px-2 py-0.5 rounded-full bg-[var(--glass-gold)] text-[var(--gold)] border border-gold/30">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-[var(--white-soft)]/60 hover:text-[var(--white-soft)] transition-colors"
                style={{ cursor: 'none' }}
                onMouseEnter={() => setCursorState('hover')}
                onMouseLeave={resetCursor}
                aria-label="Close cart"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[var(--glass-light)] text-[var(--white-soft)]/20">
                    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-serif text-lg text-[var(--white-soft)]/40 mb-1">
                      Your cart is empty
                    </p>
                    <p className="text-xs text-[var(--white-soft)]/25 font-sans">
                      Discover your perfect look
                    </p>
                  </div>
                  <GhostButton onClick={closeCart}>
                    <Link href="/shop" style={{ cursor: 'none' }}>
                      Browse Styles
                    </Link>
                  </GhostButton>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer — subtotal + checkout */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/10 flex flex-col gap-4">
                {/* Subtotal */}
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-sans font-semibold tracking-[0.15em] uppercase text-[var(--white-soft)]/50">
                    Subtotal
                  </span>
                  <span className="font-serif text-xl text-[var(--white-soft)]">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <p className="text-xs text-[var(--white-soft)]/30 font-sans text-center">
                  Shipping & taxes calculated at checkout
                </p>

                <GoldButton fullWidth>
                  <Link href="/checkout" onClick={closeCart} style={{ cursor: 'none' }}>
                    Proceed to Checkout
                  </Link>
                </GoldButton>

                <GhostButton fullWidth onClick={closeCart}>
                  <Link href="/shop" style={{ cursor: 'none' }}>
                    Continue Shopping
                  </Link>
                </GhostButton>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer
