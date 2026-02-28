'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

// ── TYPES ─────────────────────────────────────────────────────

type CursorState =
  | 'default'
  | 'hover'
  | 'text'
  | 'view'
  | 'drag'
  | 'crosshair'

interface CursorContextValue {
  setCursorState: (state: CursorState) => void
  resetCursor: () => void
}

// ── CONTEXT ────────────────────────────────────────────────────

const CursorContext = createContext<CursorContextValue>({
  setCursorState: () => {},
  resetCursor: () => {},
})

export function useCursor() {
  return useContext(CursorContext)
}

// ── LERP UTILITY ──────────────────────────────────────────────

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

// ── CURSOR LABEL MAP ──────────────────────────────────────────

const cursorLabels: Partial<Record<CursorState, string>> = {
  view: 'VIEW',
  drag: 'DRAG',
}

// ── PROVIDER + CURSOR RENDERER ───────────────────────────────

export function CursorProvider({ children }: { children: ReactNode }) {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<CursorState>('default')
  const [cursorState, setCursorStateLocal] = useState<CursorState>('default')
  const [isVisible, setIsVisible] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  // Mouse position targets
  const mouse = useRef({ x: 0, y: 0 })
  const dot = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const frameRef = useRef<number>()

  const setCursorState = useCallback((state: CursorState) => {
    stateRef.current = state
    setCursorStateLocal(state)
  }, [])

  const resetCursor = useCallback(() => {
    stateRef.current = 'default'
    setCursorStateLocal('default')
  }, [])

  useEffect(() => {
    // Detect touch device — disable cursor on coarse pointer
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    if (isCoarse) {
      setIsTouch(true)
      return
    }

    // Track mouse
    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)
    }

    const onMouseEnter = () => setIsVisible(true)
    const onMouseLeave = () => setIsVisible(false)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseleave', onMouseLeave)

    // Animation loop — lerp ring behind dot
    const animate = () => {
      dot.current.x = lerp(dot.current.x, mouse.current.x, 0.85)
      dot.current.y = lerp(dot.current.y, mouse.current.y, 0.85)

      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12)
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12)

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dot.current.x}px, ${dot.current.y}px) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseleave', onMouseLeave)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [isVisible])

  // Auto-detect hover/text elements
  useEffect(() => {
    if (isTouch) return

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.dataset.cursorHover !== undefined
      ) {
        setCursorState('hover')
      } else if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        setCursorState('text')
      } else if (target.dataset.cursorView !== undefined) {
        setCursorState('view')
      } else if (target.dataset.cursorDrag !== undefined) {
        setCursorState('drag')
      } else if (target.dataset.cursorCrosshair !== undefined) {
        setCursorState('crosshair')
      } else {
        setCursorState('default')
      }
    }

    document.addEventListener('mouseover', onMouseOver)
    return () => document.removeEventListener('mouseover', onMouseOver)
  }, [isTouch, setCursorState])

  // Don't render on touch devices
  if (isTouch) {
    return (
      <CursorContext.Provider value={{ setCursorState, resetCursor }}>
        {children}
      </CursorContext.Provider>
    )
  }

  // ── RING STYLES BY STATE ────────────────────────────────────

  const ringStyles: Record<CursorState, string> = {
    default: 'w-8 h-8 border-white/60',
    hover: 'w-14 h-14 bg-[rgba(212,175,114,0.15)] border-gold/80 scale-100',
    text: 'w-0.5 h-6 rounded-none bg-[var(--gold)] border-transparent',
    view: 'w-14 h-14 bg-[rgba(212,175,114,0.12)] border-gold/60',
    drag: 'w-14 h-14 bg-[rgba(212,175,114,0.12)] border-gold/60',
    crosshair: 'w-10 h-10 border-white/40',
  }

  const dotHidden = cursorState === 'hover' || cursorState === 'text'
  const label = cursorLabels[cursorState]

  return (
    <CursorContext.Provider value={{ setCursorState, resetCursor }}>
      {/* DOT */}
      <div
        ref={dotRef}
        className={cn(
          'fixed top-0 left-0 z-[9999] pointer-events-none',
          'w-2 h-2 rounded-full bg-white',
          'transition-opacity duration-200',
          isVisible && !dotHidden ? 'opacity-100' : 'opacity-0'
        )}
        aria-hidden="true"
      />

      {/* RING */}
      <div
        ref={ringRef}
        className={cn(
          'fixed top-0 left-0 z-[9998] pointer-events-none',
          'rounded-full border flex items-center justify-center',
          'transition-all duration-300 ease-out',
          ringStyles[cursorState],
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
        aria-hidden="true"
      >
        {label && (
          <span className="text-[8px] font-sans font-bold tracking-[0.25em] text-[var(--gold)] uppercase select-none">
            {label}
          </span>
        )}
        {cursorState === 'crosshair' && (
          <>
            <div className="absolute w-4 h-px bg-white/60" />
            <div className="absolute w-px h-4 bg-white/60" />
          </>
        )}
      </div>

      {children}
    </CursorContext.Provider>
  )
}

// ── CURSOR TRIGGER HOOKS ──────────────────────────────────────
// Convenience wrappers for components that need cursor state

export function useCursorHover() {
  const { setCursorState, resetCursor } = useCursor()
  return {
    onMouseEnter: () => setCursorState('hover'),
    onMouseLeave: resetCursor,
  }
}

export function useCursorView() {
  const { setCursorState, resetCursor } = useCursor()
  return {
    onMouseEnter: () => setCursorState('view'),
    onMouseLeave: resetCursor,
  }
}

export function useCursorDrag() {
  const { setCursorState, resetCursor } = useCursor()
  return {
    onMouseEnter: () => setCursorState('drag'),
    onMouseLeave: resetCursor,
  }
}

export default CursorProvider
