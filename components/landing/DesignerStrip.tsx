'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { DESIGNERS } from '@/lib/mock-data'

// ── DESIGNER STRIP ─────────────────────────────────────────────
// Infinite horizontal ticker of designer logos/names

export function DesignerStrip({ className }: { className?: string }) {
  // Duplicate array for seamless loop
  const items = [...DESIGNERS, ...DESIGNERS]

  return (
    <div className={cn('relative overflow-hidden py-4', className)}>
      {/* Fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[var(--bg-primary)] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[var(--bg-primary)] to-transparent pointer-events-none" />

      {/* Gold rule top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/20 to-transparent" />

      {/* Scrolling track */}
      <motion.div
        className="flex items-center gap-16 whitespace-nowrap"
        animate={{ x: [0, -50 * DESIGNERS.length * 16] }}
        transition={{
          duration: DESIGNERS.length * 4,
          ease: 'linear',
          repeat: Infinity,
        }}
        style={{ width: 'max-content' }}
      >
        {items.map((designer, i) => (
          <div key={`${designer.id}-${i}`} className="flex items-center gap-16 flex-shrink-0">
            {/* Designer name */}
            <div className="flex items-center gap-3">
              <span className="text-[var(--gold)]/40 text-xs">✦</span>
              <span className="font-serif text-sm text-[var(--white-soft)]/40 tracking-[0.15em] uppercase hover:text-[var(--gold)]/70 transition-colors">
                {designer.name}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default DesignerStrip
