'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { GoldButton, GhostButton } from '@/components/ui/Button'
import { ProgressCounter } from '@/components/animations/CounterAnimation'
import type { StyleDNA } from '@/types'

// ── QUIZ QUESTIONS ────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 'vibe',
    question: 'What\'s your prom night vibe?',
    options: [
      { label: 'Classic Glamour', value: 'classic', emoji: '✨' },
      { label: 'Romantic & Dreamy', value: 'romantic', emoji: '🌸' },
      { label: 'Bold & Statement', value: 'bold', emoji: '🔥' },
      { label: 'Modern & Chic', value: 'modern', emoji: '⚡' },
    ],
  },
  {
    id: 'silhouette',
    question: 'Your dream dress silhouette?',
    options: [
      { label: 'Ball Gown', value: 'ballgown', emoji: '👑' },
      { label: 'A-Line', value: 'aline', emoji: '🌟' },
      { label: 'Fitted / Mermaid', value: 'mermaid', emoji: '🧜' },
      { label: 'Two-Piece', value: 'twopiece', emoji: '💫' },
    ],
  },
  {
    id: 'color',
    question: 'Your signature color palette?',
    options: [
      { label: 'Jewel Tones', value: 'jewel', emoji: '💎' },
      { label: 'Soft Pastels', value: 'pastel', emoji: '🌷' },
      { label: 'Classic Black', value: 'black', emoji: '🖤' },
      { label: 'Metallics', value: 'metallic', emoji: '✦' },
    ],
  },
  {
    id: 'detail',
    question: 'Which embellishment calls your name?',
    options: [
      { label: 'Sequins & Glitter', value: 'sequins', emoji: '🪩' },
      { label: 'Floral Appliqués', value: 'floral', emoji: '🌸' },
      { label: 'Beading & Crystals', value: 'beading', emoji: '💠' },
      { label: 'Clean & Minimal', value: 'minimal', emoji: '◇' },
    ],
  },
]

// ── RESULT MAP ─────────────────────────────────────────────────

function buildStyleDNA(answers: Record<string, string>): StyleDNA {
  const { vibe, silhouette, color, detail } = answers

  const archetype =
    vibe === 'classic' ? 'The Timeless Icon'
    : vibe === 'romantic' ? 'The Romantic Dreamer'
    : vibe === 'bold' ? 'The Statement Maker'
    : 'The Modern It-Girl'

  return {
    archetype,
    primaryVibe: vibe ?? 'classic',
    silhouette: silhouette ?? 'aline',
    colorPalette: color ?? 'jewel',
    embellishment: detail ?? 'minimal',
    designers: ['Johnathan Kayne', 'Ashley Lauren'],
    scores: {
      glamour: vibe === 'classic' || detail === 'sequins' ? 90 : 60,
      romance: vibe === 'romantic' || detail === 'floral' ? 85 : 45,
      boldness: vibe === 'bold' ? 95 : color === 'black' ? 70 : 40,
      minimalism: detail === 'minimal' ? 80 : 25,
    },
  }
}

// ── STYLE DNA CARD ─────────────────────────────────────────────

interface StyleDNACardProps {
  existingDNA?: StyleDNA
  onComplete?: (dna: StyleDNA) => void
  className?: string
}

export function StyleDNACard({ existingDNA, onComplete, className }: StyleDNACardProps) {
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'result'>(
    existingDNA ? 'result' : 'intro'
  )
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [dna, setDna] = useState<StyleDNA | null>(existingDNA ?? null)

  const currentQuestion = QUESTIONS[questionIndex]

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)

    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex((i) => i + 1)
    } else {
      const result = buildStyleDNA(newAnswers)
      setDna(result)
      setPhase('result')
      onComplete?.(result)
    }
  }

  return (
    <div
      className={cn(
        'p-6 rounded-2xl bg-[var(--glass-light)] border border-white/10',
        'overflow-hidden',
        className
      )}
    >
      <AnimatePresence mode="wait">
        {/* INTRO */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex flex-col items-center text-center gap-4 py-4"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--gold)]/20 to-[var(--blush)]/20 border border-gold/25 flex items-center justify-center text-2xl">
              ✦
            </div>
            <div>
              <h3 className="font-serif text-xl text-[var(--white-soft)] mb-1">
                Discover Your Style DNA
              </h3>
              <p className="text-sm text-[var(--white-soft)]/50 font-sans leading-relaxed">
                Answer 4 quick questions and we'll curate your perfect style archetype with personalized dress recommendations.
              </p>
            </div>
            <GoldButton onClick={() => setPhase('quiz')}>
              Begin Style Quiz
            </GoldButton>
          </motion.div>
        )}

        {/* QUIZ */}
        {phase === 'quiz' && (
          <motion.div
            key={`q-${questionIndex}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-5"
          >
            {/* Progress */}
            <div className="flex gap-1">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-0.5 flex-1 rounded-full transition-all duration-500',
                    i < questionIndex ? 'bg-[var(--gold)]' : i === questionIndex ? 'bg-[var(--gold)]/50' : 'bg-white/10'
                  )}
                />
              ))}
            </div>

            <div>
              <p className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[var(--gold)]/60 mb-1">
                Question {questionIndex + 1} of {QUESTIONS.length}
              </p>
              <h3 className="font-serif text-lg text-[var(--white-soft)]">
                {currentQuestion.question}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl',
                    'border border-white/10 bg-[var(--glass-medium)]',
                    'hover:border-gold/40 hover:bg-[var(--glass-gold)]',
                    'transition-all duration-200 text-center'
                  )}
                  style={{ cursor: 'none' }}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-xs font-sans font-semibold text-[var(--white-soft)]/80">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* RESULT */}
        {phase === 'result' && dna && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-5"
          >
            <div className="text-center">
              <p className="text-[10px] font-sans font-semibold tracking-[0.25em] uppercase text-[var(--gold)]/60 mb-1">
                Your Style Archetype
              </p>
              <h3 className="font-serif text-2xl text-[var(--gold)]">
                {dna.archetype}
              </h3>
            </div>

            {/* Score bars */}
            <div className="flex flex-col gap-3">
              {Object.entries(dna.scores ?? {}).map(([key, val]) => (
                <ProgressCounter
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={val}
                  color={key === 'romance' ? 'blush' : 'gold'}
                />
              ))}
            </div>

            {/* Recommended designers */}
            <div>
              <p className="text-[10px] font-sans font-semibold tracking-[0.2em] uppercase text-[var(--white-soft)]/40 mb-2">
                Designers For You
              </p>
              <div className="flex flex-wrap gap-2">
                {dna.designers?.map((d) => (
                  <span
                    key={d}
                    className="px-3 py-1 rounded-full bg-[var(--glass-gold)] border border-gold/25 text-xs font-sans text-[var(--gold)]"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <GhostButton
              size="sm"
              onClick={() => {
                setPhase('intro')
                setQuestionIndex(0)
                setAnswers({})
                setDna(null)
              }}
            >
              Retake Quiz
            </GhostButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default StyleDNACard
