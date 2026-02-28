'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TypingIndicatorProps {
  className?: string
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-3 py-1', className)}>
      {/* Aria avatar */}
      <div className="w-7 h-7 flex-shrink-0 rounded-full bg-gradient-to-br from-[var(--gold)]/30 to-[var(--blush)]/30 border border-gold/30 flex items-center justify-center">
        <span className="text-[9px] font-serif text-[var(--gold)]">A</span>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-1 px-4 py-2.5 rounded-2xl rounded-tl-sm bg-[var(--glass-medium)] border border-white/10">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[var(--white-soft)]/40"
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.18,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default TypingIndicator
