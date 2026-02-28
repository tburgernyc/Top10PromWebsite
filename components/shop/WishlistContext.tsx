'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WishlistState, WishlistItem, Dress } from '@/types'

// ── ZUSTAND STORE ─────────────────────────────────────────────

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (dress: Dress, colorId?: string) => {
        const { items } = get()
        const exists = items.some(
          (i) => i.dress_id === dress.id && i.color_id === colorId
        )
        if (exists) return

        const item: WishlistItem = {
          id: `wish_${dress.id}_${colorId ?? 'default'}_${Date.now()}`,
          dress_id: dress.id,
          color_id: colorId,
          dress,
          added_at: new Date().toISOString(),
        }

        set({ items: [item, ...items] })
      },

      removeItem: (dressId: string, colorId?: string) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.dress_id === dressId && i.color_id === colorId)
          ),
        }))
      },

      toggleItem: (dress: Dress, colorId?: string) => {
        const { items, addItem, removeItem } = get()
        const exists = items.some(
          (i) => i.dress_id === dress.id && i.color_id === colorId
        )
        if (exists) {
          removeItem(dress.id, colorId)
        } else {
          addItem(dress, colorId)
        }
      },

      isWishlisted: (dressId: string, colorId?: string) => {
        return get().items.some(
          (i) => i.dress_id === dressId && i.color_id === colorId
        )
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'top10prom-wishlist',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

// ── CONVENIENCE HOOK ──────────────────────────────────────────

export function useWishlist() {
  return useWishlistStore()
}

export default useWishlistStore
