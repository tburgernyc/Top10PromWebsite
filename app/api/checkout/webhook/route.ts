import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'

// Stripe requires the raw body for signature verification
export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = supabaseAdmin

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const customerEmail = session.customer_details?.email
      const amountTotal = (session.amount_total ?? 0) / 100
      const shippingAmount = (session.shipping_cost?.amount_total ?? 0) / 100
      const subtotal = amountTotal - shippingAmount

      if (customerEmail) {
        // Look up user by email to associate the order
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', customerEmail)
          .single()

        const { error } = await supabase.from('orders').insert({
          customer_id: profile?.id ?? null,                          // matches schema column name
          stripe_payment_intent_id: session.payment_intent as string, // matches schema column name
          status: 'confirmed',                                        // valid enum value from schema
          items: [],                                                  // populated by order fulfillment
          subtotal,
          shipping_cost: shippingAmount,
          total: amountTotal,
          shipping_address: session.shipping_details?.address ?? null,
        })

        if (error) {
          console.error('Failed to create order record:', error.code, error.message)
        }
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.error('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error?.message)
      break
    }

    case 'checkout.session.expired': {
      // No-op — session expired, nothing to update
      break
    }

    default:
      // Unhandled event type — log and return 200
      console.log(`Unhandled Stripe event: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
