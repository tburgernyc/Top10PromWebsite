'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { MetricGrid } from '@/components/dashboard/MetricCard'
import { AnalyticsCharts } from '@/components/vendor/AnalyticsCharts'
import { InventoryTable } from '@/components/vendor/InventoryTable'
import { OrderManagementTable } from '@/components/vendor/OrderManagementTable'
import { MarketingAssetGrid } from '@/components/vendor/MarketingAssetGrid'
import { cn } from '@/lib/utils'
import { DRESSES, marketingAssets } from '@/lib/mock-data'
import type { Order } from '@/types'

// ── MOCK DATA ──────────────────────────────────────────────────

const VENDOR_METRICS = [
  { label: 'This Month Revenue', value: 28450, prefix: '$', accentColor: 'gold' as const, trend: 'up' as const, trendValue: '+12%' },
  { label: 'Orders', value: 47, accentColor: 'emerald' as const, trend: 'up' as const, trendValue: '+8%' },
  { label: 'Active Styles', value: 124, accentColor: 'blush' as const },
  { label: 'Low Stock Alerts', value: 3, accentColor: 'purple' as const, trend: 'down' as const, trendValue: '-2' },
]

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2024-001',
    customerId: 'cust_001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    total: 349,
    subtotal: 349,
    shippingCost: 0,
    status: 'processing',
    items: [{ dressId: 'd1', dressName: 'Midnight Cascade Gown', designer: 'Johnathan Kayne', imageUrl: '', color: 'Black', size: '6', quantity: 1, price: 349 }],
    shippingAddress: { fullName: 'Olivia Martinez', email: 'olivia@email.com', phone: '', line1: '', city: '', state: '', zip: '', country: 'US' },
  },
  {
    id: 'ORD-2024-002',
    customerId: 'cust_002',
    createdAt: new Date(Date.now() - 864e5).toISOString(),
    updatedAt: new Date(Date.now() - 864e5).toISOString(),
    total: 219,
    subtotal: 219,
    shippingCost: 0,
    status: 'confirmed',
    items: [{ dressId: 'd2', dressName: 'Golden Hour Sequin Dress', designer: 'Ashley Lauren', imageUrl: '', color: 'Gold', size: '4', quantity: 1, price: 219 }],
    shippingAddress: { fullName: 'Isabella Chen', email: 'isabella@email.com', phone: '', line1: '', city: '', state: '', zip: '', country: 'US' },
  },
  {
    id: 'ORD-2024-003',
    customerId: 'cust_003',
    createdAt: new Date(Date.now() - 2 * 864e5).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 864e5).toISOString(),
    total: 489,
    subtotal: 489,
    shippingCost: 0,
    status: 'shipped',
    items: [{ dressId: 'd3', dressName: 'Rose Garden A-Line', designer: 'Jessica Angel', imageUrl: '', color: 'Blush', size: '8', quantity: 1, price: 489 }],
    shippingAddress: { fullName: 'Sophie Williams', email: 'sophie@email.com', phone: '', line1: '', city: '', state: '', zip: '', country: 'US' },
  },
  {
    id: 'ORD-2024-004',
    customerId: 'cust_004',
    createdAt: new Date(Date.now() - 3 * 864e5).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 864e5).toISOString(),
    total: 179,
    subtotal: 179,
    shippingCost: 0,
    status: 'delivered',
    items: [{ dressId: 'd4', dressName: 'Ethereal Tulle Ballgown', designer: 'Tiffany Designs', imageUrl: '', color: 'White', size: '10', quantity: 1, price: 179 }],
    shippingAddress: { fullName: 'Emma Johnson', email: 'emma@email.com', phone: '', line1: '', city: '', state: '', zip: '', country: 'US' },
  },
]

const VENDOR_INVENTORY = DRESSES.slice(0, 20)

// ── TABS ──────────────────────────────────────────────────────

const TABS = ['Analytics', 'Orders', 'Inventory', 'Marketing', 'Settings'] as const
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

export default function VendorDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('Analytics')

  // Defense-in-depth auth + role check — middleware is the primary guard,
  // this prevents accidental renders if middleware config changes.
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace('/vendor/login')
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      if (profile?.role !== 'vendor') {
        router.replace('/dashboard')
      }
    })
  }, [router])

  return (
    <main className="min-h-screen pt-20 pb-24 px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="py-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-[var(--gold)]">Partner Portal</p>
          <h1 className="font-serif text-4xl text-[var(--white-soft)]">Vendor Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--glass-light)] border border-white/10">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-sans text-[var(--white-soft)]/50">Asheville Flagship</span>
        </div>
      </div>

      <MetricGrid metrics={VENDOR_METRICS} className="mb-10" />

      <TabNav active={activeTab} onChange={setActiveTab} />

      {activeTab === 'Analytics' && <AnalyticsCharts />}
      {activeTab === 'Orders' && <OrderManagementTable orders={MOCK_ORDERS} />}
      {activeTab === 'Inventory' && <InventoryTable dresses={VENDOR_INVENTORY} />}
      {activeTab === 'Marketing' && <MarketingAssetGrid assets={marketingAssets} />}
      {activeTab === 'Settings' && (
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="font-serif text-2xl text-[var(--white-soft)]">Partner Settings</h2>
          <div className="p-6 rounded-2xl bg-[var(--glass-light)] border border-white/10">
            <p className="text-sm font-sans text-[var(--white-soft)]/50">
              Contact your Top 10 Prom account manager to update store details, adjust commission rates, or modify your partner agreement.
            </p>
            <a href="mailto:partners@top10prom.com" className="inline-block mt-4 text-xs font-sans text-[var(--gold)]/70 hover:text-[var(--gold)] transition-colors" style={{ cursor: 'none' }}>
              partners@top10prom.com →
            </a>
          </div>
        </div>
      )}
    </main>
  )
}
