'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import { UploadZone } from '@/components/tryon/UploadZone'
import { DressSelector } from '@/components/tryon/DressSelector'
import { ResultPanel } from '@/components/tryon/ResultPanel'
import { ChatDrawer } from '@/components/chat/ChatDrawer'
import type { Dress } from '@/types'

// Metadata cannot be used in client components — handled via generateMetadata pattern
// but since this is a client page, we put metadata in a parent layout or route segment

export default function VirtualTryOnPage() {
  const [userPhoto, setUserPhoto] = useState<string | null>(null)
  const [selectedDress, setSelectedDress] = useState<Dress | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | undefined>()

  const handleUpload = (_file: File, preview: string) => {
    setUserPhoto(preview)
  }

  return (
    <main className="min-h-screen pt-20 pb-24">
      {/* Header */}
      <div className="px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto py-8">
        <p className="text-[10px] font-sans font-semibold tracking-[0.35em] uppercase text-[var(--gold)] mb-2">
          AI-Powered
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--white-soft)]">Virtual Try-On</h1>
        <p className="text-base font-sans text-[var(--white-soft)]/45 mt-3 max-w-xl leading-relaxed">
          Upload your photo, choose a dress, and see how it looks on you — powered by AI. Book an in-store appointment to experience it in person.
        </p>
      </div>

      {/* 3-column spatial layout */}
      <div className="px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] gap-6 lg:gap-8 items-start">
          {/* Column 1 — Upload */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-[var(--gold)] text-[var(--bg-primary)] text-[9px] font-bold flex items-center justify-center">1</span>
              <p className="text-xs font-sans font-semibold text-[var(--white-soft)]/50 tracking-[0.1em] uppercase">Upload Your Photo</p>
            </div>
            <UploadZone
              onUpload={handleUpload}
              preview={userPhoto}
            />
          </div>

          {/* Column 2 — Result */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-[var(--gold)] text-[var(--bg-primary)] text-[9px] font-bold flex items-center justify-center">2</span>
              <p className="text-xs font-sans font-semibold text-[var(--white-soft)]/50 tracking-[0.1em] uppercase">Your Look</p>
            </div>
            <ResultPanel
              userPhoto={userPhoto}
              dress={selectedDress}
              selectedColor={selectedColor}
            />
          </div>

          {/* Column 3 — Dress selector */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-[var(--gold)] text-[var(--bg-primary)] text-[9px] font-bold flex items-center justify-center">3</span>
              <p className="text-xs font-sans font-semibold text-[var(--white-soft)]/50 tracking-[0.1em] uppercase">Choose a Style</p>
            </div>
            <DressSelector
              selectedDress={selectedDress}
              onSelect={dress => {
                setSelectedDress(dress)
                setSelectedColor(dress.colors[0]?.name)
              }}
            />
          </div>
        </div>
      </div>

      {/* Disclosure */}
      <div className="px-6 md:px-12 lg:px-20 max-w-screen-xl mx-auto mt-12">
        <p className="text-[10px] font-sans text-[var(--white-soft)]/15 text-center leading-relaxed max-w-2xl mx-auto">
          Virtual try-on results are illustrative only. Colors, fit, and drape may vary. For the most accurate experience, we recommend booking a complimentary in-store styling appointment.
          Your uploaded photos are never stored or shared.
        </p>
      </div>

      <ChatDrawer pageContext="virtual-try-on" />
    </main>
  )
}
