import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TAGLINE = 'Rolling out the red carpet.'
const VIOLET = '#8B5CF6'

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

      let delay: number
      if (char === ' ') {
        delay = Math.random() < 0.25 ? 126 + Math.random() * 154 : 42 + Math.random() * 56
      } else if (char === '.') {
        delay = 196 + Math.random() * 84
      } else if (char === ',') {
        delay = 98 + Math.random() * 56
      } else {
        const base = 38 + Math.random() * 38
        delay = Math.random() < 0.08 ? base + 126 + Math.random() * 140 : base
      }

      if (i < 8 && Math.random() < 0.15) delay += 140 + Math.random() * 210

      timerRef.current = setTimeout(tick, delay)
    }

    timerRef.current = setTimeout(tick, 200)
    return () => clearTimeout(timerRef.current)
  }, [started, text])

  return displayed
}

type Phase = 'typewriter' | 'hold' | 'exit'

interface SplashGateProps {
  onDone: () => void
  onTitleReady?: () => void
}

export function SplashGate({ onDone, onTitleReady }: SplashGateProps) {
  const [phase, setPhase] = useState<Phase>('typewriter')
  const [typewriterStarted, setTypewriterStarted] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)
  const taglineDisplay = useHumanTypewriter(TAGLINE, typewriterStarted)

  useEffect(() => {
    // Start typewriter immediately
    const t1 = setTimeout(() => setTypewriterStarted(true), 80)
    // Brief hold after typewriter finishes (~2.5s avg)
    const t2 = setTimeout(() => setPhase('hold'), 3400)
    // Signal background title to start animating (fires before gate disappears)
    const t3 = setTimeout(() => onTitleReady?.(), 3600)
    // Fade cursor out before exit
    const t4 = setTimeout(() => setCursorVisible(false), 3700)
    // Gate exits
    const t5 = setTimeout(() => setPhase('exit'), 3900)
    // Gate fully gone → introDone
    const t6 = setTimeout(() => onDone(), 4500)
    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout)
  }, [onDone, onTitleReady])

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center"
          style={{ background: '#0D0B1A' }}
        >
          {/* Ambient glow */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 70vw 60vh at 50% 52%, rgba(139,92,246,0.09) 0%, transparent 68%)`,
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

          {/* Typewriter tagline — centred, italic, elegant */}
          <motion.div
            className="relative z-10 text-center px-8"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <p
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: 'clamp(1.15rem, 3.5vw, 2.2rem)',
                color: 'rgba(255,255,255,0.92)',
                letterSpacing: '0.03em',
                fontStyle: 'italic',
                fontWeight: 400,
                margin: 0,
                minHeight: '1.4em',
              }}
            >
              {taglineDisplay}
              <motion.span
                animate={{ opacity: cursorVisible ? [1, 0, 1] : 0 }}
                transition={{ duration: 0.85, repeat: cursorVisible ? Infinity : 0 }}
                style={{ color: VIOLET, marginLeft: '2px' }}
              >
                |
              </motion.span>
            </p>

            {/* Subtle line beneath */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: '1px',
                marginTop: '28px',
                background: `linear-gradient(to right, transparent, ${VIOLET}55, transparent)`,
                transformOrigin: 'center',
              }}
            />
          </motion.div>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
            style={{
              width: '1px',
              height: '40px',
              background: `linear-gradient(to bottom, ${VIOLET}55, transparent)`,
              transformOrigin: 'top',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
