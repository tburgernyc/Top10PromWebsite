import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ── SHARED REDIS CLIENT ────────────────────────────────────────
// Reads UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from env.
const redis = Redis.fromEnv()

// ── RATE LIMITERS ──────────────────────────────────────────────

/**
 * Aria chatbot — 20 requests per IP per hour.
 * Chatbot traffic is heavier; this is generous enough for genuine use.
 */
export const chatRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 h'),
  prefix: 'rl:chat',
})

/**
 * AI style tip routes (/api/tryon/suggest, /api/tux/match) —
 * 10 requests per IP per hour.
 */
export const aiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
  prefix: 'rl:ai',
})

// ── HELPER ────────────────────────────────────────────────────

/**
 * Extract the real client IP from a Request, respecting the
 * X-Forwarded-For header set by Vercel's edge network.
 */
export function getClientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '127.0.0.1'
  )
}
