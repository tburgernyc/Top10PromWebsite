import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }

    const supabase = supabaseAdmin

    // Upsert subscriber (ignore duplicate)
    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({ email, subscribed_at: new Date().toISOString() }, { onConflict: 'email', ignoreDuplicates: true })

    if (error) {
      console.error('Newsletter DB error:', error)
      return NextResponse.json({ error: 'Failed to subscribe.' }, { status: 500 })
    }

    // Send welcome email
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@top10prom.com'
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Welcome to Top 10 Prom ✦',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #0A0A14; color: #F8F4F0; padding: 40px;">
          <h1 style="color: #D4AF72; font-size: 28px; margin-bottom: 8px;">You're on the list.</h1>
          <p style="color: #aaa; line-height: 1.6; margin-bottom: 24px;">
            Thank you for subscribing to Top 10 Prom. You'll be the first to hear about new arrivals, exclusive offers, and style inspiration.
          </p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://top10prom.com'}/shop" style="display: inline-block; background: #D4AF72; color: #0A0A14; padding: 14px 28px; text-decoration: none; font-weight: 700; letter-spacing: 0.1em; font-size: 12px; text-transform: uppercase;">
            Shop Now
          </a>
          <p style="color: #555; font-size: 11px; margin-top: 32px;">
            You can unsubscribe at any time. · Top 10 Prom · 800-3 Fairview Rd, Asheville, NC 28803
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
