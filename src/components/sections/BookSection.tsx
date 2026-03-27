import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SectionReveal } from '../ui/SectionReveal'
import { NeonButton } from '../ui/NeonButton'
import { GlassPanel } from '../ui/GlassPanel'
import { useVantaClouds } from '../../hooks/useVantaClouds'
import { usePerformance } from '../../contexts/PerformanceContext'
import { t } from '../../utils/translations'
import type { Language } from '../../utils/translations'
import { Clock, CheckCircle } from 'lucide-react'

// More neutral / muted purple-gray — less saturated
const BOOK_CLOUDS_CONFIG = {
  backgroundColor: 0x1e1530,
  skyColor: 0x6838a8,
  cloudColor: 0xe0d0f4,
  cloudShadowColor: 0x1a0e28,
  sunColor: 0x9050c8,
  sunGlareColor: 0xb068d8,
  sunlightColor: 0xc890e0,
  speed: 0.5,
}

interface BookSectionProps {
  language: Language
  isActive: boolean
  onBooking: () => void
}

export function BookSection({ language, isActive, onBooking }: BookSectionProps) {
  const tr = t(language)
  const tier = usePerformance()
  const vantaEnabled = tier === 'full'
  const vantaRef = useRef<HTMLDivElement>(null)
  useVantaClouds(vantaRef, BOOK_CLOUDS_CONFIG, isActive, vantaEnabled)

  const steps = [
    { num: '01', text: 'Audit' },
    { num: '02', text: 'Strategy' },
    { num: '03', text: 'Build' },
    { num: '04', text: 'Launch' },
  ]

  const [activeStep, setActiveStep] = useState(-1)

  useEffect(() => {
    if (!isActive) {
      setActiveStep(-1)
      return
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    steps.forEach((_, i) => {
      // row fades in at 0.9s, then each step fires 550ms apart
      timers.push(setTimeout(() => setActiveStep(i), 1100 + i * 600))
    })
    return () => timers.forEach(clearTimeout)
  }, [isActive]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SectionReveal isActive={isActive}>
      <div className="relative w-full h-full overflow-hidden">
        {/* Background — Vanta on full tier, static gradient otherwise */}
        {vantaEnabled
          ? <div ref={vantaRef} className="absolute inset-0 z-0" />
          : <div className="absolute inset-0 z-0" style={{ background: `
              radial-gradient(ellipse 100% 48% at 50% 88%, rgba(224,208,244,0.38) 0%, transparent 62%),
              radial-gradient(ellipse 65% 32% at 18% 68%, rgba(190,150,235,0.28) 0%, transparent 68%),
              radial-gradient(ellipse 55% 28% at 82% 52%, rgba(170,120,220,0.32) 0%, transparent 62%),
              radial-gradient(ellipse 80% 38% at 40% 75%, rgba(200,170,240,0.22) 0%, transparent 60%),
              radial-gradient(ellipse 45% 24% at 75% 30%, rgba(140,90,200,0.25) 0%, transparent 65%),
              radial-gradient(ellipse 110% 58% at 50% 92%, rgba(104,56,168,0.65) 0%, transparent 70%),
              linear-gradient(180deg, #070312 0%, #100820 28%, #180c30 55%, #200f3c 80%, #2a1448 100%)
            `}} />
        }

        {/* Dark overlay to preserve readability */}
        <div className="absolute inset-0 z-[1] m-book-overlay"
          style={{ background: 'linear-gradient(160deg, rgba(6,2,18,0.65) 0%, rgba(10,4,28,0.50) 50%, rgba(6,2,18,0.68) 100%)' }}
        />

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8 md:px-16 text-center pt-16 md:pt-0">

          {/* Duration badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <GlassPanel className="rounded-full px-4 py-2 flex items-center gap-2 mb-8 mx-auto w-fit">
              <Clock className="w-3.5 h-3.5 text-white/50" />
              <span className="text-xs text-white/60 max-md:text-white/85 tracking-wider">{tr.duration} · {tr.growthMappingCall}</span>
            </GlassPanel>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-7xl lg:text-8xl font-serif text-white leading-none mb-4"
          >
            {tr.workWithUs}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="text-white/40 max-md:text-white/68 text-sm mb-6 md:mb-10 max-w-sm leading-relaxed"
          >
            {tr.growthMappingDesc}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isActive ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.7, type: 'spring', damping: 15 }}
          >
            <NeonButton onClick={onBooking} size="lg">
              {tr.bookCall}
            </NeonButton>
          </motion.div>

          {/* Steps row — hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9 }}
            className="hidden md:flex items-center mt-10"
          >
            {steps.map((step, i) => {
              const lit = activeStep >= i
              return (
                <div key={i} className="flex items-center">
                  {/* Step pill */}
                  <motion.div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                    animate={lit ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      background: lit ? 'rgba(52,211,153,0.10)' : 'transparent',
                      border: lit ? '1px solid rgba(52,211,153,0.22)' : '1px solid transparent',
                      boxShadow: lit ? '0 0 14px rgba(52,211,153,0.12)' : 'none',
                      transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
                    }}
                  >
                    <motion.div
                      animate={{ color: lit ? 'rgba(52,211,153,1)' : 'rgba(255,255,255,0.25)' }}
                      transition={{ duration: 0.4 }}
                      style={{ willChange: 'color' }}
                    >
                      <CheckCircle style={{ width: 13, height: 13 }} />
                    </motion.div>
                    <motion.span
                      className="text-xs tracking-wider"
                      animate={{ color: lit ? 'rgba(52,211,153,0.90)' : 'rgba(255,255,255,0.35)' }}
                      transition={{ duration: 0.4 }}
                    >
                      {step.text}
                    </motion.span>
                  </motion.div>

                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="relative mx-2" style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.10)' }}>
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(90deg, #10b981, #34d399)',
                          transformOrigin: 'left',
                          boxShadow: '0 0 6px rgba(52,211,153,0.5)',
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: activeStep > i ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : {}}
            transition={{ delay: 1.1 }}
            className="text-white/20 text-[10px] tracking-wider mt-6 hidden md:block"
          >
            {tr.agencyNote}
          </motion.p>
        </div>

      </div>
    </SectionReveal>
  )
}
