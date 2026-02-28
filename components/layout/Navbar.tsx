'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useCursor } from '@/components/layout/CustomCursor'

// ── NAV ITEMS ─────────────────────────────────────────────────

const navItems = [
  { label: 'Prom', href: '/prom' },
  { label: 'Bridal', href: '/bridal' },
  { label: 'Tuxedo', href: '/tux' },
  { label: 'Shop', href: '/shop' },
  { label: 'Stores', href: '/stores' },
  { label: 'About', href: '/about' },
] as const

// ── MOBILE MENU ───────────────────────────────────────────────

function MobileMenu({
  isOpen,
  onClose,
  pathname,
}: {
  isOpen: boolean
  onClose: () => void
  pathname: string
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-bg-primary/80 backdrop-blur-lg"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="mobile-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'fixed top-0 right-0 bottom-0 z-50 w-72',
              'bg-[var(--bg-elevated)] border-l border-white/10',
              'flex flex-col'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <span className="font-serif text-lg text-[var(--gold)] tracking-[0.2em] uppercase">
                Menu
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-[var(--white-soft)]/60 hover:text-[var(--white-soft)]"
                style={{ cursor: 'none' }}
                aria-label="Close menu"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1 p-4 flex-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center px-4 py-3 rounded-xl',
                      'font-serif text-lg transition-colors',
                      pathname === item.href
                        ? 'text-[var(--gold)] bg-[var(--glass-gold)]'
                        : 'text-[var(--white-soft)]/80 hover:text-[var(--white-soft)] hover:bg-white/5'
                    )}
                    style={{ cursor: 'none' }}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Footer actions */}
            <div className="p-6 border-t border-white/10 flex flex-col gap-3">
              <Link
                href="/appointments"
                onClick={onClose}
                className="w-full flex items-center justify-center h-12 rounded px-6 bg-[var(--gold)] text-[var(--bg-primary)] text-xs font-sans font-semibold tracking-[0.2em] uppercase"
                style={{ cursor: 'none' }}
              >
                Book Appointment
              </Link>
              <Link
                href="/login"
                onClick={onClose}
                className="w-full flex items-center justify-center h-12 rounded px-6 border border-white/20 text-[var(--white-soft)]/70 text-xs font-sans font-semibold tracking-[0.2em] uppercase"
                style={{ cursor: 'none' }}
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── NAVBAR ─────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { setCursorState, resetCursor } = useCursor()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[80]',
          'transition-all duration-500',
          scrolled
            ? 'py-3 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
            : 'py-5 bg-transparent'
        )}
      >
        <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col leading-none select-none"
            style={{ cursor: 'none' }}
            onMouseEnter={() => setCursorState('hover')}
            onMouseLeave={resetCursor}
          >
            <span className="font-serif text-[var(--gold)] tracking-[0.35em] uppercase text-base">
              Top 10
            </span>
            <span className="font-sans text-[7px] text-[var(--gold)]/50 tracking-[0.6em] uppercase font-semibold">
              Prom
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative text-xs font-sans font-semibold tracking-[0.2em] uppercase transition-colors duration-200',
                    isActive
                      ? 'text-[var(--gold)]'
                      : 'text-[var(--white-soft)]/60 hover:text-[var(--white-soft)]'
                  )}
                  style={{ cursor: 'none' }}
                  onMouseEnter={() => setCursorState('hover')}
                  onMouseLeave={resetCursor}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--gold)]"
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Try On */}
            <Link
              href="/virtual-try-on"
              className="text-xs font-sans font-semibold tracking-[0.18em] uppercase text-[var(--white-soft)]/50 hover:text-[var(--blush)] transition-colors"
              style={{ cursor: 'none' }}
              onMouseEnter={() => setCursorState('hover')}
              onMouseLeave={resetCursor}
            >
              Try On ✦
            </Link>

            {/* Appointments CTA */}
            <Link
              href="/appointments"
              className={cn(
                'h-9 flex items-center px-5 rounded',
                'bg-[var(--gold)] text-[var(--bg-primary)]',
                'text-[10px] font-sans font-semibold tracking-[0.2em] uppercase',
                'hover:bg-[var(--gold-light)] transition-colors duration-200'
              )}
              style={{ cursor: 'none' }}
              onMouseEnter={() => setCursorState('hover')}
              onMouseLeave={resetCursor}
            >
              Book Now
            </Link>

            {/* Account */}
            <Link
              href="/dashboard"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--glass-light)] border border-white/10 text-[var(--white-soft)]/60 hover:text-[var(--white-soft)] hover:border-gold/30 transition-all"
              style={{ cursor: 'none' }}
              onMouseEnter={() => setCursorState('hover')}
              onMouseLeave={resetCursor}
              aria-label="Account"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              href="/shop"
              className="relative w-9 h-9 flex items-center justify-center rounded-full bg-[var(--glass-light)] border border-white/10 text-[var(--white-soft)]/60 hover:text-[var(--white-soft)] hover:border-gold/30 transition-all"
              style={{ cursor: 'none' }}
              onMouseEnter={() => setCursorState('hover')}
              onMouseLeave={resetCursor}
              aria-label="Shopping cart"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-[var(--glass-light)] border border-white/10 text-[var(--white-soft)]/70"
            style={{ cursor: 'none' }}
            aria-label="Open menu"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        pathname={pathname}
      />
    </>
  )
}

export default Navbar
