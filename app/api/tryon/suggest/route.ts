import { NextRequest, NextResponse } from 'next/server'
import { anthropic } from '@/lib/claude'
import { aiRatelimit, getClientIp } from '@/lib/ratelimit'

const MAX_FIELD = 200
const MAX_SHORT = 100

/** Sanitize a user-supplied string: trim to max length, strip HTML injection chars. */
function safeStr(val: unknown, max = MAX_FIELD): string {
  if (typeof val !== 'string') return ''
  return val.slice(0, max).replace(/[<>"'`]/g, '')
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting — 10 requests/IP/hour
    const ip = getClientIp(req)
    const { success, reset } = await aiRatelimit.limit(ip)
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)) } }
      )
    }

    const body = await req.json()

    const dressName = safeStr(body.dressName, MAX_SHORT)
    const designer = safeStr(body.designer, MAX_SHORT)
    const color = safeStr(body.color, MAX_SHORT)
    const occasion = safeStr(body.occasion, MAX_SHORT)
    const userDescription = safeStr(body.userDescription, MAX_FIELD)

    if (!dressName) {
      return NextResponse.json({ error: 'Dress name is required.' }, { status: 400 })
    }

    const prompt = `You are Aria, the Top 10 Prom style concierge. A customer is using the virtual try-on and has selected "${dressName}" by ${designer || 'the designer'} in ${color || 'their chosen color'} for ${occasion || 'a formal occasion'}.

${userDescription ? `The customer described themselves as: "${userDescription}"` : ''}

Provide warm, encouraging, specific style advice in exactly 3 sentences:
1. A genuine compliment about their choice and why it works for them
2. One specific styling tip (accessories, hair, makeup, or shoes) that would elevate the look
3. A practical next step — either to book a fitting appointment or add to their wishlist

Keep the tone warm, confident, and aspirational. Speak directly to them as "you".`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    })

    const tip = message.content[0].type === 'text' ? message.content[0].text : ''

    return NextResponse.json({ tip })
  } catch (error) {
    console.error('Tryon suggest error:', error)
    return NextResponse.json({ error: 'Failed to generate style tip.' }, { status: 500 })
  }
}
