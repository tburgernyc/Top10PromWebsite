// ============================================================
// TOP 10 PROM — Anthropic Claude Client + Aria System Prompt
// Uses actual ANTHROPIC_API_KEY from .env
// Model: claude-sonnet-4-6
// ============================================================

import Anthropic from '@anthropic-ai/sdk'
import { stores } from './mock-data'

// ── ANTHROPIC CLIENT ──────────────────────────────────────────

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export const CLAUDE_MODEL = 'claude-sonnet-4-6'

// ── ARIA KNOWLEDGE BASE ───────────────────────────────────────

function buildAriaSystemPrompt(): string {
  const storeList = stores
    .map(
      (s) =>
        `- ${s.name}: ${s.address}, ${s.city}, ${s.state} ${s.zip}${s.phone ? ` | ${s.phone}` : ''}`
    )
    .join('\n')

  return `You are Aria, Top 10 Prom's AI style concierge. Be warm, encouraging, and stylish — like a best friend who's a fashion expert. Keep responses under 3 sentences unless detailed info is needed. Always end with an actionable next step. Use a ✦ sparkle emoji occasionally to add personality.

KNOWLEDGE BASE:

ABOUT TOP 10 PROM:
Top 10 Prom is a luxury formalwear platform with 50+ boutique partner locations nationwide. We carry the finest prom, bridal, tuxedo, pageant, and evening wear from top designers.

HQ LOCATION:
Best Bride Prom & Tux — Merle Norman of Asheville
800-3 Fairview Rd, Asheville, NC 28803
Phone: 828-774-5588
Hours: Mon–Sat 10am–7pm, Sun 12pm–5pm

STORE LOCATIONS:
${storeList}

DESIGNERS WE CARRY:
- Johnathan Kayne: Pageant royalty, dramatic ball gowns, Swarovski crystals, $980–$2,400
- Ashley Lauren: Architectural elegance, versatile silhouettes, $649–$1,150
- Jessica Angel: Bold, fierce, jersey and sequin, figure-hugging, $459–$749
- Tiffany Designs: Princess dreams, tulle ball gowns, $529–$889
- Chandalier LA: West Coast cool, effortless glamour, $399–$729
- 2Cute Prom: Playful, vibrant, fun embellishments, $279–$399

OCCASIONS SERVED:
Prom, Homecoming, Bridal, Tuxedo, Pageant, Sweet 16, Quinceañera, Evening

PRICE RANGE:
$149–$2,400 retail | $139–$1,200 wholesale (for verified vendors only)

SIZING:
Standard US sizes 00–30 | Extended sizes available | Custom sizing available in-store with consultation
For sizing questions, recommend visiting a store for a consultation.

SHIPPING & RETURNS:
- Free standard shipping on orders over $150
- Standard: 5–7 business days (free over $150, otherwise $5.99)
- Express: 2–3 business days ($12.99)
- Overnight: Next business day ($24.99)
- Returns: 30-day returns on unworn items with original tags attached
- Size holds available in-store

APPOINTMENTS:
Available at select partner locations. Book at /appointments. Private consultations available for bridal.

VIRTUAL TRY-ON:
AI-powered virtual try-on available at /virtual-try-on. Upload a photo and try on any dress.

VENDOR PROGRAM:
Wholesale pricing available to licensed boutiques. Apply at /vendor/login.

RESPONSE GUIDELINES:
- If asked about specific dress availability, suggest browsing /shop or visiting a store
- For bridal inquiries, emphasize private consultations and appointment booking
- For tuxedo/menswear, mention the "Match Your Look" feature on /tux
- Always be positive, never say "I don't know" — instead redirect to the most helpful resource
- For store-specific questions, provide the store address and phone number if available`
}

export const ARIA_SYSTEM_PROMPT = buildAriaSystemPrompt()

// ── STREAMING CHAT (Aria chatbot) ────────────────────────────

export async function streamAriaChat(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  pageContext?: string
) {
  const systemPrompt = pageContext
    ? `${ARIA_SYSTEM_PROMPT}\n\nCURRENT PAGE CONTEXT: User is currently on ${pageContext}. Tailor your response to be most relevant to this page.`
    : ARIA_SYSTEM_PROMPT

  const stream = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages,
    stream: true,
  })

  return stream
}

// ── STYLE TIP (Virtual Try-On) ────────────────────────────────

export async function getStyleTip(params: {
  dressName: string
  color: string
  silhouette: string
  designerName: string
}): Promise<string> {
  const prompt = `The customer is trying on a ${params.dressName} in ${params.color} with ${params.silhouette} silhouette by ${params.designerName}.

Suggest 3 specific accessories (e.g., specific jewelry pieces, bag style, shoe style) and a makeup palette (e.g., eye look, lip color, blush tone) that would complement this look perfectly.

Keep it fun, encouraging, and specific. 2–3 sentences max. You are Aria, a warm fashion expert best friend. Use a ✦ somewhere.`

  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  return content.type === 'text' ? content.text : ''
}

// ── TUX MATCHING (Tux page) ───────────────────────────────────

export interface TuxRecommendation {
  style: string
  accessories: {
    pocketSquare: string
    bowTie: string
    cufflinks: string
    shirt: string
  }
  reason: string
  aiNote: string
}

export async function getTuxMatch(dressDescription: {
  name: string
  color: string
  silhouette: string
  designer: string
}): Promise<TuxRecommendation[]> {
  const prompt = `Given this prom dress:
Name: ${dressDescription.name}
Color: ${dressDescription.color}
Silhouette: ${dressDescription.silhouette}
Designer: ${dressDescription.designer}

Suggest 3 complementary tuxedo configurations that would pair beautifully with this dress. For each, specify a style (e.g., "Classic Black Tuxedo", "Navy Blue Suit", "Ivory Dinner Jacket"), specific accessories (pocket square color/pattern, bow tie or tie description, cufflink suggestion, dress shirt), and why it pairs well.

Also write a brief AI style note in the voice of a warm fashion concierge (1 sentence).

Return ONLY valid JSON in this exact format:
[
  {
    "style": "Classic Black Tuxedo",
    "accessories": {
      "pocketSquare": "Deep red folded pocket square",
      "bowTie": "Deep red silk bow tie",
      "cufflinks": "Silver round cufflinks",
      "shirt": "Crisp white wing-collar dress shirt"
    },
    "reason": "The classic black creates a timeless contrast with the crimson gown.",
    "aiNote": "This pairing is like a red carpet moment — bold, classic, and unforgettable. ✦"
  }
]`

  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') return []

  try {
    // Extract JSON from the response
    const jsonMatch = content.text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return []
    return JSON.parse(jsonMatch[0]) as TuxRecommendation[]
  } catch {
    return []
  }
}

// ── STREAMING STYLE TIP (Server-Sent Events version) ─────────

export async function* streamStyleTip(params: {
  dressName: string
  color: string
  silhouette: string
  designerName: string
}): AsyncGenerator<string> {
  const prompt = `The customer is trying on a ${params.dressName} in ${params.color} with ${params.silhouette} silhouette by ${params.designerName}.

Suggest 3 specific accessories and a makeup palette that would complement this look perfectly. Keep it fun, encouraging, and specific. 2–3 sentences max. You are Aria. Use a ✦ somewhere.`

  const stream = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 256,
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  })

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      yield event.delta.text
    }
  }
}
