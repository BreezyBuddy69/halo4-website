import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const VIOLET = '#8B5CF6'
const WORDMARK = 'HALOVISION AI'

type Phase = 'typewriter' | 'hold' | 'exit'

interface SplashGateProps {
  onDone: () => void
  onTitleReady?: () => void
}

export function SplashGate({ onDone, onTitleReady }: SplashGateProps) {
  const [phase, setPhase] = useState<Phase>('typewriter')
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const skip = useRef(() => {})

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onTitleReady?.()
      onDone()
      return
    }

    const doSkip = () => {
      timersRef.current.forEach(clearTimeout)
      onTitleReady?.()
      setPhase('exit')
      setTimeout(() => onDone(), 600)
    }
    skip.current = doSkip

    // 30% longer than before: 600→780, 900→1170, 1200→1560, 1800→2340
    const t1 = setTimeout(() => setPhase('hold'), 780)
    const t2 = setTimeout(() => onTitleReady?.(), 1170)
    const t3 = setTimeout(() => setPhase('exit'), 1560)
    const t4 = setTimeout(() => onDone(), 2340)
    timersRef.current = [t1, t2, t3, t4]
    return () => timersRef.current.forEach(clearTimeout)
  }, [onDone, onTitleReady])

  useEffect(() => {
    const onKey = () => skip.current()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center cursor-pointer"
          onClick={() => skip.current()}
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

          {/* HALOVISION AI — character-level particle left-to-right reveal */}
          <div className="relative z-10 text-center px-8 flex flex-col items-center gap-4">
            <p
              aria-label={WORDMARK}
              style={{
                fontFamily: 'anurati, sans-serif',
                fontSize: 'clamp(1.4rem, 5vw, 3.2rem)',
                letterSpacing: '0.18em',
                fontWeight: 900,
                margin: 0,
                lineHeight: 1,
              }}
            >
              {WORDMARK.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, x: -18, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.42,
                    delay: 0.04 + i * 0.055,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    display: 'inline-block',
                    color: 'rgba(255,255,255,0.95)',
                    textShadow: `0 0 60px rgba(139,92,246,0.5), 0 0 20px rgba(139,92,246,0.3)`,
                    willChange: 'transform, opacity, filter',
                    whiteSpace: char === ' ' ? 'pre' : undefined,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </p>
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
              style={{
                height: '1px',
                width: '160px',
                background: `linear-gradient(to right, transparent, ${VIOLET}66, transparent)`,
                transformOrigin: 'center',
              }}
            />
          </div>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
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
