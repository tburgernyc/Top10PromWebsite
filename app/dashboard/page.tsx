'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { MetricGrid } from '@/components/dashboard/MetricCard'
import { StyleDNACard } from '@/components/dashboard/StyleDNACard'
import { OrderHistoryTable } from '@/components/dashboard/OrderHistoryTable'
import { AppointmentList } from '@/components/dashboard/AppointmentCard'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { cn } from '@/lib/utils'
import { DRESSES } from '@/lib/mock-data'
import type { Order, Appointment } from '@/types'

// ── MOCK DATA ──────────────────────────────────────────────────

const MOCK_ORDERS: Order[] = [
  {
    id: 'ord_001',
    customerId: 'user_001',
    createdAt: new Date(Date.now() - 7 * 864e5).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 864e5).toISOString(),
    total: 349,
    subtotal: 325,
    shippingCost: 0,
    status: 'delivered',
    items: [{
      dressId: 'd1',
      dressName: 'Midnight Cascade Gown',
      designer: 'Johnathan Kayne',
      imageUrl: 'https://picsum.photos/seed/gown-a/100/133',
      color: 'Midnight Black',
      size: '6',
      quantity: 1,
      price: 349,
    }],
    shippingAddress: {
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '828-555-1234',
      line1: '123 Main St',
      city: 'Asheville',
      state: 'NC',
      zip: '28803',
      country: 'US',
    },
    trackingNumber: '1Z999AA10123456784',
  },
  {
    id: 'ord_002',
    customerId: 'user_001',
    createdAt: new Date(Date.now() - 30 * 864e5).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 864e5).toISOString(),
    total: 219,
    subtotal: 205,
    shippingCost: 0,
    status: 'shipped',
    items: [{
      dressId: 'd2',
      dressName: 'Golden Hour Sequin Dress',
      designer: 'Ashley Lauren',
      imageUrl: 'https://picsum.photos/seed/gown-b/100/133',
      color: 'Gold',
      size: '4',
      quantity: 1,
      price: 219,
    }],
    shippingAddress: {
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '828-555-1234',
      line1: '456 Oak Ave',
      city: 'Charlotte',
      state: 'NC',
      zip: '28201',
      country: 'US',
    },
    trackingNumber: '1Z999AA10123456785',
  },
]

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_001',
    customerId: 'user_001',
    storeId: 1,
    storeName: 'Best Bride Prom & Tux — Asheville',
    occasion: 'prom',
    appointmentDate: new Date(Date.now() + 5 * 864e5).toISOString(),
    appointmentTime: '2:00 PM',
    partySize: 1,
    status: 'confirmed',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '828-555-1234',
    createdAt: new Date().toISOString(),
  },
]

const DASHBOARD_METRICS = [
  { label: 'Loyalty Points', value: 1240, suffix: ' pts', accent: 'gold' as const },
  { label: 'Orders', value: 2, accent: 'emerald' as const },
  { label: 'Wishlist', value: 8, accent: 'blush' as const },
  { label: 'Upcoming Appts', value: 1, accent: 'purple' as const },
]

// ── TAB NAV ───────────────────────────────────────────────────

const TABS = ['Overview', 'Wishlist', 'Orders', 'Appointments', 'Profile'] as const
type Tab = typeof TABS[number]

function TabNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="flex gap-1 border-b border-white/8 mb-8 overflow-x-auto scrollbar-none">
      {TABS.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            'flex-shrink-0 px-4 py-3 text-xs font-sans font-semibold tracking-[0.1em] uppercase transition-all border-b-2 -mb-px',
            active === tab
              ? 'border-[var(--gold)] text-[var(--gold)]'
              : 'border-transparent text-[var(--white-soft)]/35 hover:text-[var(--white-soft)]/60'
          )}
          style={{ cursor: 'none' }}
        >
          {tab}
        </button>
      ))}
    </nav>
  )
}

// ── PAGE ──────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('Overview')

  // Defense-in-depth auth check — middleware is the primary guard,
  // this prevents accidental renders if middleware config changes.
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace('/login')
    })
  }, [router])

  const wishlisted = DRESSES.slice(0, 8)

  return (
    <>
      <main className="min-h-screen pt-20 pb-24 px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="py-10 flex flex-col gap-1">
          <p className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-[var(--gold)]">My Account</p>
          <h1 className="font-serif text-4xl text-[var(--white-soft)]">Welcome back</h1>
        </div>

        <TabNav active={activeTab} onChange={setActiveTab} />

        {/* Overview */}
        {activeTab === 'Overview' && (
          <div className="flex flex-col gap-12">
            <MetricGrid metrics={DASHBOARD_METRICS} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="font-serif text-2xl text-[var(--white-soft)] mb-6">Your Style DNA</h2>
                <StyleDNACard />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[var(--white-soft)] mb-6">Upcoming Appointments</h2>
                <AppointmentList appointments={MOCK_APPOINTMENTS} />
              </div>
            </div>
          </div>
        )}

        {/* Wishlist */}
        {activeTab === 'Wishlist' && (
          <div>
            <h2 className="font-serif text-2xl text-[var(--white-soft)] mb-8">Saved Styles</h2>
            <ProductGrid dresses={wishlisted} />
          </div>
        )}

        {/* Orders */}
        {activeTab === 'Orders' && (
          <div>
            <h2 className="font-serif text-2xl text-[var(--white-soft)] mb-8">Order History</h2>
            <OrderHistoryTable orders={MOCK_ORDERS} />
          </div>
        )}

        {/* Appointments */}
        {activeTab === 'Appointments' && (
          <div>
            <h2 className="font-serif text-2xl text-[var(--white-soft)] mb-8">My Appointments</h2>
            <AppointmentList appointments={MOCK_APPOINTMENTS} />
          </div>
        )}

        {/* Profile */}
        {activeTab === 'Profile' && (
          <div className="max-w-lg flex flex-col gap-6">
            <h2 className="font-serif text-2xl text-[var(--white-soft)]">Profile Settings</h2>
            <div className="flex flex-col gap-4 p-6 rounded-2xl bg-[var(--glass-light)] border border-white/10">
              {['First Name', 'Last Name', 'Email', 'Phone'].map(field => (
                <div key={field} className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-sans font-semibold tracking-[0.15em] uppercase text-[var(--white-soft)]/30">{field}</label>
                  <input
                    type={field === 'Email' ? 'email' : field === 'Phone' ? 'tel' : 'text'}
                    placeholder={`Enter your ${field.toLowerCase()}`}
                    className="px-4 py-2.5 rounded-xl bg-[var(--glass-light)] border border-white/10 text-sm font-sans text-[var(--white-soft)]/70 placeholder-[var(--white-soft)]/20 focus:outline-none focus:border-gold/40 transition-colors"
                    style={{ cursor: 'none' }}
                  />
                </div>
              ))}
              <button
                className="mt-2 h-11 px-6 bg-[var(--gold)] text-[var(--bg-primary)] text-xs font-sans font-bold tracking-[0.15em] uppercase self-start hover:opacity-90 transition-opacity"
                style={{ cursor: 'none' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </main>

      <ChatWidget pageContext="dashboard" />
    </>
  )
}
