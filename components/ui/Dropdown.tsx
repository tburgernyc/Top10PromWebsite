'use client'

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ── TYPES ─────────────────────────────────────────────────────

type DropdownPlacement = 'bottom' | 'bottom-left' | 'bottom-right' | 'top'

interface DropdownItem {
  label: string
  value: string
  icon?: ReactNode
  colorHex?: string
  disabled?: boolean
}

interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  onSelect: (value: string) => void
  selectedValue?: string
  placeholder?: string
  placement?: DropdownPlacement
  className?: string
  maxHeight?: number
  multiSelect?: boolean
  selectedValues?: string[]
}

// ── PLACEMENT STYLES ──────────────────────────────────────────

const placementStyles: Record<DropdownPlacement, string> = {
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  'bottom-left': 'top-full left-0 mt-2',
  'bottom-right': 'top-full right-0 mt-2',
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
}

// ── COMPONENT ─────────────────────────────────────────────────

export function Dropdown({
  trigger,
  items,
  onSelect,
  selectedValue,
  placement = 'bottom-left',
  className,
  maxHeight = 300,
  multiSelect = false,
  selectedValues = [],
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const toggle = useCallback(() => setIsOpen((v) => !v), [])
  const close = useCallback(() => setIsOpen(false), [])

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, close])

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, close])

  const handleSelect = useCallback(
    (value: string) => {
      onSelect(value)
      if (!multiSelect) close()
    },
    [onSelect, multiSelect, close]
  )

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger */}
      <div onClick={toggle} style={{ cursor: 'none' }}>
        {trigger}
      </div>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'absolute z-50 min-w-[180px]',
              'bg-[var(--bg-elevated)] rounded-xl',
              'border border-gold/35',
              'shadow-[0_8px_40px_rgba(0,0,0,0.5)]',
              'overflow-hidden',
              placementStyles[placement]
            )}
            style={{ maxHeight }}
          >
            <div className="overflow-y-auto" style={{ maxHeight }}>
              {items.map((item) => {
                const isSelected = multiSelect
                  ? selectedValues.includes(item.value)
                  : selectedValue === item.value

                return (
                  <button
                    key={item.value}
                    onClick={() => !item.disabled && handleSelect(item.value)}
                    disabled={item.disabled}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-2.5',
                      'text-left text-sm font-sans',
                      'transition-colors duration-150',
                      'disabled:opacity-40 disabled:cursor-not-allowed',
                      isSelected
                        ? 'bg-gold/15 text-gold'
                        : 'text-white-soft/80 hover:bg-white/5 hover:text-white-soft'
                    )}
                    style={{ cursor: 'none' }}
                  >
                    {/* Color swatch */}
                    {item.colorHex && (
                      <span
                        className={cn(
                          'w-5 h-5 rounded-full flex-shrink-0 border',
                          isSelected ? 'border-gold' : 'border-white/20'
                        )}
                        style={{ backgroundColor: item.colorHex }}
                      />
                    )}
                    {/* Icon */}
                    {item.icon && (
                      <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>
                    )}
                    {/* Label */}
                    <span>{item.label}</span>
                    {/* Check */}
                    {isSelected && (
                      <svg
                        className="ml-auto w-4 h-4 text-gold flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── FILTER DROPDOWN (for filter bars) ────────────────────────

interface FilterDropdownProps {
  label: string
  items: DropdownItem[]
  onSelect: (value: string) => void
  selectedValue?: string
  isActive?: boolean
  className?: string
}

export function FilterDropdown({
  label,
  items,
  onSelect,
  selectedValue,
  isActive,
  className,
}: FilterDropdownProps) {
  const trigger = (
    <button
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-xl',
        'text-xs font-sans font-semibold tracking-[0.15em] uppercase',
        'border transition-all duration-200',
        'backdrop-blur-sm',
        isActive
          ? 'bg-gold/20 border-gold/50 text-gold'
          : 'bg-[var(--glass-light)] border-white/10 text-white-soft/70 hover:border-gold/30 hover:text-white-soft',
        className
      )}
      style={{ cursor: 'none' }}
    >
      {label}
      <svg
        className={cn(
          'w-3 h-3 transition-transform duration-200',
          isActive && 'rotate-180'
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )

  return (
    <Dropdown
      trigger={trigger}
      items={items}
      onSelect={onSelect}
      selectedValue={selectedValue}
      placement="bottom-left"
    />
  )
}

export default Dropdown
