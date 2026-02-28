'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartState, CartItem, Dress } from '@/types'

// ── ZUSTAND STORE ─────────────────────────────────────────────

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // ── OPEN / CLOSE ───────────────────────────────────────

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      // ── ADD ────────────────────────────────────────────────

      addItem: (
        dress: Dress,
        quantity = 1,
        selectedColor?: string,
        selectedSize?: string
      ) => {
        const { items } = get()

        const existingIndex = items.findIndex(
          (i) =>
            i.dress_id === dress.id &&
            i.selected_color === selectedColor &&
            i.selected_size === selectedSize
        )

        if (existingIndex >= 0) {
          const updated = [...items]
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          }
          set({ items: updated, isOpen: true })
          return
        }

        const item: CartItem = {
          id: `cart_${dress.id}_${selectedColor ?? 'default'}_${selectedSize ?? 'default'}_${Date.now()}`,
          dress_id: dress.id,
          dress,
          quantity,
          selected_color: selectedColor,
          selected_size: selectedSize,
          price: dress.price,
        }

        set({ items: [item, ...items], isOpen: true })
      },

      // ── REMOVE ─────────────────────────────────────────────

      removeItem: (itemId: string) => {
        set((s) => ({
          items: s.items.filter((i) => i.id !== itemId),
        }))
      },

      // ── UPDATE QUANTITY ────────────────────────────────────

      updateQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
          return
        }
        set((s) => ({
          items: s.items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        }))
      },

      // ── CLEAR ──────────────────────────────────────────────

      clearCart: () => set({ items: [] }),

      // ── COMPUTED ───────────────────────────────────────────

      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      get subtotal() {
        return get().items.reduce(
          (sum, i) => sum + (i.price ?? 0) * i.quantity,
          0
        )
      },
    }),
    {
      name: 'top10prom-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

// ── CONVENIENCE HOOK ──────────────────────────────────────────

export function useCart() {
  const store = useCartStore()
  const itemCount = store.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = store.items.reduce(
    (sum, i) => sum + (i.price ?? 0) * i.quantity,
    0
  )
  return { ...store, itemCount, subtotal }
}

export default useCartStore
