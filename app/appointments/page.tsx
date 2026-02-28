import type { Metadata } from 'next'
import { ConversationalForm } from '@/components/appointments/ConversationalForm'
import { ChatWidget } from '@/components/chat/ChatWidget'

export const metadata: Metadata = {
  title: 'Book an Appointment | Top 10 Prom',
  description: 'Book a complimentary styling appointment at any of our 50+ Top 10 Prom partner boutiques. Personal stylists, private suites, and no-pressure service.',
  openGraph: {
    title: 'Book an Appointment | Top 10 Prom',
    description: 'Complimentary, personalized styling appointments at 50+ locations.',
    images: [{ url: 'https://picsum.photos/seed/appt-og/1200/630', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://top10prom.com'}/appointments` },
}

export default function AppointmentsPage() {
  return (
    <>
      <main className="min-h-screen pt-20 pb-24">
        <div className="px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start pt-12">
            {/* Left — info */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <p className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-[var(--gold)]">Complimentary</p>
                <h1 className="font-serif text-5xl md:text-6xl text-[var(--white-soft)] leading-tight">
                  Book Your<br />Appointment
                </h1>
                <div className="h-px w-12 bg-gradient-to-r from-[var(--gold)] to-transparent" />
                <p className="text-base font-sans text-[var(--white-soft)]/50 leading-relaxed max-w-md">
                  Our personalized styling appointments are complimentary and completely pressure-free. Just you, your party, and a stylist who genuinely cares about finding your perfect look.
                </p>
              </div>

              {/* What to expect */}
              <div className="flex flex-col gap-4">
                <p className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[var(--white-soft)]/30">What to Expect</p>
                {[
                  { icon: '◇', title: '60–90 minutes', desc: 'Dedicated time with your personal stylist' },
                  { icon: '✦', title: 'Private suite', desc: 'Your own space to try on as many styles as you like' },
                  { icon: '◈', title: 'Expert guidance', desc: 'Silhouette, color, accessories — we cover everything' },
                  { icon: '♛', title: 'Zero pressure', desc: 'Take your time. You won\'t be rushed.' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4">
                    <span className="text-[var(--gold)]/50 text-base mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-sm font-sans font-semibold text-[var(--white-soft)]/80">{item.title}</p>
                      <p className="text-xs font-sans text-[var(--white-soft)]/40 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ */}
              <div className="flex flex-col gap-3 border-t border-white/8 pt-6">
                {[
                  { q: 'Is there a cost to book?', a: 'No — all styling appointments are 100% complimentary.' },
                  { q: 'Can I bring friends and family?', a: 'Absolutely. Bring whoever you\'d like to share the experience.' },
                  { q: 'What should I bring?', a: 'Just yourself! If you have inspiration photos, bring those too.' },
                ].map(faq => (
                  <div key={faq.q}>
                    <p className="text-xs font-sans font-semibold text-[var(--white-soft)]/60 mb-1">{faq.q}</p>
                    <p className="text-xs font-sans text-[var(--white-soft)]/35 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div className="bg-[var(--glass-light)] border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md">
              <ConversationalForm />
            </div>
          </div>
        </div>
      </main>

      <ChatWidget pageContext="appointments" />
    </>
  )
}
