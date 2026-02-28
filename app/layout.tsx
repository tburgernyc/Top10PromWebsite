import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { LenisProvider } from '@/components/layout/LenisProvider'
import { CursorProvider } from '@/components/layout/CustomCursor'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PageTransition } from '@/components/layout/PageTransition'
import { ToastProvider } from '@/components/ui/Toast'

// ── FONTS ─────────────────────────────────────────────────────

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

// ── METADATA ───────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://top10prom.com'),
  title: {
    default: 'Top 10 Prom | Luxury Prom, Bridal & Formalwear',
    template: '%s | Top 10 Prom',
  },
  description:
    'Discover the most stunning prom dresses, bridal gowns, and tuxedos at Top 10 Prom. Serving Asheville, NC and 50+ boutique locations nationwide. Book your styling appointment today.',
  keywords: [
    'prom dresses',
    'bridal gowns',
    'tuxedos',
    'formalwear',
    'Asheville NC',
    'prom 2026',
    'evening gowns',
    'Johnathan Kayne',
    'Ashley Lauren',
    'Jessica Angel',
  ],
  authors: [{ name: 'Top 10 Prom', url: 'https://top10prom.com' }],
  creator: 'Top 10 Prom',
  publisher: 'Best Bride Prom & Tux — Merle Norman of Asheville',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Top 10 Prom',
    title: 'Top 10 Prom | Luxury Prom, Bridal & Formalwear',
    description:
      'Discover the most stunning prom dresses, bridal gowns, and tuxedos. Asheville NC and 50+ locations nationwide.',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Top 10 Prom — Luxury Formalwear',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top 10 Prom | Luxury Prom, Bridal & Formalwear',
    description:
      'Discover the most stunning prom dresses, bridal gowns, and tuxedos. Asheville NC and 50+ locations nationwide.',
    images: ['/og-default.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#0A0A14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// ── ROOT LAYOUT ────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-[var(--bg-primary)] text-[var(--white-soft)] antialiased overflow-x-hidden">
        <LenisProvider>
          <CursorProvider>
            <ToastProvider>
              {/* Global cursor is rendered inside CursorProvider */}
              <Navbar />

              <PageTransition>
                <main id="main-content" tabIndex={-1}>
                  {children}
                </main>
              </PageTransition>

              <Footer />
            </ToastProvider>
          </CursorProvider>
        </LenisProvider>
      </body>
    </html>
  )
}
