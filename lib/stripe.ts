// ============================================================
// TOP 10 PROM — Stripe Client + Checkout Helpers
// Uses actual STRIPE_SECRET_KEY from .env
// ============================================================

import Stripe from 'stripe'
import type { CartItem, ShippingMethod, ShippingOption } from '@/types'

// ── STRIPE SERVER CLIENT ──────────────────────────────────────

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// ── SHIPPING OPTIONS ──────────────────────────────────────────

export const shippingOptions: ShippingOption[] = [
  {
    id: 'standard',
    label: 'Standard Shipping',
    description: '5–7 business days',
    price: 0,
    days: '5–7',
  },
  {
    id: 'express',
    label: 'Express Shipping',
    description: '2–3 business days',
    price: 12.99,
    days: '2–3',
  },
  {
    id: 'overnight',
    label: 'Overnight Shipping',
    description: 'Next business day',
    price: 24.99,
    days: '1',
  },
]

// ── PRICE FORMATTING ──────────────────────────────────────────

/**
 * Convert dollar amount to Stripe's smallest currency unit (cents)
 */
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100)
}

/**
 * Convert Stripe cents back to dollar amount
 */
export function formatAmountFromStripe(amount: number): number {
  return amount / 100
}

// ── CALCULATE SHIPPING ────────────────────────────────────────

export function calculateShipping(subtotal: number, method: ShippingMethod): number {
  if (method === 'standard' && subtotal >= 150) return 0
  const option = shippingOptions.find((o) => o.id === method)
  return option?.price ?? 0
}

export function calculateTax(subtotal: number): number {
  // Simplified tax calculation — 8.5% rate
  return Math.round(subtotal * 0.085 * 100) / 100
}

// ── CREATE PAYMENT INTENT ─────────────────────────────────────

export interface CreatePaymentIntentParams {
  cartItems: CartItem[]
  shippingMethod: ShippingMethod
  customerId?: string
  customerEmail?: string
}

export async function createPaymentIntent(params: CreatePaymentIntentParams) {
  const subtotal = params.cartItems.reduce(
    (sum, item) => sum + item.dress.price * item.quantity,
    0
  )
  const shippingCost = calculateShipping(subtotal, params.shippingMethod)
  const tax = calculateTax(subtotal)
  const total = subtotal + shippingCost + tax

  const lineItems = params.cartItems.map((item) => ({
    dressId: item.dress.id,
    dressName: item.dress.name,
    designer: item.dress.designer,
    color: item.selected_color,
    size: item.selected_size,
    quantity: item.quantity,
    price: item.dress.price,
    imageUrl: item.dress.imageUrls[0],
  }))

  const paymentIntent = await stripe.paymentIntents.create({
    amount: formatAmountForStripe(total),
    currency: 'usd',
    automatic_payment_methods: { enabled: true },
    metadata: {
      customer_id: params.customerId ?? '',
      customer_email: params.customerEmail ?? '',
      shipping_method: params.shippingMethod,
      subtotal: subtotal.toFixed(2),
      shipping_cost: shippingCost.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      line_items: JSON.stringify(lineItems),
    },
    description: `Top 10 Prom order — ${params.cartItems.length} item(s)`,
    receipt_email: params.customerEmail,
  })

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
    breakdown: {
      subtotal,
      shippingCost,
      tax,
      total,
    },
  }
}

// ── RETRIEVE PAYMENT INTENT ───────────────────────────────────

export async function retrievePaymentIntent(paymentIntentId: string) {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  return paymentIntent
}

// ── CONSTRUCT WEBHOOK EVENT ───────────────────────────────────

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, stripeWebhookSecret)
}
