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

    const dressDescription = safeStr(body.dressDescription, MAX_FIELD)
    const dressColor = safeStr(body.dressColor, MAX_SHORT)
    const occasion = safeStr(body.occasion, MAX_SHORT)
    const budget = safeStr(body.budget, MAX_SHORT)

    if (!dressDescription && !dressColor) {
      return NextResponse.json({ error: 'Dress description or color is required.' }, { status: 400 })
    }

    // Build a catalog excerpt for context
    const tuxOptions = [
      { name: 'Classic Black Tuxedo', colors: ['black', 'midnight navy'], price: 249 },
      { name: 'Slim-Fit Navy Suit', colors: ['navy', 'cobalt blue'], price: 229 },
      { name: 'White Dinner Jacket', colors: ['white', 'ivory'], price: 219 },
      { name: 'Charcoal Grey Suit', colors: ['charcoal', 'slate grey'], price: 199 },
      { name: 'Velvet Blazer Set', colors: ['burgundy', 'emerald', 'black'], price: 279 },
      { name: 'Powder Blue Tuxedo', colors: ['powder blue', 'sky blue'], price: 239 },
    ]

    const prompt = `You are Aria, the Top 10 Prom tuxedo matching expert. A customer has a ${dressColor || ''} ${dressDescription || 'formal dress'} for ${occasion || 'prom'}.

Available tuxedo options: ${JSON.stringify(tuxOptions)}
${budget ? `Budget preference: ${budget}` : ''}

Recommend exactly 3 tuxedo/suit pairings that would complement this dress. For each recommendation:
1. Name the suit/tux option
2. Explain WHY it pairs well with this dress (color theory, formality matching, contrast)
3. Suggest one specific accessory detail (tie, pocket square, boutonnière) to tie the looks together

Format your response as a JSON array like this:
[
  {
    "name": "Tux Name",
    "reason": "Why it works...",
    "accessory": "Specific accessory suggestion"
  }
]

Only return the JSON array, no other text.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '[]'

    let recommendations = []
    try {
      recommendations = JSON.parse(responseText)
    } catch {
      // Fallback if JSON parse fails
      recommendations = [
        {
          name: 'Classic Black Tuxedo',
          reason: 'A classic black tuxedo is a timeless choice that pairs elegantly with any dress color.',
          accessory: 'Match your tie or bow tie to your date\'s dress color for a coordinated look.',
        },
      ]
    }

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('Tux match error:', error)
    return NextResponse.json({ error: 'Failed to generate recommendations.' }, { status: 500 })
  }
}
