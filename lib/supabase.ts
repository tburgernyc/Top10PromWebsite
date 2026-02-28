// ============================================================
// TOP 10 PROM — Supabase Client + Auth Helpers
// Uses actual environment variables from .env
// ============================================================

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient as createSSRServerClient } from '@supabase/ssr'
import type { Profile } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// ── BROWSER CLIENT (Client Components) ───────────────────────

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// ── SERVER CLIENT (Server Components / API Routes) ────────────

export function createServerActionClient(cookieStore: {
  get: (name: string) => { value: string } | undefined
  set: (name: string, value: string, options?: object) => void
  delete: (name: string) => void
}) {
  return createSSRServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options?: object) {
        cookieStore.set(name, value, options)
      },
      remove(name: string) {
        cookieStore.delete(name)
      },
    },
  })
}

// ── SERVICE ROLE CLIENT (Admin operations, webhooks) ─────────

export const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// ── AUTH HELPERS ──────────────────────────────────────────────

/**
 * Get the current user session (browser-side)
 */
export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

/**
 * Get the current user's full profile from the profiles table
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    phone: data.phone,
    dateOfBirth: data.date_of_birth,
    role: data.role,
    shoppingIntent: data.shopping_intent,
    loyaltyPoints: data.loyalty_points ?? 0,
    styleArchetype: data.style_archetype,
    preferredColors: data.preferred_colors ?? [],
    preferredOccasions: data.preferred_occasions ?? [],
    avatarUrl: data.avatar_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

/**
 * Check if the current user has vendor role
 */
export async function isVendor(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  const profile = await getUserProfile(user.id)
  return profile?.role === 'vendor'
}

/**
 * Check if the current user has admin role
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  const profile = await getUserProfile(user.id)
  return profile?.role === 'admin'
}

// ── PROFILE HELPERS ───────────────────────────────────────────

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const supabase = createClient()
  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: updates.firstName,
      last_name: updates.lastName,
      phone: updates.phone,
      date_of_birth: updates.dateOfBirth,
      shopping_intent: updates.shoppingIntent,
      style_archetype: updates.styleArchetype,
      preferred_colors: updates.preferredColors,
      preferred_occasions: updates.preferredOccasions,
      avatar_url: updates.avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  return { error }
}

// ── DRESS HELPERS ─────────────────────────────────────────────

export async function getDressesFromDB(filters?: {
  occasion?: string
  silhouette?: string
  designer?: string
  priceMin?: number
  priceMax?: number
}) {
  const supabase = createClient()
  let query = supabase.from('dresses').select('*')

  if (filters?.designer) {
    query = query.eq('designer', filters.designer)
  }
  if (filters?.silhouette) {
    query = query.eq('silhouette', filters.silhouette)
  }
  if (filters?.priceMin !== undefined) {
    query = query.gte('price', filters.priceMin)
  }
  if (filters?.priceMax !== undefined) {
    query = query.lte('price', filters.priceMax)
  }
  if (filters?.occasion) {
    query = query.contains('occasions', [filters.occasion])
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  return { data, error }
}

// ── WISHLIST HELPERS ──────────────────────────────────────────

export async function getWishlist(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('*, dresses(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function addToWishlist(userId: string, dressId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('wishlist_items')
    .upsert({ user_id: userId, dress_id: dressId }, { onConflict: 'user_id,dress_id' })
    .select()

  return { data, error }
}

export async function removeFromWishlist(userId: string, dressId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('user_id', userId)
    .eq('dress_id', dressId)

  return { error }
}

export async function isInWishlist(userId: string, dressId: string): Promise<boolean> {
  const supabase = createClient()
  const { data } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('user_id', userId)
    .eq('dress_id', dressId)
    .single()

  return !!data
}

// ── ORDER HELPERS ─────────────────────────────────────────────

export async function getOrders(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getOrderById(orderId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  return { data, error }
}

export async function createOrder(orderData: {
  customerId?: string
  vendorId?: string
  stripePaymentIntentId: string
  items: object[]
  subtotal: number
  shippingCost: number
  total: number
  shippingAddress: object
}) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert({
      customer_id: orderData.customerId,
      vendor_id: orderData.vendorId,
      stripe_payment_intent_id: orderData.stripePaymentIntentId,
      status: 'processing',
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping_cost: orderData.shippingCost,
      total: orderData.total,
      shipping_address: orderData.shippingAddress,
    })
    .select()
    .single()

  return { data, error }
}

// ── APPOINTMENT HELPERS ───────────────────────────────────────

export async function getAppointments(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('customer_id', userId)
    .order('appointment_date', { ascending: true })

  return { data, error }
}

export async function createAppointment(appointmentData: {
  customerId?: string
  storeId: number
  storeName: string
  occasion: string
  appointmentDate: string
  appointmentTime: string
  partySize: number
  specialRequests?: string
  howHeard?: string
  firstName: string
  lastName: string
  email: string
  phone: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      customer_id: appointmentData.customerId,
      store_id: appointmentData.storeId,
      store_name: appointmentData.storeName,
      occasion: appointmentData.occasion,
      appointment_date: appointmentData.appointmentDate,
      appointment_time: appointmentData.appointmentTime,
      party_size: appointmentData.partySize,
      special_requests: appointmentData.specialRequests,
      how_heard: appointmentData.howHeard,
      status: 'confirmed',
    })
    .select()
    .single()

  return { data, error }
}

// ── NEWSLETTER ────────────────────────────────────────────────

export async function addNewsletterSubscriber(email: string) {
  const { data, error } = await supabaseAdmin
    .from('newsletter_subscribers')
    .upsert({ email, is_active: true }, { onConflict: 'email' })
    .select()
    .single()

  return { data, error }
}

export async function checkNewsletterSubscriber(email: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('newsletter_subscribers')
    .select('id, is_active')
    .eq('email', email)
    .single()

  return !!data
}
