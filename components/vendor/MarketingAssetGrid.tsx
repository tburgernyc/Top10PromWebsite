'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { GoldButton, GhostButton } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import type { MarketingAsset } from '@/types'

// ── ASSET CARD ─────────────────────────────────────────────────

interface AssetCardProps {
  asset: MarketingAsset
  onDownload?: (asset: MarketingAsset) => void
  onCopyLink?: (asset: MarketingAsset) => void
}

function AssetCard({ asset, onDownload, onCopyLink }: AssetCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (asset.url) {
      await navigator.clipboard.writeText(asset.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
    onCopyLink?.(asset)
  }

  const typeIcon = {
    image: '🖼',
    video: '🎬',
    pdf: '📄',
    banner: '🎨',
    social: '📱',
  }[asset.type] ?? '📁'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-3 rounded-2xl bg-[var(--glass-light)] border border-white/10 overflow-hidden hover:border-gold/25 transition-all group"
    >
      {/* Preview */}
      <div className="relative aspect-video bg-[var(--glass-medium)] overflow-hidden">
        {asset.thumbnail || asset.url ? (
          <Image
            src={asset.thumbnail ?? asset.url ?? `https://picsum.photos/seed/${asset.id}/400/225`}
            alt={asset.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl">
            {typeIcon}
          </div>
        )}

        {/* Type badge overlay */}
        <div className="absolute top-2 left-2">
          <Badge variant="glass" size="sm">
            {asset.type}
          </Badge>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[var(--bg-primary)]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
          <button
            onClick={() => onDownload?.(asset)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[var(--gold)] text-[var(--bg-primary)] hover:bg-[var(--gold-light)] transition-colors"
            style={{ cursor: 'none' }}
            aria-label="Download"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>
          <button
            onClick={handleCopy}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 text-[var(--white-soft)] hover:bg-white/25 transition-colors"
            style={{ cursor: 'none' }}
            aria-label="Copy link"
          >
            {copied ? (
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        <h4 className="text-sm font-sans text-[var(--white-soft)] line-clamp-1">{asset.name}</h4>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[var(--white-soft)]/40 font-sans">
            {asset.dimensions ?? ''} {asset.file_size ? `· ${asset.file_size}` : ''}
          </span>
          {asset.season && (
            <span className="text-[10px] text-[var(--gold)]/60 font-sans font-semibold uppercase tracking-[0.1em]">
              {asset.season}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── MARKETING ASSET GRID ───────────────────────────────────────

interface MarketingAssetGridProps {
  assets: MarketingAsset[]
  className?: string
  onDownload?: (asset: MarketingAsset) => void
  onCopyLink?: (asset: MarketingAsset) => void
}

const ASSET_TYPES = ['all', 'image', 'video', 'pdf', 'banner', 'social']

export function MarketingAssetGrid({
  assets,
  className,
  onDownload,
  onCopyLink,
}: MarketingAssetGridProps) {
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = assets.filter((a) => {
    const matchesType = typeFilter === 'all' || a.type === typeFilter
    const matchesSearch =
      !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const handleDownloadAll = () => {
    filtered.forEach((a) => onDownload?.(a))
  }

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      {/* Header + controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {ASSET_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-sans font-semibold tracking-[0.1em] uppercase border transition-all',
                typeFilter === t
                  ? 'bg-[var(--glass-gold)] border-gold/40 text-[var(--gold)]'
                  : 'bg-[var(--glass-light)] border-white/10 text-[var(--white-soft)]/50 hover:border-gold/25'
              )}
              style={{ cursor: 'none' }}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className="h-9 px-3 rounded-xl bg-[var(--glass-medium)] border border-white/10 text-xs text-[var(--white-soft)] placeholder:text-[var(--white-soft)]/25 font-sans outline-none focus:border-gold/40 transition-colors"
            style={{ cursor: 'text' }}
          />
          <GhostButton size="sm" onClick={handleDownloadAll}>
            Download All
          </GhostButton>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="font-serif text-lg text-[var(--white-soft)]/30">
            No assets in this category yet.
          </p>
          <p className="text-xs text-[var(--white-soft)]/20 font-sans mt-1">
            New marketing materials are added each season.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onDownload={onDownload}
              onCopyLink={onCopyLink}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-[var(--white-soft)]/30 font-sans">
        {filtered.length} of {assets.length} assets
      </p>
    </div>
  )
}

export default MarketingAssetGrid
