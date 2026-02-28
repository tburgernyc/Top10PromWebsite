import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { DRESSES } from '@/lib/mock-data'

export async function POST(req: NextRequest) {
  try {
    const { items, customerEmail } = await req.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart.' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    // Build Stripe line items — prices are looked up server-side from trusted catalog.
    // The client sends dress_id; we never trust the client-supplied price.
    const lineItems = items.map((item: {
      dress_id: string
      name?: string
      quantity: number
      color?: string
      size?: string
    }) => {
      const dress = DRESSES.find(d => d.id === item.dress_id)
      if (!dress) {
        throw new Error(`Unknown product: ${item.dress_id}`)
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: dress.name,
            ...(item.color || item.size
              ? { description: [item.color, item.size ? `Size ${item.size}` : null].filter(Boolean).join(' · ') }
              : {}),
            images: [`https://picsum.photos/seed/${dress.id}/400/533`],
          },
          unit_amount: Math.round(dress.price * 100), // cents — server-side price only
        },
        quantity: item.quantity,
      }
    })

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: customerEmail ?? undefined,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 1999, currency: 'usd' },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 3 },
            },
          },
        },
      ],
      payment_method_types: ['card', 'link'],
      success_url: `${siteUrl}/checkout/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
      metadata: {
        source: 'top10prom-web',
      },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error('Checkout route error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session.' }, { status: 500 })
  }
}
