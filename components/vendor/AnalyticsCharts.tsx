'use client'

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import type { VendorAnalytics } from '@/types'

// ── BRAND COLORS ──────────────────────────────────────────────

const GOLD = '#D4AF72'
const BLUSH = '#F2B5C7'
const PURPLE = '#9B6FD4'
const EMERALD = '#10B981'

// ── CUSTOM TOOLTIP ─────────────────────────────────────────────

function BrandTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--bg-elevated)] border border-white/15 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs font-sans font-semibold text-[var(--white-soft)]/50 mb-2 tracking-[0.1em] uppercase">
        {label}
      </p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-[var(--white-soft)]/70 font-sans">{entry.name}:</span>
          <span className="text-xs font-sans font-semibold text-[var(--white-soft)]">
            {typeof entry.value === 'number' && entry.name?.toLowerCase().includes('revenue')
              ? formatPrice(entry.value)
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── REVENUE TREND CHART ────────────────────────────────────────

interface RevenueTrendProps {
  data: { month: string; revenue: number; orders: number }[]
  className?: string
}

export function RevenueTrendChart({ data, className }: RevenueTrendProps) {
  return (
    <div className={cn('p-6 rounded-2xl bg-[var(--glass-light)] border border-white/10', className)}>
      <div className="mb-4">
        <h3 className="text-xs font-sans font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">
          Revenue Trend
        </h3>
        <p className="text-[10px] text-[var(--white-soft)]/40 font-sans mt-0.5">Last 12 months</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="month"
            tick={{ fill: 'rgba(248,244,240,0.35)', fontSize: 10, fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(248,244,240,0.35)', fontSize: 10, fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<BrandTooltip />} />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke={GOLD}
            strokeWidth={2}
            dot={{ fill: GOLD, strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: GOLD }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── TOP STYLES CHART ───────────────────────────────────────────

interface TopStylesProps {
  data: { name: string; units: number; revenue: number }[]
  className?: string
}

export function TopStylesChart({ data, className }: TopStylesProps) {
  return (
    <div className={cn('p-6 rounded-2xl bg-[var(--glass-light)] border border-white/10', className)}>
      <div className="mb-4">
        <h3 className="text-xs font-sans font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">
          Top Styles by Units Sold
        </h3>
        <p className="text-[10px] text-[var(--white-soft)]/40 font-sans mt-0.5">This season</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 4, bottom: 0, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: 'rgba(248,244,240,0.35)', fontSize: 10, fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: 'rgba(248,244,240,0.50)', fontSize: 10, fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
            width={100}
          />
          <Tooltip content={<BrandTooltip />} />
          <Bar dataKey="units" name="Units" fill={GOLD} radius={[0, 4, 4, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── OCCASION BREAKDOWN PIE ─────────────────────────────────────

interface OccasionBreakdownProps {
  data: { name: string; value: number }[]
  className?: string
}

const PIE_COLORS = [GOLD, BLUSH, PURPLE, EMERALD, '#60A5FA', '#FB923C']

export function OccasionBreakdownChart({ data, className }: OccasionBreakdownProps) {
  return (
    <div className={cn('p-6 rounded-2xl bg-[var(--glass-light)] border border-white/10', className)}>
      <div className="mb-4">
        <h3 className="text-xs font-sans font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">
          Sales by Occasion
        </h3>
      </div>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="50%" height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2">
          {data.map((entry, i) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
              />
              <span className="text-xs text-[var(--white-soft)]/60 font-sans">{entry.name}</span>
              <span className="text-xs font-sans font-semibold text-[var(--white-soft)]/80 ml-auto">
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── ORDERS vs REVENUE DUAL CHART ───────────────────────────────

interface DualMetricProps {
  data: { month: string; orders: number; revenue: number }[]
  className?: string
}

export function DualMetricChart({ data, className }: DualMetricProps) {
  return (
    <div className={cn('p-6 rounded-2xl bg-[var(--glass-light)] border border-white/10', className)}>
      <div className="mb-4">
        <h3 className="text-xs font-sans font-semibold tracking-[0.2em] uppercase text-[var(--gold)]">
          Orders & Revenue
        </h3>
        <p className="text-[10px] text-[var(--white-soft)]/40 font-sans mt-0.5">Comparative view</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="month"
            tick={{ fill: 'rgba(248,244,240,0.35)', fontSize: 10, fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: 'rgba(248,244,240,0.35)', fontSize: 10, fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: 'rgba(248,244,240,0.35)', fontSize: 10, fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<BrandTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 10, fontFamily: 'DM Sans', color: 'rgba(248,244,240,0.5)' }}
          />
          <Bar yAxisId="left" dataKey="orders" name="Orders" fill={BLUSH} radius={[4, 4, 0, 0]} maxBarSize={24} />
          <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill={GOLD} radius={[4, 4, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueTrendChart
