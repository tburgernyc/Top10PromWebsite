'use client'

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type KeyboardEvent,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { useCursor } from '@/components/layout/CustomCursor'
import type { ChatMessage } from '@/types'

// ── ARIA WELCOME MESSAGE ──────────────────────────────────────

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm **Aria**, your personal style concierge at Top 10 Prom. ✦ Whether you're searching for the perfect prom look, bridal gown, or tux, I'm here to help. What can I find for you today?",
  timestamp: new Date().toISOString(),
  quickReplies: [
    'Find a prom dress',
    'Shop bridal gowns',
    'Match a tuxedo',
    'Book an appointment',
  ],
}

// ── CHAT WIDGET (floating button + inline panel) ──────────────

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { setCursorState, resetCursor } = useCursor()

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Stream response from Aria API
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return

      const userMsg: ChatMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: text.trim(),
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, userMsg])
      setInput('')
      setIsLoading(true)

      try {
        // Build history for API (exclude welcome message, exclude quickReplies)
        const history = [...messages, userMsg].slice(-12).map((m) => ({
          role: m.role,
          content: m.content,
        }))

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: history,
            page: typeof window !== 'undefined' ? window.location.pathname : '/',
          }),
        })

        if (!res.ok) throw new Error('Network error')
        if (!res.body) throw new Error('No response body')

        const assistantId = `aria_${Date.now()}`
        const assistantMsg: ChatMessage = {
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, assistantMsg])
        setIsLoading(false)

        // Stream
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let fullContent = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          // Parse SSE lines
          for (const line of chunk.split('\n')) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break
              try {
                const parsed = JSON.parse(data)
                const delta = parsed.delta?.text ?? parsed.choices?.[0]?.delta?.content ?? ''
                fullContent += delta
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: fullContent } : m
                  )
                )
              } catch {
                // Skip malformed SSE
              }
            }
          }
        }

        // Add contextual quick replies based on content
        const quickReplies = generateQuickReplies(fullContent)
        if (quickReplies.length) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, quickReplies } : m
            )
          )
        }
      } catch {
        setIsLoading(false)
        setMessages((prev) => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            role: 'assistant',
            content: "I'm having a little trouble right now — please try again in a moment.",
            timestamp: new Date().toISOString(),
          },
        ])
      }
    },
    [messages, isLoading]
  )

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      {/* ── Chat panel ─────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'fixed bottom-24 right-6 z-[85]',
              'w-[360px] max-h-[560px] flex flex-col',
              'bg-[var(--bg-elevated)] rounded-3xl',
              'border border-white/10',
              'shadow-[0_32px_80px_rgba(0,0,0,0.6)]',
              'overflow-hidden'
            )}
            role="dialog"
            aria-label="Chat with Aria"
          >
            {/* Header */}
            <div className={cn(
              'flex items-center justify-between px-5 py-4',
              'border-b border-white/8',
              'bg-gradient-to-r from-[var(--glass-gold)] to-transparent'
            )}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--gold)]/40 to-[var(--blush)]/40 border border-gold/40 flex items-center justify-center">
                  <span className="text-xs font-serif text-[var(--gold)]">A</span>
                </div>
                <div>
                  <p className="text-sm font-serif text-[var(--white-soft)]">Aria</p>
                  <p className="text-[9px] font-sans tracking-[0.15em] uppercase text-[var(--gold)]/60">
                    Style Concierge
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 text-[var(--white-soft)]/50 hover:text-[var(--white-soft)] transition-colors"
                style={{ cursor: 'none' }}
                aria-label="Close chat"
              >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4"
            >
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onQuickReply={sendMessage}
                />
              ))}
              {isLoading && <TypingIndicator />}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/8">
              <div className={cn(
                'flex items-end gap-2',
                'bg-[var(--glass-medium)] rounded-2xl border border-white/10',
                'px-4 py-2'
              )}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Aria anything..."
                  rows={1}
                  maxLength={500}
                  className={cn(
                    'flex-1 bg-transparent resize-none',
                    'text-sm text-[var(--white-soft)] placeholder:text-[var(--white-soft)]/25',
                    'font-sans outline-none leading-relaxed',
                    'max-h-24 overflow-y-auto'
                  )}
                  style={{ cursor: 'text' }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    'flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full',
                    'transition-all duration-200',
                    input.trim() && !isLoading
                      ? 'bg-[var(--gold)] text-[var(--bg-primary)] hover:bg-[var(--gold-light)]'
                      : 'bg-white/10 text-[var(--white-soft)]/30'
                  )}
                  style={{ cursor: 'none' }}
                  aria-label="Send message"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
              <p className="text-[9px] text-[var(--white-soft)]/20 font-sans text-center mt-2">
                Powered by Claude AI · Top 10 Prom
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB ─────────────────────────────────────────── */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        className={cn(
          'fixed bottom-6 right-6 z-[85]',
          'w-14 h-14 rounded-full flex items-center justify-center',
          'shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
          'transition-all duration-300',
          isOpen
            ? 'bg-[var(--bg-elevated)] border border-white/15 text-[var(--white-soft)]/70'
            : 'bg-gradient-to-br from-[var(--gold)] to-[var(--gold-light)] text-[var(--bg-primary)]'
        )}
        style={{ cursor: 'none' }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setCursorState('hover')}
        onMouseLeave={resetCursor}
        aria-label={isOpen ? 'Close Aria chat' : 'Open Aria style concierge'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="22"
              height="22"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Unread indicator */}
        {!isOpen && (
          <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[var(--blush)] border-2 border-[var(--bg-primary)]" />
        )}
      </motion.button>
    </>
  )
}

// ── HELPER: generate quick reply chips from Aria response ────

function generateQuickReplies(content: string): string[] {
  const lower = content.toLowerCase()
  if (lower.includes('prom') || lower.includes('dress')) {
    return ['Show me more styles', 'What colors are available?', 'Book a fitting']
  }
  if (lower.includes('appointment') || lower.includes('book')) {
    return ['Schedule now', 'Find nearest store', 'What to expect']
  }
  if (lower.includes('tux') || lower.includes('suit')) {
    return ['Match with a dress', 'Browse tuxedos', 'Rental options']
  }
  if (lower.includes('bridal') || lower.includes('wedding')) {
    return ['View bridal gowns', 'Book bridal appointment', 'Bridesmaid dresses']
  }
  return []
}

export default ChatWidget
