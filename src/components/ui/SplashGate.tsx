import { useState } from 'react'
import { motion } from 'framer-motion'
import { NeonButton } from './NeonButton'
import { t } from '../../utils/translations'
import type { Language } from '../../utils/translations'

interface SplashGateProps {
  language: Language
  onEnter: () => void
}

const SWEEP_EASE = [0.76, 0, 0.24, 1] as [number, number, number, number]
const SWEEP_DURATION = 0.58

export function SplashGate({ language, onEnter }: SplashGateProps) {
  const tr = t(language)
  const [clicked, setClicked] = useState(false)

  function handleEnter() {
    if (!clicked) setClicked(true)
  }

  // Shared content layout used by both the white layer and the black-on-orange layer
  function ContentColumn({ dark }: { dark?: boolean }) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        {/* Eyebrow */}
        <span
          style={{
            fontFamily: 'Anurati, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.22em',
            color: dark ? 'rgba(0,0,0,0.45)' : 'rgba(255,180,75,0.6)',
            textTransform: 'uppercase',
            marginBottom: '28px',
          }}
        >
          HALOVISION AI
        </span>

        {/* Headline */}
        <h1
          aria-hidden={dark}
          style={{
            fontFamily: 'var(--font-serif, Georgia, serif)',
            fontSize: 'clamp(2.6rem, 6vw, 5.2rem)',
            color: dark ? '#000000' : '#ffffff',
            lineHeight: 1.08,
            letterSpacing: '-0.025em',
            margin: 0,
            marginBottom: '20px',
            maxWidth: '720px',
          }}
        >
          {tr.splashHeadline}
        </h1>

        {/* Sub-line */}
        <p
          aria-hidden={dark}
          style={{
            fontSize: '15px',
            color: dark ? 'rgba(0,0,0,0.60)' : 'rgba(255,255,255,0.52)',
            margin: 0,
            marginBottom: dark ? 0 : '48px',
            maxWidth: '380px',
            lineHeight: 1.6,
            letterSpacing: '0.01em',
          }}
        >
          {tr.splashSub}
        </p>

        {/* Button — only in the light (non-dark) layer */}
        {!dark && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.8, type: 'spring', stiffness: 320, damping: 26 }}
            style={{ marginTop: '48px' }}
          >
            <NeonButton size="lg" onClick={handleEnter}>
              {tr.splashCta}
            </NeonButton>
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <motion.div
      key="splash-gate"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      role="dialog"
      aria-modal="true"
      aria-label="Site entrance"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
      }}
    >
      {/* ── Static dark background layers ──────────────────────────── */}

      {/* Radial purple glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70vw 60vh at 62% 35%, rgba(90,40,200,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* SVG noise overlay */}
      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.035,
        }}
      >
        <filter id="splash-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#splash-noise)" />
      </svg>

      {/* ── White content (dark background) ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <ContentColumn />
      </motion.div>

      {/* ── Orange sweep layer ──────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        initial={{ x: '-101%' }}
        animate={clicked ? { x: '0%' } : { x: '-101%' }}
        transition={{ duration: SWEEP_DURATION, ease: SWEEP_EASE }}
        onAnimationComplete={() => { if (clicked) onEnter() }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 310,
          background: 'linear-gradient(135deg, #FF6520 0%, #E84000 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Black text — moves with the orange, clips to it ─────────── */}
      {/* Same x animation as the orange, so black text always sits exactly over the orange area */}
      <motion.div
        aria-hidden="true"
        initial={{ x: '-101%' }}
        animate={clicked ? { x: '0%' } : { x: '-101%' }}
        transition={{ duration: SWEEP_DURATION, ease: SWEEP_EASE }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 320,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <ContentColumn dark />
      </motion.div>
    </motion.div>
  )
}
