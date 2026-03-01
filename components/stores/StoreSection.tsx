'use client'

import { useState, useMemo } from 'react'
import { RegionFilter } from '@/components/stores/RegionFilter'
import { StoreList } from '@/components/stores/StoreCard'
import type { Store } from '@/types'

// ── TYPES ─────────────────────────────────────────────────────

interface StoreSectionProps {
  stores: Store[]
  className?: string
}

// ── DERIVED REGIONS ───────────────────────────────────────────

function getRegions(stores: Store[]): string[] {
  const seen = new Set<string>()
  const regions: string[] = []
  for (const store of stores) {
    if (store.region && !seen.has(store.region)) {
      seen.add(store.region)
      regions.push(store.region)
    }
  }
  return regions.sort()
}

// ── STORE SECTION (Client Wrapper) ────────────────────────────

export function StoreSection({ stores, className }: StoreSectionProps) {
  const [selectedRegion, setSelectedRegion] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const regions = useMemo(() => getRegions(stores), [stores])

  const filteredStores = useMemo(() => {
    let result = stores

    if (selectedRegion) {
      result = result.filter((s) => s.region === selectedRegion)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.state.toLowerCase().includes(q) ||
          s.zip.toLowerCase().includes(q)
      )
    }

    return result
  }, [stores, selectedRegion, searchQuery])

  return (
    <div className={className}>
      <RegionFilter
        regions={regions}
        selectedRegion={selectedRegion}
        onSelect={setSelectedRegion}
        onSearch={setSearchQuery}
        className="mb-6"
      />
      <StoreList stores={filteredStores} />
    </div>
  )
}

export default StoreSection
