'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { formatTime } from '@/lib/utils'
import type { ChatMessage } from '@/types'

// ── QUICK REPLY CHIPS ─────────────────────────────────────────

interface QuickReplyChipsProps {
  chips: string[]
  onSelect: (chip: string) => void
}

export function QuickReplyChips({ chips, onSelect }: QuickReplyChipsProps) {
  if (!chips.length) return null
  return (
    <div className="flex flex-wrap gap-2 mt-3 mb-1">
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => onSelect(chip)}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-sans font-semibold tracking-[0.1em]',
            'border border-gold/30 bg-[var(--glass-gold)] text-[var(--gold)]',
            'hover:bg-gold/20 hover:border-gold/50 transition-all duration-200'
          )}
          style={{ cursor: 'none' }}
        >
          {chip}
        </button>
      ))}
    </div>
  )
}

// ── MESSAGE BUBBLE ────────────────────────────────────────────

interface MessageBubbleProps {
  message: ChatMessage
  onQuickReply?: (text: string) => void
}

export function MessageBubble({ message, onQuickReply }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex items-end gap-2.5',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[var(--gold)]/30 to-[var(--blush)]/30 border border-gold/30 flex items-center justify-center mb-0.5">
          <span className="text-[9px] font-serif text-[var(--gold)]">A</span>
        </div>
      )}

      <div className={cn('flex flex-col max-w-[80%]', isUser && 'items-end')}>
        {/* Bubble */}
        <div
          className={cn(
            'px-4 py-3 text-sm font-sans leading-relaxed',
            isUser
              ? 'bg-[var(--glass-gold)] border border-gold/25 text-[var(--white-soft)] rounded-2xl rounded-tr-sm'
              : 'bg-[var(--glass-medium)] border border-white/10 text-[var(--white-soft)]/90 rounded-2xl rounded-tl-sm'
          )}
        >
          {/* Render content with basic markdown: bold, line breaks.
              HTML is escaped first to prevent XSS from user or AI content. */}
          <p
            dangerouslySetInnerHTML={{
              __html: message.content
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br />'),
            }}
          />
        </div>

        {/* Timestamp */}
        <span className="text-[9px] text-[var(--white-soft)]/20 font-sans mt-1 px-1">
          {message.timestamp ? formatTime(message.timestamp) : ''}
        </span>

        {/* Quick reply chips (Aria messages only) */}
        {!isUser && message.quickReplies && onQuickReply && (
          <QuickReplyChips chips={message.quickReplies} onSelect={onQuickReply} />
        )}
      </div>
    </motion.div>
  )
}

export default MessageBubble
