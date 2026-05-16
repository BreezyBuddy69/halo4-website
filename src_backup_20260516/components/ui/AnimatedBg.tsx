import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// ── Variant A: Nebula Orbs ───────────────────────────────────────────────────
// Large blurred gradient orbs slowly drifting — dreamy, organic
function NebulaBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Orb 1 — large purple, top-center drift */}
      <motion.div
        animate={{ x: [0, 60, -40, 20, 0], y: [0, -50, 20, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute"
        style={{
          width: 580, height: 580,
          top: '-10%', left: '25%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(120,60,240,0.28) 0%, rgba(90,40,190,0.12) 45%, transparent 72%)',
          filter: 'blur(70px)',
        }}
      />
      {/* Orb 2 — medium blue, bottom-left drift */}
      <motion.div
        animate={{ x: [0, -70, 40, -20, 0], y: [0, 40, -60, 30, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute"
        style={{
          width: 420, height: 420,
          bottom: '-5%', left: '5%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(60,80,210,0.30) 0%, rgba(40,55,165,0.13) 45%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Orb 3 — small violet, right side */}
      <motion.div
        animate={{ x: [0, 50, -30, 0], y: [0, -40, 60, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute"
        style={{
          width: 320, height: 320,
          top: '30%', right: '-2%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(160,70,255,0.22) 0%, rgba(130,50,220,0.09) 50%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Orb 4 — tiny pink accent, top-right */}
      <motion.div
        animate={{ x: [0, -30, 50, 0], y: [0, 50, -30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute"
        style={{
          width: 220, height: 220,
          top: '5%', right: '15%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,80,220,0.18) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
      />
    </div>
  )
}

// ── Variant B: Rising Particles ──────────────────────────────────────────────
// Tiny dots slowly rising — minimal, techy, like air bubbles
function ParticleRiseBg({ isActive }: { isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const activeRef = useRef(isActive)
  activeRef.current = isActive

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    type Particle = { x: number; y: number; size: number; speed: number; opacity: number; drift: number }
    const count = 70
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.4 + 0.4,
      speed: Math.random() * 0.35 + 0.15,
      opacity: Math.random() * 0.45 + 0.1,
      drift: (Math.random() - 0.5) * 0.25,
    }))

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (activeRef.current) {
        const H = canvas.height
        const fadePx = 100

        for (const p of particles) {
          p.y -= p.speed
          p.x += p.drift
          if (p.y < -4) { p.y = H + 4; p.x = Math.random() * canvas.width }
          if (p.x < 0) p.x = canvas.width
          if (p.x > canvas.width) p.x = 0

          const topFade   = Math.min(p.y / fadePx, 1)
          const botFade   = Math.min((H - p.y) / fadePx, 1)
          const edgeFade  = Math.min(topFade, botFade)

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(195, 155, 255, ${p.opacity * edgeFade})`
          ctx.fill()
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.75 }}
    />
  )
}

// ── Variant C: Aurora Sweep ──────────────────────────────────────────────────
// Two conic gradient layers rotating at different speeds — atmospheric, premium
function AuroraBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Slow outer ring — CW */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        className="absolute pointer-events-none"
        style={{
          width: '170%', height: '170%',
          top: '-35%', left: '-35%',
          background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(110,50,230,0.10) 55deg, rgba(80,40,200,0.07) 90deg, transparent 135deg, rgba(150,60,255,0.08) 210deg, transparent 270deg, rgba(60,80,220,0.07) 320deg, transparent 360deg)',
        }}
      />
      {/* Medium ring — CCW, offset phase */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
        className="absolute pointer-events-none"
        style={{
          width: '130%', height: '130%',
          top: '-15%', left: '-15%',
          background: 'conic-gradient(from 90deg at 45% 55%, transparent 0deg, rgba(180,60,255,0.07) 70deg, transparent 150deg, rgba(60,100,240,0.08) 230deg, transparent 310deg)',
        }}
      />
      {/* Static center glow — anchors the aurora */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '60%', height: '60%',
          top: '20%', left: '20%',
          background: 'radial-gradient(ellipse, rgba(100,50,220,0.10) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  )
}

// ── Variant D: Drift Lines ──────────────────────────────────────────────────
// Thin luminous lines slowly drifting across — same kinetic feel as particles, different form
function DriftLinesBg({ isActive }: { isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const activeRef = useRef(isActive)
  activeRef.current = isActive

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)

    type Line = { x: number; y: number; len: number; angle: number; speed: number; opacity: number; width: number }
    const lines: Line[] = Array.from({ length: 18 }, () => ({
      x: Math.random() * (canvas.width || 1440),
      y: Math.random() * (canvas.height || 900),
      len: Math.random() * 120 + 60,
      angle: Math.PI * 0.3 + (Math.random() - 0.5) * 0.5,
      speed: Math.random() * 0.5 + 0.25,
      opacity: Math.random() * 0.18 + 0.05,
      width: Math.random() * 0.8 + 0.3,
    }))

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (activeRef.current) {
        for (const l of lines) {
          l.x += Math.cos(l.angle) * l.speed
          l.y += Math.sin(l.angle) * l.speed
          if (l.x > canvas.width + l.len || l.y > canvas.height + l.len) {
            l.x = -l.len; l.y = Math.random() * canvas.height
          }
          const grad = ctx.createLinearGradient(
            l.x, l.y,
            l.x + Math.cos(l.angle) * l.len,
            l.y + Math.sin(l.angle) * l.len
          )
          grad.addColorStop(0, `rgba(180,130,255,0)`)
          grad.addColorStop(0.4, `rgba(180,130,255,${l.opacity})`)
          grad.addColorStop(1, `rgba(180,130,255,0)`)
          ctx.beginPath()
          ctx.moveTo(l.x, l.y)
          ctx.lineTo(l.x + Math.cos(l.angle) * l.len, l.y + Math.sin(l.angle) * l.len)
          ctx.strokeStyle = grad
          ctx.lineWidth = l.width
          ctx.stroke()
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.9 }} />
}

// ── Variant E: Breathing Dots ────────────────────────────────────────────────
// A soft grid of dots that pulse in a slow wave — same rhythm as aurora, different form
function BreathingDotsBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Base ambient glow */}
      <div className="absolute pointer-events-none" style={{
        width: '70%', height: '70%', top: '15%', left: '15%',
        background: 'radial-gradient(ellipse, rgba(90,45,200,0.08) 0%, transparent 70%)',
        filter: 'blur(50px)',
      }} />
      {/* Dot grid — 5×4 dots, each pulsing on a delay */}
      {Array.from({ length: 20 }, (_, i) => {
        const col = i % 5
        const row = Math.floor(i / 5)
        const delay = (col * 0.4 + row * 0.6) % 4
        return (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 3, height: 3,
              left: `${14 + col * 18}%`,
              top: `${22 + row * 18}%`,
              background: 'rgba(170,120,255,0.45)',
            }}
            animate={{
              opacity: [0.10, 0.55, 0.10],
              scale: [0.8, 1.6, 0.8],
            }}
            transition={{
              duration: 4.5,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )
      })}
    </div>
  )
}

// ── Variant F: Pulse Rings ───────────────────────────────────────────────────
// Concentric rings expanding from center — rhythmic, techy-premium
function PulseRingsBg() {
  const rings = [0, 1, 2, 3]
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Dim radial base */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '80%', height: '80%',
          top: '10%', left: '10%',
          background: 'radial-gradient(ellipse, rgba(100,45,210,0.10) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Expanding rings */}
      {rings.map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: '50%', left: '50%',
            border: '1px solid rgba(145,55,240,0.20)',
          }}
          animate={{
            width:  ['12vw', '115vw'],
            height: ['12vw', '115vw'],
            x:      ['-6vw', '-57.5vw'],
            y:      ['-6vw', '-57.5vw'],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 7,
            delay: i * 1.75,
            repeat: Infinity,
            ease: [0.12, 0, 0.68, 0],
          }}
        />
      ))}
    </div>
  )
}

// ── Public API ───────────────────────────────────────────────────────────────
export type BgVariant = 'nebula' | 'particles' | 'aurora' | 'driftlines' | 'breathingdots' | 'rings'

interface AnimatedBgProps {
  variant: BgVariant
  isActive?: boolean
}

export function AnimatedBg({ variant, isActive = true }: AnimatedBgProps) {
  if (variant === 'nebula')        return <NebulaBg />
  if (variant === 'particles')     return <ParticleRiseBg isActive={isActive} />
  if (variant === 'aurora')        return <AuroraBg />
  if (variant === 'driftlines')    return <DriftLinesBg isActive={isActive} />
  if (variant === 'breathingdots') return <BreathingDotsBg />
  return <PulseRingsBg />
}
