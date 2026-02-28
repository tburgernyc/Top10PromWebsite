'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { GoldButton } from '@/components/ui/Button'
import { useCursor } from '@/components/layout/CustomCursor'
import type { ChatMessage } from '@/types'

// Full-screen drawer version of Aria chat (used on /virtual-try-on, /shop)

interface ChatDrawerProps {
  isOpen: boolean
  onClose: () => void
  initialMessage?: string
  context?: string
  pageContext?: string
}

const WELCOME: ChatMessage = {
  id: 'drawer-welcome',
  role: 'assistant',
  content:
    "Hi! I'm **Aria**, your personal style concierge. I can help you find the perfect look, answer questions about sizing, availability, and suggest complementary styles. What can I help you with?",
  timestamp: new Date().toISOString(),
  quickReplies: ['Find my size', 'Suggest similar styles', 'View trending looks', 'Book appointment'],
}

export function ChatDrawer({ isOpen, onClose, initialMessage, context }: ChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { setCursorState, resetCursor } = useCursor()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  // Auto-send initial message if provided
  useEffect(() => {
    if (isOpen && initialMessage) {
      sendMessage(initialMessage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialMessage])

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
        const history = [...messages, userMsg].slice(-14).map((m) => ({
          role: m.role,
          content: m.content,
        }))

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history, context }),
        })

        if (!res.ok || !res.body) throw new Error()

        const assistantId = `aria_${Date.now()}`
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: 'assistant',
            content: '',
            timestamp: new Date().toISOString(),
          },
        ])
        setIsLoading(false)

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let fullContent = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
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
              } catch { }
            }
          }
        }
      } catch {
        setIsLoading(false)
        setMessages((prev) => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            role: 'assistant',
            content: 'I apologize — I ran into a technical issue. Please try again.',
            timestamp: new Date().toISOString(),
          },
        ])
      }
    },
    [messages, isLoading, context]
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[88] bg-[var(--bg-primary)]/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.aside
            key="chat-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'fixed top-0 right-0 bottom-0 z-[89] w-full max-w-sm',
              'bg-[var(--bg-elevated)] border-l border-white/10',
              'flex flex-col'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--gold)]/30 to-[var(--blush)]/30 border border-gold/30 flex items-center justify-center">
                  <span className="text-sm font-serif text-[var(--gold)]">A</span>
                </div>
                <div>
                  <p className="font-serif text-base text-[var(--white-soft)]">Aria</p>
                  <p className="text-[9px] font-sans tracking-[0.2em] uppercase text-[var(--gold)]/60">
                    AI Style Concierge
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-[var(--white-soft)]/60 hover:text-[var(--white-soft)] transition-colors"
                style={{ cursor: 'none' }}
                onMouseEnter={() => setCursorState('hover')}
                onMouseLeave={resetCursor}
                aria-label="Close chat"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} onQuickReply={sendMessage} />
              ))}
              {isLoading && <TypingIndicator />}
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-white/8">
              <div className="flex gap-2 items-end bg-[var(--glass-medium)] rounded-2xl border border-white/10 px-4 py-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage(input)
                    }
                  }}
                  placeholder="Ask Aria anything..."
                  rows={1}
                  className="flex-1 bg-transparent resize-none text-sm text-[var(--white-soft)] placeholder:text-[var(--white-soft)]/25 font-sans outline-none leading-relaxed max-h-24 overflow-y-auto"
                  style={{ cursor: 'text' }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all',
                    input.trim() && !isLoading
                      ? 'bg-[var(--gold)] text-[var(--bg-primary)]'
                      : 'bg-white/10 text-[var(--white-soft)]/20'
                  )}
                  style={{ cursor: 'none' }}
                  aria-label="Send"
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default ChatDrawer
