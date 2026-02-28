import { NextRequest } from 'next/server'
import { anthropic, ARIA_SYSTEM_PROMPT } from '@/lib/claude'
import { chatRatelimit, getClientIp } from '@/lib/ratelimit'

export const runtime = 'edge'

// Maximum limits to prevent prompt-stuffing and cost-abuse attacks
const MAX_MESSAGES = 20
const MAX_TOTAL_CHARS = 10_000
const MAX_PAGE_CONTEXT_CHARS = 100

export async function POST(req: NextRequest) {
  try {
    // Rate limiting — 20 requests/IP/hour
    const ip = getClientIp(req)
    const { success, reset } = await chatRatelimit.limit(ip)
    if (!success) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil((reset - Date.now()) / 1000)) },
        }
      )
    }

    const body = await req.json()
    const { messages, pageContext } = body

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages' }), { status: 400 })
    }

    // Enforce message count limit
    if (messages.length > MAX_MESSAGES) {
      return new Response(JSON.stringify({ error: 'Too many messages' }), { status: 400 })
    }

    // Enforce total character budget to cap token cost per request
    const totalChars = messages.reduce(
      (sum: number, m: { content?: unknown }) =>
        sum + (typeof m.content === 'string' ? m.content.length : 0),
      0
    )
    if (totalChars > MAX_TOTAL_CHARS) {
      return new Response(JSON.stringify({ error: 'Message content too long' }), { status: 400 })
    }

    // Build system prompt with optional page context (length-limited)
    const safePageContext =
      typeof pageContext === 'string'
        ? pageContext.slice(0, MAX_PAGE_CONTEXT_CHARS)
        : null

    const systemPrompt = safePageContext
      ? `${ARIA_SYSTEM_PROMPT}\n\nCurrent page context: The user is currently on the ${safePageContext} page.`
      : ARIA_SYSTEM_PROMPT

    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      system: systemPrompt,
      messages: messages.slice(-MAX_MESSAGES),
    })

    // Return as a ReadableStream of SSE
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              const data = `data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`
              controller.enqueue(encoder.encode(data))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat route error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
