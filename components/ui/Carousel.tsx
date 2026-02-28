'use client'

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
  type TouchEvent,
  type MouseEvent,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ── TYPES ─────────────────────────────────────────────────────

interface CarouselProps {
  children: ReactNode[]
  className?: string
  slidesPerView?: number
  gap?: number
  autoplay?: boolean
  autoplayInterval?: number
  showArrows?: boolean
  showDots?: boolean
  loop?: boolean
  onSlideChange?: (index: number) => void
}

// ── ARROW BUTTON ──────────────────────────────────────────────

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'absolute top-1/2 -translate-y-1/2 z-10',
        'w-10 h-10 flex items-center justify-center rounded-full',
        'bg-[var(--bg-elevated)]/90 border border-white/10',
        'text-[var(--white-soft)] backdrop-blur-md',
        'transition-all duration-200',
        'hover:bg-[var(--glass-gold)] hover:border-gold/35 hover:text-[var(--gold)]',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        direction === 'prev' ? '-left-5' : '-right-5'
      )}
      style={{ cursor: 'none' }}
      aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
    >
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        className={direction === 'prev' ? 'rotate-180' : ''}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}

// ── DOT INDICATORS ────────────────────────────────────────────

function DotIndicators({
  count,
  active,
  onChange,
}: {
  count: number
  active: number
  onChange: (i: number) => void
}) {
  return (
    <div className="flex items-center justify-center gap-2 mt-5">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={cn(
            'rounded-full transition-all duration-300',
            i === active
              ? 'w-6 h-1.5 bg-[var(--gold)]'
              : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
          )}
          style={{ cursor: 'none' }}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  )
}

// ── MAIN CAROUSEL ─────────────────────────────────────────────

export function Carousel({
  children,
  className,
  slidesPerView = 1,
  gap = 16,
  autoplay = false,
  autoplayInterval = 5000,
  showArrows = true,
  showDots = true,
  loop = false,
  onSlideChange,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef(0)
  const dragDelta = useRef(0)
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const totalSlides = children.length
  const maxIndex = Math.max(0, totalSlides - slidesPerView)

  const goTo = useCallback(
    (index: number) => {
      let next = index
      if (loop) {
        next = ((index % totalSlides) + totalSlides) % totalSlides
      } else {
        next = Math.max(0, Math.min(index, maxIndex))
      }
      setCurrentIndex(next)
      onSlideChange?.(next)
    },
    [loop, totalSlides, maxIndex, onSlideChange]
  )

  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo])
  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo])

  // Autoplay
  useEffect(() => {
    if (!autoplay) return
    autoplayRef.current = setInterval(next, autoplayInterval)
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current)
    }
  }, [autoplay, autoplayInterval, next])

  // Pause autoplay on hover/drag
  const pauseAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current)
  }, [])

  const resumeAutoplay = useCallback(() => {
    if (!autoplay) return
    autoplayRef.current = setInterval(next, autoplayInterval)
  }, [autoplay, autoplayInterval, next])

  // ── DRAG / SWIPE ──────────────────────────────────────────

  const onPointerDown = useCallback(
    (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
      setIsDragging(true)
      pauseAutoplay()
      dragStart.current = 'touches' in e ? e.touches[0].clientX : e.clientX
      dragDelta.current = 0
    },
    [pauseAutoplay]
  )

  const onPointerMove = useCallback(
    (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
      if (!isDragging) return
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX
      dragDelta.current = x - dragStart.current
    },
    [isDragging]
  )

  const onPointerUp = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    resumeAutoplay()
    const threshold = 60
    if (dragDelta.current < -threshold) next()
    else if (dragDelta.current > threshold) prev()
    dragDelta.current = 0
  }, [isDragging, next, prev, resumeAutoplay])

  // Keyboard navigation
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [prev, next])

  const translateX = -(currentIndex * (100 / slidesPerView))

  return (
    <div
      className={cn('relative', className)}
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
    >
      {/* Track */}
      <div
        className="overflow-hidden"
        onMouseDown={onPointerDown as (e: MouseEvent<HTMLDivElement>) => void}
        onMouseMove={onPointerMove as (e: MouseEvent<HTMLDivElement>) => void}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={onPointerDown as (e: TouchEvent<HTMLDivElement>) => void}
        onTouchMove={onPointerMove as (e: TouchEvent<HTMLDivElement>) => void}
        onTouchEnd={onPointerUp}
      >
        <div
          ref={trackRef}
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: `translateX(${translateX}%)`,
            gap: `${gap}px`,
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          {children.map((child, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={{
                width: `calc(${100 / slidesPerView}% - ${(gap * (slidesPerView - 1)) / slidesPerView}px)`,
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {showArrows && totalSlides > slidesPerView && (
        <>
          <ArrowButton
            direction="prev"
            onClick={prev}
            disabled={!loop && currentIndex === 0}
          />
          <ArrowButton
            direction="next"
            onClick={next}
            disabled={!loop && currentIndex >= maxIndex}
          />
        </>
      )}

      {/* Dots */}
      {showDots && totalSlides > slidesPerView && (
        <DotIndicators
          count={maxIndex + 1}
          active={currentIndex}
          onChange={goTo}
        />
      )}
    </div>
  )
}

// ── FEATURED CAROUSEL (hero/editorial) ───────────────────────

interface FeaturedCarouselProps {
  slides: {
    id: string
    content: ReactNode
  }[]
  className?: string
  autoplay?: boolean
  autoplayInterval?: number
}

export function FeaturedCarousel({
  slides,
  className,
  autoplay = true,
  autoplayInterval = 6000,
}: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1)
      setCurrentIndex(index)
    },
    [currentIndex]
  )

  const next = useCallback(() => {
    goTo((currentIndex + 1) % slides.length)
  }, [currentIndex, goTo, slides.length])

  useEffect(() => {
    if (!autoplay) return
    autoplayRef.current = setInterval(next, autoplayInterval)
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current)
    }
  }, [autoplay, autoplayInterval, next])

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.div
          key={slides[currentIndex].id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          {slides[currentIndex].content}
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <DotIndicators
        count={slides.length}
        active={currentIndex}
        onChange={goTo}
      />
    </div>
  )
}

// ── HORIZONTAL SCROLL RAIL (no arrows, drag-to-scroll) ───────

interface ScrollRailProps {
  children: ReactNode
  className?: string
  itemClassName?: string
  gap?: number
}

export function ScrollRail({ children, className, gap = 16 }: ScrollRailProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    dragStartX.current = e.pageX - (railRef.current?.offsetLeft ?? 0)
    scrollLeft.current = railRef.current?.scrollLeft ?? 0
  }

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !railRef.current) return
    e.preventDefault()
    const x = e.pageX - (railRef.current.offsetLeft ?? 0)
    const walk = (x - dragStartX.current) * 1.5
    railRef.current.scrollLeft = scrollLeft.current - walk
  }

  const onMouseUp = () => setIsDragging(false)

  return (
    <div
      ref={railRef}
      className={cn(
        'flex overflow-x-auto scrollbar-hide',
        'select-none',
        className
      )}
      style={{ gap: `${gap}px`, cursor: isDragging ? 'grabbing' : 'grab' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {children}
    </div>
  )
}

export default Carousel
