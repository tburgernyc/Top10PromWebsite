'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { GoldButton, GhostButton } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { useCursor } from '@/components/layout/CustomCursor'

// ── TYPES ─────────────────────────────────────────────────────

interface FeatureBlockProps {
  eyebrow?: string
  heading: string
  body: string
  cta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  imageSeed?: string
  imageAlt?: string
  reverse?: boolean
  accent?: 'gold' | 'blush'
  className?: string
  features?: { icon: string; label: string }[]
}

// ── FEATURE BLOCK ─────────────────────────────────────────────

export function FeatureBlock({
  eyebrow,
  heading,
  body,
  cta,
  secondaryCta,
  imageSeed,
  imageAlt,
  reverse = false,
  accent = 'gold',
  className,
  features,
}: FeatureBlockProps) {
  const { setCursorState, resetCursor } = useCursor()
  const accentColor = accent === 'blush' ? 'var(--blush)' : 'var(--gold)'
  const accentClass = accent === 'blush' ? 'text-[var(--blush)]' : 'text-[var(--gold)]'

  return (
    <section className={cn('w-full', className)}>
      <div
        className={cn(
          'grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center',
          reverse && 'lg:[&>*:first-child]:order-last'
        )}
      >
        {/* Image side */}
        {imageSeed && (
          <ScrollReveal direction={reverse ? 'right' : 'left'} threshold={0.2}>
            <div
              className="relative rounded-3xl overflow-hidden border border-white/10"
              style={{ aspectRatio: '4/5' }}
              onMouseEnter={() => setCursorState('view')}
              onMouseLeave={resetCursor}
            >
              <Image
                src={`https://picsum.photos/seed/${imageSeed}/800/1000`}
                alt={imageAlt ?? heading}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${accent === 'gold' ? 'rgba(212,175,114,0.08)' : 'rgba(242,181,199,0.08)'} 0%, transparent 60%)`,
                }}
              />
              {/* Border glow */}
              <div className="absolute inset-0 rounded-3xl" style={{ boxShadow: `inset 0 0 60px ${accent === 'gold' ? 'rgba(212,175,114,0.06)' : 'rgba(242,181,199,0.06)'}` }} />
            </div>
          </ScrollReveal>
        )}

        {/* Text side */}
        <ScrollReveal direction={reverse ? 'left' : 'right'} threshold={0.2} delay={0.15}>
          <div className="flex flex-col gap-6">
            {eyebrow && (
              <p className={cn('text-xs font-sans font-semibold tracking-[0.3em] uppercase', accentClass)}>
                {eyebrow}
              </p>
            )}

            <h2 className="font-serif text-4xl md:text-5xl text-[var(--white-soft)] leading-tight">
              {heading}
            </h2>

            {/* Gold rule */}
            <div className="h-px w-12 bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${accentColor}, transparent)` }} />

            <p className="text-base text-[var(--white-soft)]/60 font-sans leading-relaxed">
              {body}
            </p>

            {/* Feature list */}
            {features && (
              <ul className="flex flex-col gap-3">
                {features.map((f) => (
                  <li key={f.label} className="flex items-center gap-3">
                    <span className={cn('text-lg', accentClass)}>{f.icon}</span>
                    <span className="text-sm text-[var(--white-soft)]/70 font-sans">{f.label}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* CTAs */}
            {(cta || secondaryCta) && (
              <div className="flex gap-4 flex-wrap">
                {cta && (
                  accent === 'gold' ? (
                    <GoldButton>
                      <Link href={cta.href} style={{ cursor: 'none' }}>{cta.label}</Link>
                    </GoldButton>
                  ) : (
                    <GoldButton variant="blush">
                      <Link href={cta.href} style={{ cursor: 'none' }}>{cta.label}</Link>
                    </GoldButton>
                  )
                )}
                {secondaryCta && (
                  <GhostButton>
                    <Link href={secondaryCta.href} style={{ cursor: 'none' }}>{secondaryCta.label}</Link>
                  </GhostButton>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default FeatureBlock
