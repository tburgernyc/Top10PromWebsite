'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'
import type { Store } from '@/types'

// ── TYPES ─────────────────────────────────────────────────────

interface StoreMapProps {
  stores: Store[]
  selectedStore?: Store | null
  onStoreSelect?: (store: Store) => void
  className?: string
}

// ── MAPBOX MAP COMPONENT (CSR only) ──────────────────────────

function StoreMapInner({ stores, selectedStore, onStoreSelect, className }: StoreMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)

  // HQ location (Best Bride Prom & Tux — Merle Norman of Asheville)
  const HQ_LNG = -82.5516
  const HQ_LAT = 35.5396

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) return

    const initMap = async () => {
      const mapboxgl = (await import('mapbox-gl')).default
      await import('mapbox-gl/dist/mapbox-gl.css')

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

      const map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [HQ_LNG, HQ_LAT],
        zoom: 5,
        pitch: 25,
        attributionControl: false,
      })

      mapRef.current = map

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')

      map.on('load', () => {
        // Apply brand paint overrides
        try {
          map.setPaintProperty('background', 'background-color', '#0A0A14')
          map.setPaintProperty('water', 'fill-color', '#08080F')
        } catch {}

        // Add store markers
        stores.forEach((store) => {
          const isHQ = store.isHQ

          // Create custom crown SVG marker
          const el = document.createElement('div')
          el.className = 'store-marker'
          el.innerHTML = isHQ
            ? `<div style="width:32px;height:32px;border-radius:50%;background:rgba(212,175,114,0.9);border:2px solid #D4AF72;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(212,175,114,0.5);cursor:none;font-size:14px;">♛</div>`
            : `<div style="width:22px;height:22px;border-radius:50%;background:rgba(212,175,114,0.5);border:1.5px solid rgba(212,175,114,0.7);cursor:none;position:relative;"><div style="width:6px;height:6px;border-radius:50%;background:#D4AF72;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"></div></div>`

          el.style.cursor = 'none'

          const marker = new mapboxgl.Marker(el)
            .setLngLat([store.coordinates.lng, store.coordinates.lat])
            .addTo(map)

          el.addEventListener('click', () => {
            onStoreSelect?.(store)
          })

          markersRef.current.push(marker)
        })

        // HQ pulse animation ring
        const hqStore = stores.find((s) => s.isHQ)
        if (hqStore) {
          map.addSource('hq-pulse', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [hqStore.coordinates.lng, hqStore.coordinates.lat] },
              properties: {},
            },
          })

          map.addLayer({
            id: 'hq-pulse-ring',
            type: 'circle',
            source: 'hq-pulse',
            paint: {
              'circle-radius': ['interpolate', ['linear'], ['zoom'], 5, 20, 10, 60],
              'circle-color': 'rgba(212,175,114,0)',
              'circle-stroke-width': 2,
              'circle-stroke-color': 'rgba(212,175,114,0.4)',
              'circle-opacity': 0.6,
            },
          })
        }

        setMapLoaded(true)
      })
    }

    initMap()

    return () => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [stores, HQ_LAT, HQ_LNG, onStoreSelect])

  // FlyTo selected store
  useEffect(() => {
    if (!mapRef.current || !selectedStore || !mapLoaded) return
    mapRef.current.flyTo({
      center: [selectedStore.coordinates.lng, selectedStore.coordinates.lat],
      zoom: 13,
      duration: 1800,
      essential: true,
    })
  }, [selectedStore, mapLoaded])

  return (
    <div
      ref={mapContainerRef}
      className={cn('w-full h-full min-h-[400px] rounded-2xl overflow-hidden', className)}
    />
  )
}

// ── DYNAMIC EXPORT (no SSR) ───────────────────────────────────

export const StoreMap = dynamic(() => Promise.resolve(StoreMapInner), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] rounded-2xl bg-[var(--glass-light)] border border-white/10 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
        <p className="text-xs text-[var(--white-soft)]/30 font-sans tracking-[0.15em] uppercase">
          Loading map
        </p>
      </div>
    </div>
  ),
})

export default StoreMap
