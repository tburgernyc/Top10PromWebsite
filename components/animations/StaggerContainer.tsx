'use client'

import {
  useRef,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { cn } from '@/lib/utils'
import { prefersReducedMotion } from '@/lib/utils'

// ── TYPES ─────────────────────────────────────────────────────

interface StaggerContainerProps {
  children: ReactNode
  staggerDelay?: number
  initialDelay?: number
  duration?: number
  direction?: 'up' | 'down' | 'fade'
  distance?: number
  threshold?: number
  once?: boolean
  className?: string
  style?: CSSProperties
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  index?: number
}

// ── CONTAINER ─────────────────────────────────────────────────

export function StaggerContainer({
  children,
  staggerDelay = 0.08,
  initialDelay = 0,
  duration = 0.65,
  direction = 'up',
  distance = 28,
  threshold = 0.1,
  once = true,
  className,
  style,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })
  const controls = useAnimation()
  const reduced = prefersReducedMotion()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    } else if (!once) {
      controls.start('hidden')
    }
  }, [isInView, controls, once])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : staggerDelay,
        delayChildren: initialDelay,
      },
    },
  }

  const itemVariants = {
    hidden: reduced
      ? { opacity: 0 }
      : direction === 'up'
      ? { opacity: 0, y: distance }
      : direction === 'down'
      ? { opacity: 0, y: -distance }
      : { opacity: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? 0.2 : duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={className}
      style={style}
      // Expose item variants via data attribute for child consumption
      data-stagger-variants={JSON.stringify(itemVariants)}
    >
      {children}
    </motion.div>
  )
}

// ── STAGGER ITEM ──────────────────────────────────────────────
// Used as direct children of StaggerContainer

export function StaggerItem({ children, className, style }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

// ── GRID STAGGER (for product grids, feature grids) ───────────

interface GridStaggerProps {
  children: ReactNode[]
  columns?: number
  staggerDelay?: number
  className?: string
  itemClassName?: string
  threshold?: number
}

export function GridStagger({
  children,
  columns = 3,
  staggerDelay = 0.06,
  className,
  itemClassName,
  threshold = 0.05,
}: GridStaggerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  const controls = useAnimation()
  const reduced = prefersReducedMotion()

  useEffect(() => {
    if (isInView) controls.start('visible')
  }, [isInView, controls])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : staggerDelay,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: reduced ? 0 : 40, scale: reduced ? 1 : 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: reduced ? 0.2 : 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={cn(
        `grid grid-cols-1`,
        columns === 2 && 'sm:grid-cols-2',
        columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'sm:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {children.map((child, i) => (
        <motion.div key={i} variants={itemVariants} className={itemClassName}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// ── LIST STAGGER (for ordered lists, menu items) ──────────────

interface ListStaggerProps {
  items: ReactNode[]
  staggerDelay?: number
  initialDelay?: number
  className?: string
  itemClassName?: string
  threshold?: number
}

export function ListStagger({
  items,
  staggerDelay = 0.05,
  initialDelay = 0,
  className,
  itemClassName,
  threshold = 0.1,
}: ListStaggerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  const controls = useAnimation()
  const reduced = prefersReducedMotion()

  useEffect(() => {
    if (isInView) controls.start('visible')
  }, [isInView, controls])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : staggerDelay,
        delayChildren: initialDelay,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: reduced ? 0 : -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: reduced ? 0.15 : 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={className}
    >
      {items.map((item, i) => (
        <motion.div key={i} variants={itemVariants} className={itemClassName}>
          {item}
        </motion.div>
      ))}
    </motion.div>
  )
}

export default StaggerContainer
