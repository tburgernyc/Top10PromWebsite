'use client'

import { useState } from 'react'
import { FilterPanel, applyFilters } from '@/components/shop/FilterPanel'
import { ProductGrid } from '@/components/shop/ProductGrid'
import type { Dress, FilterState } from '@/types'

const DEFAULT_FILTERS: FilterState = {
  occasion: '',
  color: '',
  priceRange: '',
  size: '',
  designer: '',
  sortBy: 'featured',
  inStock: false,
  onSale: false,
  isNew: false,
  searchQuery: '',
}

interface FilteredGridProps {
  dresses: Dress[]
  showLoadMore?: boolean
}

export function FilteredGrid({ dresses, showLoadMore }: FilteredGridProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const filtered = applyFilters(dresses, filters)

  return (
    <>
      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        totalResults={filtered.length}
        variant="bar"
        className="mb-10"
      />
      <ProductGrid dresses={filtered} showLoadMore={showLoadMore} />
    </>
  )
}
