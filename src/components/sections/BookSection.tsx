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

const BOOK_CLOUDS_CONFIG = {
  variant: 'clouds' as const,
  backgroundColor: 0x0d0510,
  skyColor: 0xff6b35,
  cloudColor: 0xff9f45,
  cloudShadowColor: 0x1a0a20,
  sunColor: 0xffd700,
  sunGlareColor: 0xff4500,
  sunlightColor: 0xffa500,
  speed: 0.6,
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

  const stepLabels = {
    en: ['Discovery', 'Plan', 'Build', 'Launch'],
    de: ['Gespräch', 'Plan', 'Umsetzung', 'Live'],
    fr: ['Appel', 'Plan', 'Construction', 'Live'],
  }
  const steps = stepLabels[language].map((text, i) => ({ num: `0${i + 1}`, text }))

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
              radial-gradient(ellipse 100% 50% at 55% 12%, rgba(255,200,80,0.70) 0%, transparent 50%),
              radial-gradient(ellipse 80% 40% at 25% 40%, rgba(255,107,53,0.45) 0%, transparent 60%),
              radial-gradient(ellipse 70% 38% at 80% 35%, rgba(255,159,69,0.38) 0%, transparent 58%),
              radial-gradient(ellipse 120% 55% at 50% 80%, rgba(180,60,20,0.50) 0%, transparent 65%),
              linear-gradient(180deg, #1a0508 0%, #2d0d0a 28%, #3d1508 55%, #1a0a20 80%, #0d0510 100%)
            `}} />
        }

        {/* Dark overlay to preserve readability */}
        <div className="absolute inset-0 z-[1] m-book-overlay"
          style={{ background: 'linear-gradient(180deg, rgba(6,2,18,0.05) 0%, rgba(6,2,18,0.20) 35%, rgba(6,2,18,0.52) 62%, rgba(6,2,18,0.72) 100%)' }}
        />

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8 md:px-16 text-center pt-16 md:pt-0">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25 }}
            className="rounded-full px-4 py-2 flex items-center gap-2 mb-8 mx-auto w-fit"
            style={{
              background: 'linear-gradient(135deg, rgba(160,100,255,0.14) 0%, rgba(120,60,220,0.10) 100%)',
              border: '1px solid rgba(180,120,255,0.28)',
              boxShadow: '0 0 20px rgba(140,80,255,0.14), inset 0 1px 0 rgba(200,160,255,0.12)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-purple-400"
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ willChange: 'opacity, transform' }}
            />
            <Clock className="w-3.5 h-3.5" style={{ color: 'rgba(200,160,255,0.65)' }} />
            <span className="text-xs tracking-wider" style={{ color: 'rgba(220,185,255,0.72)' }}>{tr.duration} · {tr.growthMappingCall}</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-7xl lg:text-8xl font-serif text-white leading-none mb-4"
          >
            {tr.workWithUs}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="text-white/40 text-sm mb-10 max-w-sm leading-relaxed"
          >
            {tr.growthMappingDesc}
          </motion.p>

          {/* ── CTA — the focal point ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={isActive ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ delay: 0.58, type: 'spring', damping: 14, stiffness: 160 }}
            className="mb-5"
          >
            <NeonButton onClick={onBooking} size="lg">
              {tr.bookCall}
            </NeonButton>
          </motion.div>

          {/* Social proof — tight below CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : {}}
            transition={{ delay: 0.72 }}
            className="flex items-center gap-3 mb-10 justify-center"
          >
            <div className="flex -space-x-2">
              {['A','M','T','J'].map((initial, i) => {
                const gradients = [
                  'linear-gradient(135deg, rgba(100,120,255,0.6), rgba(80,100,220,0.4))',
                  'linear-gradient(135deg, rgba(190,110,255,0.6), rgba(150,70,220,0.4))',
                  'linear-gradient(135deg, rgba(52,211,153,0.6), rgba(32,180,130,0.4))',
                  'linear-gradient(135deg, rgba(255,200,70,0.6), rgba(220,160,40,0.4))',
                ]
                return (
                  <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-semibold text-white/80"
                    style={{ background: gradients[i], border: '1.5px solid rgba(255,255,255,0.15)', zIndex: 4 - i }}>
                    {initial}
                  </div>
                )
              })}
            </div>
            <p className="text-white/35 text-[11px] tracking-wide">
              <span className="text-white/58 font-medium">12+</span> {language === 'de' ? 'Unternehmen bereits dabei' : language === 'fr' ? 'entreprises déjà automatisées' : 'businesses already automating'}
            </p>
          </motion.div>

          {/* ── Steps row — animated, hidden on mobile ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.85 }}
            className="hidden md:flex items-center"
          >
            {steps.map((step, i) => {
              const lit = activeStep >= i
              return (
                <div key={i} className="flex items-center">
                  <motion.div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                    animate={lit ? { scale: [1, 1.15, 1] } : { scale: 1 }}
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
            transition={{ delay: 1.2 }}
            className="text-white/20 text-[10px] tracking-wider mt-5 hidden md:block"
          >
            {tr.agencyNote}
          </motion.p>

        </div>

      </div>
    </SectionReveal>
  )
}
