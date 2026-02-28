'use client'

import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useCursor } from '@/components/layout/CustomCursor'

// ── CONSTANTS ─────────────────────────────────────────────────

const LINKS = {
  shop: [
    { label: 'Prom Dresses', href: '/prom' },
    { label: 'Bridal Collection', href: '/bridal' },
    { label: 'Tuxedos & Menswear', href: '/tux' },
    { label: 'All Styles', href: '/shop' },
    { label: 'Virtual Try-On', href: '/virtual-try-on' },
  ],
  services: [
    { label: 'Book an Appointment', href: '/appointments' },
    { label: 'Find a Store', href: '/stores' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  account: [
    { label: 'Sign In', href: '/login' },
    { label: 'Create Account', href: '/register' },
    { label: 'My Dashboard', href: '/dashboard' },
    { label: 'Vendor Portal', href: '/vendor/login' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Return Policy', href: '/returns' },
    { label: 'Sitemap', href: '/sitemap.xml' },
  ],
}

const SOCIAL = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/top10prom',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    href: 'https://pinterest.com/top10prom',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@top10prom',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    ),
  },
]

// ── NEWSLETTER FORM ───────────────────────────────────────────

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setCursorState, resetCursor } = useCursor()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)

    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSubmitted(true)
    } catch {
      // Fail silently — toast is shown at page level
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <p className="text-sm text-[var(--gold)] font-sans">
        ✦ Thank you — welcome to the Top 10 family.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className={cn(
          'flex-1 h-10 px-4 rounded',
          'bg-[var(--glass-light)] border border-white/10',
          'text-sm text-[var(--white-soft)] placeholder:text-[var(--white-soft)]/30 font-sans',
          'outline-none focus:border-gold/50',
          'transition-colors duration-200'
        )}
        style={{ cursor: 'text' }}
      />
      <button
        type="submit"
        disabled={loading}
        className={cn(
          'h-10 px-5 rounded',
          'bg-[var(--gold)] text-[var(--bg-primary)]',
          'text-[10px] font-sans font-semibold tracking-[0.2em] uppercase',
          'hover:bg-[var(--gold-light)] transition-colors disabled:opacity-60'
        )}
        style={{ cursor: 'none' }}
        onMouseEnter={() => setCursorState('hover')}
        onMouseLeave={resetCursor}
      >
        {loading ? '...' : 'Join'}
      </button>
    </form>
  )
}

// ── FOOTER ─────────────────────────────────────────────────────

export function Footer() {
  const { setCursorState, resetCursor } = useCursor()

  return (
    <footer className="relative bg-[var(--bg-secondary)] border-t border-white/8">
      {/* Gold gradient top edge */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent" />

      <div className="max-w-screen-xl mx-auto px-6 pt-16 pb-10">
        {/* Top: Brand + Newsletter */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-4 max-w-xs">
            <div>
              <p className="font-serif text-2xl text-[var(--gold)] tracking-[0.3em] uppercase leading-none">
                Top 10 Prom
              </p>
              <p className="text-xs text-[var(--white-soft)]/40 font-sans tracking-[0.2em] uppercase mt-1">
                Where Every Dream Dress Lives
              </p>
            </div>
            <p className="text-sm text-[var(--white-soft)]/50 font-sans leading-relaxed">
              Asheville's premier destination for prom, bridal, and formalwear,
              with 50+ boutique partner locations nationwide.
            </p>
            <p className="text-xs text-[var(--white-soft)]/30 font-sans">
              800-3 Fairview Rd, Asheville, NC 28803<br />
              828-774-5588
            </p>

            {/* Social */}
            <div className="flex gap-3 mt-2">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'w-9 h-9 flex items-center justify-center rounded-full',
                    'bg-[var(--glass-light)] border border-white/10',
                    'text-[var(--white-soft)]/50 hover:text-[var(--gold)] hover:border-gold/30',
                    'transition-all duration-200'
                  )}
                  style={{ cursor: 'none' }}
                  onMouseEnter={() => setCursorState('hover')}
                  onMouseLeave={resetCursor}
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs font-sans font-semibold tracking-[0.25em] uppercase text-[var(--gold)] mb-1">
                Style Insider
              </p>
              <p className="text-sm text-[var(--white-soft)]/50 font-sans">
                First access to new arrivals, exclusive offers, and trend alerts.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        {/* Middle: Link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {[
            { heading: 'Shop', links: LINKS.shop },
            { heading: 'Services', links: LINKS.services },
            { heading: 'Account', links: LINKS.account },
            { heading: 'Company', links: LINKS.legal },
          ].map((col) => (
            <div key={col.heading}>
              <p className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-[var(--gold)] mb-4">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--white-soft)]/50 hover:text-[var(--white-soft)] font-sans transition-colors duration-200"
                      style={{ cursor: 'none' }}
                      onMouseEnter={() => setCursorState('hover')}
                      onMouseLeave={resetCursor}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/8">
          <p className="text-xs text-[var(--white-soft)]/30 font-sans">
            © {new Date().getFullYear()} Top 10 Prom — Best Bride Prom & Tux — Merle Norman of Asheville. All rights reserved.
          </p>
          <p className="text-xs text-[var(--white-soft)]/20 font-sans">
            Crafted with care in Asheville, NC
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
