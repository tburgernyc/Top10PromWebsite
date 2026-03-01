'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// ── TYPES ─────────────────────────────────────────────────────

interface UploadZoneProps {
  onUpload: (file: File, preview: string) => void
  preview?: string | null
  className?: string
}

// ── UPLOAD ZONE ────────────────────────────────────────────────

export function UploadZone({ onUpload, preview, className }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (accepted: File[], rejected: { errors: ReadonlyArray<{ message: string; code: string }> }[]) => {
      setIsDragOver(false)
      if (rejected.length > 0) {
        setError('Please upload a JPG, PNG, or WEBP image under 10MB.')
        return
      }
      if (accepted.length === 0) return
      const file = accepted[0]
      const objectUrl = URL.createObjectURL(file)
      setError(null)
      onUpload(file, objectUrl)
    },
    [onUpload]
  )

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: () => setIsDragOver(false),
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    noClick: !!preview, // disable click if preview shown
  })

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden',
          'flex flex-col items-center justify-center text-center',
          preview ? 'border-transparent' : isDragOver
            ? 'border-[var(--gold)] bg-[var(--glass-gold)] shadow-[var(--shadow-gold)]'
            : 'border-white/15 bg-[var(--glass-light)] hover:border-gold/30 hover:bg-[var(--glass-gold)]/30',
          preview ? 'aspect-[3/4]' : 'aspect-[3/4] cursor-none'
        )}
        style={{ cursor: preview ? 'default' : 'none' }}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={preview}
                alt="Your photo"
                fill
                className="object-cover"
                unoptimized
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/70 via-transparent to-transparent" />

              {/* Change photo button */}
              <button
                onClick={open}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[var(--bg-primary)]/80 backdrop-blur-md border border-white/15 text-xs font-sans font-semibold text-[var(--white-soft)]/70 hover:text-[var(--gold)] hover:border-gold/40 transition-all"
                style={{ cursor: 'none' }}
              >
                Change photo
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-5 p-8"
            >
              {/* Upload icon */}
              <motion.div
                animate={isDragOver ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-16 h-16 rounded-2xl border border-white/10 bg-[var(--glass-light)] flex items-center justify-center"
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-[var(--gold)]/60">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </motion.div>

              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-sans font-semibold text-[var(--white-soft)]/70">
                  {isDragOver ? 'Drop your photo here' : 'Upload your photo'}
                </p>
                <p className="text-xs font-sans text-[var(--white-soft)]/30 leading-relaxed">
                  Drag & drop or click to browse<br />JPG, PNG or WEBP · Max 10MB
                </p>
              </div>

              <p className="text-[9px] font-sans text-[var(--white-soft)]/20 leading-relaxed max-w-[180px]">
                Best results: full-body photo, good lighting, neutral background
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs font-sans text-red-400/80 text-center"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Tips */}
      {!preview && (
        <div className="flex flex-col gap-2 p-4 rounded-2xl bg-[var(--glass-light)] border border-white/8">
          <p className="text-[10px] font-sans font-semibold tracking-[0.15em] uppercase text-[var(--white-soft)]/30">Photo tips</p>
          {[
            'Stand facing forward in good light',
            'Wear form-fitting or neutral clothing',
            'Use a plain wall as background',
          ].map(tip => (
            <div key={tip} className="flex items-center gap-2">
              <span className="text-[var(--gold)]/40 text-xs">✦</span>
              <p className="text-[11px] font-sans text-[var(--white-soft)]/40">{tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UploadZone
