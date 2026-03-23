import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Language } from '../../utils/translations'

interface VideoSectionProps {
  isActive: boolean
  language: Language
}

const labels: Record<Language, { play: string; mute: string }> = {
  en: { play: 'Play\nIntro', mute: 'Mute' },
  de: { play: 'Intro\nAbspielen', mute: 'Stumm\nSchalten' },
  fr: { play: "Lire\nL'Intro", mute: 'Couper\nLe Son' },
}

// Spring constants — same as global cursor
const STIFFNESS = 180
const DAMPING   = 22
const MASS      = 0.6

const NAVBAR_HEIGHT = 64
const SIDENAV_WIDTH = 190

export function VideoSection({ isActive, language }: VideoSectionProps) {
  const videoRef    = useRef<HTMLVideoElement>(null)
  const buttonRef   = useRef<HTMLDivElement>(null)
  const [isMuted, setIsMuted] = useState(true)

  // ── Video playback ──────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isActive) {
      video.muted = true
      video.volume = 0
      video.play().catch(() => {})
    } else {
      video.pause()
      video.currentTime = 0
      video.muted = true
      video.volume = 0
      setIsMuted(true)
    }
  }, [isActive])

  // ── Global cursor hide/show ─────────────────────────────────────
  useEffect(() => {
    if (isActive) {
      document.dispatchEvent(new Event('cursor:hide'))
    } else {
      document.dispatchEvent(new Event('cursor:show'))
    }
  }, [isActive])

  // ── Spring cursor — pure rAF, zero React re-renders ────────────
  useEffect(() => {
    if (!isActive) {
      const btn = buttonRef.current
      if (btn) btn.style.opacity = '0'
      return
    }

    const target  = { x: -300, y: -300 }
    const current = { x: -300, y: -300 }
    const vel     = { x: 0, y: 0 }
    let lastTime: number | null = null
    let raf: number
    let inZone = false

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY

      const inside = e.clientY > NAVBAR_HEIGHT && e.clientX > SIDENAV_WIDTH
      if (inside !== inZone) {
        inZone = inside
        if (inside) {
          // Snap to real mouse position the moment the button becomes visible
          current.x = e.clientX
          current.y = e.clientY
          vel.x = 0
          vel.y = 0
          document.dispatchEvent(new Event('cursor:hide'))
        } else {
          document.dispatchEvent(new Event('cursor:show'))
        }
      }
    }

    const tick = (now: number) => {
      const dt = lastTime === null ? 1 / 60 : Math.min((now - lastTime) / 1000, 1 / 20)
      lastTime = now

      const ax = (-STIFFNESS * (current.x - target.x) - DAMPING * vel.x) / MASS
      const ay = (-STIFFNESS * (current.y - target.y) - DAMPING * vel.y) / MASS
      vel.x += ax * dt
      vel.y += ay * dt
      current.x += vel.x * dt
      current.y += vel.y * dt

      const btn = buttonRef.current
      if (btn) {
        btn.style.transform = `translate(${current.x - 52}px, ${current.y - 52}px)`
        btn.style.opacity = inZone ? '1' : '0'
      }

      raf = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [isActive])

  // ── Click: toggle sound with fade ──────────────────────────────
  const handleClick = () => {
    const video = videoRef.current
    if (!video) return
    if (isMuted) {
      video.volume = 0
      video.muted = false
      setIsMuted(false)
      const fadeIn = () => {
        if (video.volume < 0.98) { video.volume = Math.min(video.volume + 0.04, 1); requestAnimationFrame(fadeIn) }
        else video.volume = 1
      }
      requestAnimationFrame(fadeIn)
    } else {
      const fadeOut = () => {
        if (video.volume > 0.04) { video.volume = Math.max(video.volume - 0.04, 0); requestAnimationFrame(fadeOut) }
        else { video.volume = 0; video.muted = true; setIsMuted(true) }
      }
      requestAnimationFrame(fadeOut)
    }
  }

  const t = labels[language] ?? labels.en

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-black cursor-none"
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-contain md:object-cover"
        src="/halovisionai3.3.mp4"
        muted
        loop
        playsInline
        webkit-playsinline="true"
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.18) 30%, rgba(0,0,0,0.62) 100%)' }}
      />

      {/* Cursor button — positioned via rAF spring, no React re-renders */}
      <div
        ref={buttonRef}
        className="pointer-events-none fixed z-[300] hidden md:flex items-center justify-center rounded-full"
        style={{
          width: 104,
          height: 104,
          top: 0,
          left: 0,
          opacity: 0,
          willChange: 'transform',
          background: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(255,255,255,0.30)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 0 32px rgba(255,255,255,0.06)',
        }}
      >
        <span
          className="text-center leading-snug font-medium tracking-widest"
          style={{
            fontSize: 8,
            color: 'rgba(255,255,255,0.85)',
            textTransform: 'uppercase',
            whiteSpace: 'pre-wrap',
            maxWidth: 68,
            display: 'block',
          }}
        >
          {isMuted ? t.play : t.mute}
        </span>
      </div>

      {/* Sound indicator top-right */}
      <motion.div
        className="absolute top-24 right-8 md:right-16"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isMuted ? 'bg-white/30' : 'bg-white/60'}`} />
          <span className="text-white/40 text-[10px] tracking-widest">
            {isMuted ? 'ZUM ENTSTUMMEN KLICKEN' : 'TON AN'}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
