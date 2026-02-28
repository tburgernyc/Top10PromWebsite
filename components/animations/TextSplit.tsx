'use client'

import { useRef, useEffect, useMemo } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { cn } from '@/lib/utils'
import { prefersReducedMotion } from '@/lib/utils'

// ── TYPES ─────────────────────────────────────────────────────

interface TextSplitProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  splitBy?: 'char' | 'word' | 'line'
  staggerDelay?: number
  initialDelay?: number
  duration?: number
  direction?: 'up' | 'down' | 'fade'
  distance?: number
  threshold?: number
  once?: boolean
  className?: string
  charClassName?: string
}

interface GradientTextProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  gradient?: 'gold' | 'blush' | 'aurora'
  className?: string
  animate?: boolean
}

// ── TEXT SPLIT COMPONENT ──────────────────────────────────────

export function TextSplit({
  text,
  as: Tag = 'div',
  splitBy = 'char',
  staggerDelay = 0.03,
  initialDelay = 0,
  duration = 0.6,
  direction = 'up',
  distance = 32,
  threshold = 0.3,
  once = true,
  className,
  charClassName,
}: TextSplitProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref as React.RefObject<Element>, { once, amount: threshold })
  const controls = useAnimation()
  const reduced = prefersReducedMotion()

  // Split text into tokens
  const tokens = useMemo(() => {
    if (splitBy === 'char') {
      return text.split('').map((char, i) => ({
        content: char === ' ' ? '\u00A0' : char,
        key: i,
        isSpace: char === ' ',
      }))
    }
    if (splitBy === 'word') {
      return text.split(' ').map((word, i) => ({
        content: word,
        key: i,
        isSpace: false,
      }))
    }
    // line
    return text.split('\n').map((line, i) => ({
      content: line,
      key: i,
      isSpace: false,
    }))
  }, [text, splitBy])

  useEffect(() => {
    if (isInView) controls.start('visible')
    else if (!once) controls.start('hidden')
  }, [isInView, controls, once])

  const hiddenVariant =
    reduced
      ? { opacity: 0 }
      : direction === 'up'
      ? { opacity: 0, y: distance }
      : direction === 'down'
      ? { opacity: 0, y: -distance }
      : { opacity: 0 }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : staggerDelay,
        delayChildren: initialDelay,
      },
    },
  }

  const tokenVariants = {
    hidden: hiddenVariant,
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? 0.15 : duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  const MotionTag = motion[Tag as keyof typeof motion] as typeof motion.div

  return (
    <MotionTag
      ref={ref as React.RefObject<HTMLDivElement>}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={cn('overflow-hidden', className)}
      aria-label={text}
    >
      {tokens.map((token) => (
        <motion.span
          key={token.key}
          variants={tokenVariants}
          className={cn(
            'inline-block',
            splitBy === 'word' && 'mr-[0.25em]',
            charClassName
          )}
          aria-hidden="true"
        >
          {token.content}
        </motion.span>
      ))}
    </MotionTag>
  )
}

// ── GRADIENT TEXT ─────────────────────────────────────────────

export function GradientText({
  text,
  as: Tag = 'span',
  gradient = 'gold',
  className,
  animate: shouldAnimate = false,
}: GradientTextProps) {
  const gradientClass = {
    gold: 'from-[var(--gold)] via-[var(--gold-light)] to-[var(--gold)]',
    blush: 'from-[var(--blush)] via-pink-300 to-[var(--blush)]',
    aurora: 'from-[var(--gold)] via-[var(--blush)] to-[var(--purple-accent)]',
  }[gradient]

  const Tag2 = Tag as keyof JSX.IntrinsicElements

  return (
    <Tag2
      className={cn(
        'bg-clip-text text-transparent bg-gradient-to-r',
        gradientClass,
        shouldAnimate && 'animate-[gradient-rotate_3s_ease_infinite] bg-[length:200%_100%]',
        className
      )}
    >
      {text}
    </Tag2>
  )
}

// ── TYPEWRITER ─────────────────────────────────────────────────

interface TypewriterProps {
  phrases: string[]
  speed?: number
  deleteSpeed?: number
  pauseDelay?: number
  className?: string
  cursorClassName?: string
}

export function Typewriter({
  phrases,
  speed = 80,
  deleteSpeed = 40,
  pauseDelay = 2000,
  className,
  cursorClassName,
}: TypewriterProps) {
  const displayRef = useRef<HTMLSpanElement>(null)
  const phraseIndex = useRef(0)
  const charIndex = useRef(0)
  const isDeleting = useRef(false)
  const reduced = prefersReducedMotion()

  useEffect(() => {
    if (reduced) {
      if (displayRef.current) displayRef.current.textContent = phrases[0]
      return
    }

    let timeout: ReturnType<typeof setTimeout>

    const tick = () => {
      const phrase = phrases[phraseIndex.current]
      const current = isDeleting.current
        ? phrase.slice(0, charIndex.current - 1)
        : phrase.slice(0, charIndex.current + 1)

      if (displayRef.current) displayRef.current.textContent = current

      if (!isDeleting.current) {
        charIndex.current++
        if (charIndex.current > phrase.length) {
          isDeleting.current = true
          timeout = setTimeout(tick, pauseDelay)
          return
        }
      } else {
        charIndex.current--
        if (charIndex.current < 0) {
          isDeleting.current = false
          phraseIndex.current = (phraseIndex.current + 1) % phrases.length
          charIndex.current = 0
        }
      }

      timeout = setTimeout(tick, isDeleting.current ? deleteSpeed : speed)
    }

    timeout = setTimeout(tick, speed)
    return () => clearTimeout(timeout)
  }, [phrases, speed, deleteSpeed, pauseDelay, reduced])

  return (
    <span className={className}>
      <span ref={displayRef} />
      <span
        className={cn(
          'inline-block w-0.5 h-[1.1em] align-middle ml-0.5',
          'bg-[var(--gold)] animate-pulse',
          cursorClassName
        )}
        aria-hidden="true"
      />
    </span>
  )
}

// ── SCRAMBLE TEXT ─────────────────────────────────────────────

interface ScrambleTextProps {
  text: string
  trigger?: boolean
  speed?: number
  className?: string
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function ScrambleText({
  text,
  trigger = true,
  speed = 40,
  className,
}: ScrambleTextProps) {
  const displayRef = useRef<HTMLSpanElement>(null)
  const reduced = prefersReducedMotion()

  useEffect(() => {
    if (!trigger || reduced) {
      if (displayRef.current) displayRef.current.textContent = text
      return
    }

    let iteration = 0
    const maxIterations = text.length * 3
    let interval: ReturnType<typeof setInterval>

    interval = setInterval(() => {
      if (!displayRef.current) return

      displayRef.current.textContent = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' '
          if (i < Math.floor(iteration / 3)) return text[i]
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')

      iteration++
      if (iteration > maxIterations) {
        clearInterval(interval)
        if (displayRef.current) displayRef.current.textContent = text
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, trigger, speed, reduced])

  return <span ref={displayRef} className={className}>{text}</span>
}

export default TextSplit
