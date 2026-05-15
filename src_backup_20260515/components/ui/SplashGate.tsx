import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const BRAND = 'HALOVISION AI'
const TAGLINE = 'Rolling out the red carpet.'
const VIOLET = '#8B5CF6'

// Scramble reveal for brand name (uppercase, fast)
function useScrambleReveal(text: string, started: boolean) {
  const [display, setDisplay] = useState(() =>
    text.split('').map(() => (Math.random() < 0.5 ? SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] : ' ')).join('')
  )
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (!started) return
    const chars = text.split('')
    let iteration = 0
    const total = chars.length * 4

    const tick = () => {
      const next = chars.map((char, i) => {
        if (char === ' ') return ' '
        if (i < iteration / 4) return chars[i]
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      }).join('')
      setDisplay(next)
      iteration++
      if (iteration <= total) timerRef.current = setTimeout(tick, 22)
      else setDisplay(text)
    }
    timerRef.current = setTimeout(tick, 80)
    return () => clearTimeout(timerRef.current)
  }, [started, text])

  return display
}

// Human-like typewriter — variable speed, hesitation pauses between words
function useHumanTypewriter(text: string, started: boolean) {
  const [displayed, setDisplayed] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (!started) { setDisplayed(''); return }
    let i = 0
    setDisplayed('')

    const tick = () => {
      if (i >= text.length) return
      const char = text[i]
      i++
      setDisplayed(text.slice(0, i))

      // Calculate next delay — more human, less linear
      let delay: number
      if (char === ' ') {
        // Pause between words — sometimes "thinking"
        delay = Math.random() < 0.25 ? 180 + Math.random() * 220 : 60 + Math.random() * 80
      } else if (char === '.') {
        delay = 280 + Math.random() * 120
      } else if (char === ',') {
        delay = 140 + Math.random() * 80
      } else {
        // Normal character — varied speed, occasional mini-hesitation
        const base = 55 + Math.random() * 55
        delay = Math.random() < 0.08 ? base + 180 + Math.random() * 200 : base
      }

      // Occasional "thinking" pauses mid-word early on (more human)
      if (i < 8 && Math.random() < 0.15) delay += 200 + Math.random() * 300

      timerRef.current = setTimeout(tick, delay)
    }

    // Initial pause before first character — like gathering thoughts
    timerRef.current = setTimeout(tick, 400 + Math.random() * 300)
    return () => clearTimeout(timerRef.current)
  }, [started, text])

  return displayed
}

type Phase = 'brand-scramble' | 'brand-hold' | 'tagline' | 'exit'

interface SplashGateProps {
  onDone: () => void
}

export function SplashGate({ onDone }: SplashGateProps) {
  const [phase, setPhase] = useState<Phase>('brand-scramble')
  const [scrambleStarted, setScrambleStarted] = useState(false)
  const [typewriterStarted, setTypewriterStarted] = useState(false)
  const brandDisplay = useScrambleReveal(BRAND, scrambleStarted)
  const taglineDisplay = useHumanTypewriter(TAGLINE, typewriterStarted)

  useEffect(() => {
    const t1 = setTimeout(() => { setScrambleStarted(true) }, 200)
    const t2 = setTimeout(() => setPhase('brand-hold'), 1700)
    const t3 = setTimeout(() => { setPhase('tagline'); setTypewriterStarted(true) }, 2500)
    // Exit after tagline has enough time to finish (avg ~2.8s for the text)
    const t4 = setTimeout(() => setPhase('exit'), 6200)
    const t5 = setTimeout(() => onDone(), 6750)
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout)
  }, [onDone])

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.015 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center"
          style={{ background: '#0D0B1A' }}
        >
          {/* Ambient glow */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60vw 50vh at 50% 50%, rgba(139,92,246,0.07) 0%, transparent 70%)`,
            }}
          />

          {/* Grain */}
          <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]">
            <filter id="sn">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#sn)" />
          </svg>

          <div className="relative z-10 text-center flex flex-col items-center gap-6">
            {/* Brand name — scramble reveals, then fades slightly when tagline appears */}
            <motion.div
              animate={{
                opacity: phase === 'tagline' ? 0.35 : 1,
                y: phase === 'tagline' ? -8 : 0,
              }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            >
              <h1
                style={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontSize: 'clamp(1.6rem, 5vw, 3.8rem)',
                  color: '#ffffff',
                  letterSpacing: '0.18em',
                  lineHeight: 1,
                  margin: 0,
                  fontWeight: 700,
                }}
              >
                {brandDisplay}
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: phase === 'brand-hold' || phase === 'tagline' ? 1 : 0, y: phase === 'brand-hold' || phase === 'tagline' ? 0 : 8 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                  marginTop: '14px',
                  fontSize: '10px',
                  letterSpacing: '0.32em',
                  color: `rgba(139,92,246,0.65)`,
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                AI Automation Architect
              </motion.p>
            </motion.div>

            {/* Tagline — human typewriter */}
            <AnimatePresence>
              {phase === 'tagline' && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  style={{ minHeight: '2em' }}
                >
                  <p
                    style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: 'clamp(1rem, 2.8vw, 1.75rem)',
                      color: 'rgba(255,255,255,0.88)',
                      letterSpacing: '0.04em',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      margin: 0,
                    }}
                  >
                    {taglineDisplay}
                    {/* Blinking cursor */}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.85, repeat: Infinity }}
                      style={{ color: VIOLET, marginLeft: '2px' }}
                    >
                      |
                    </motion.span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom line */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'brand-hold' || phase === 'tagline' ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              width: '1px',
              height: '48px',
              background: `linear-gradient(to bottom, ${VIOLET}66, transparent)`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
