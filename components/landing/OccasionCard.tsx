'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useCursor } from '@/components/layout/CustomCursor'

// ── TYPES ─────────────────────────────────────────────────────

interface OccasionCardProps {
  title: string
  subtitle: string
  href: string
  imageSeed: string
  accent?: 'gold' | 'blush' | 'purple'
  badge?: string
  className?: string
  index?: number
}

// ── ACCENT STYLES ─────────────────────────────────────────────

const accentStyles = {
  gold: {
    glow: 'hover:shadow-[var(--shadow-gold)]',
    border: 'hover:border-gold/40',
    text: 'text-[var(--gold)]',
    badge: 'bg-[var(--glass-gold)] border-gold/35 text-[var(--gold)]',
  },
  blush: {
    glow: 'hover:shadow-[var(--shadow-blush)]',
    border: 'hover:border-blush/40',
    text: 'text-[var(--blush)]',
    badge: 'bg-[var(--glass-blush)] border-blush/35 text-[var(--blush)]',
  },
  purple: {
    glow: '',
    border: 'hover:border-purple-accent/40',
    text: 'text-[var(--purple-accent)]',
    badge: 'bg-purple-accent/10 border-purple-accent/35 text-[var(--purple-accent)]',
  },
}

// ── OCCASION CARD ─────────────────────────────────────────────

export function OccasionCard({
  title,
  subtitle,
  href,
  imageSeed,
  accent = 'gold',
  badge,
  className,
  index = 0,
}: OccasionCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const styles = accentStyles[accent]
  const { setCursorState, resetCursor } = useCursor()

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn('group relative', className)}
    >
      <Link
        href={href}
        className={cn(
          'flex flex-col rounded-2xl overflow-hidden',
          'border border-white/10 transition-all duration-500',
          'bg-[var(--glass-light)]',
          styles.glow,
          styles.border
        )}
        style={{ cursor: 'none' }}
        onMouseEnter={() => {
          setIsHovered(true)
          setCursorState('view')
        }}
        onMouseLeave={() => {
          setIsHovered(false)
          resetCursor()
        }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
          <Image
            src={`https://picsum.photos/seed/${imageSeed}/600/800`}
            alt={title}
            fill
            className={cn(
              'object-cover transition-transform duration-700',
              isHovered && 'scale-105'
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/80 via-transparent to-transparent" />

          {/* Badge */}
          {badge && (
            <div className="absolute top-4 left-4">
              <span className={cn(
                'px-3 py-1 rounded-full text-[9px] font-sans font-bold tracking-[0.2em] uppercase border',
                styles.badge
              )}>
                {badge}
              </span>
            </div>
          )}

          {/* Arrow on hover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--bg-primary)]/80 backdrop-blur-sm"
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className={styles.text}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </motion.div>
        </div>

        {/* Text */}
        <div className="p-5 flex flex-col gap-1">
          <h3 className={cn('font-serif text-xl transition-colors duration-200', isHovered ? styles.text : 'text-[var(--white-soft)]')}>
            {title}
          </h3>
          <p className="text-xs font-sans text-[var(--white-soft)]/50 leading-relaxed">
            {subtitle}
          </p>
          <span className={cn('text-[10px] font-sans font-semibold tracking-[0.2em] uppercase mt-2 transition-colors', isHovered ? styles.text : 'text-[var(--white-soft)]/30')}>
            Shop Now →
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

export default OccasionCard
