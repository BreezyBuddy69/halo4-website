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
  backgroundColor: 0x120a2e,
  skyColor: 0x9060e0,
  cloudColor: 0xf0e8ff,
  cloudShadowColor: 0x2a1550,
  sunColor: 0xc080ff,
  sunGlareColor: 0xe0a0ff,
  sunlightColor: 0xf0c8ff,
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
              radial-gradient(ellipse 120% 55% at 50% 20%, rgba(192,144,255,0.30) 0%, transparent 60%),
              radial-gradient(ellipse 80% 45% at 20% 50%, rgba(160,100,240,0.28) 0%, transparent 65%),
              radial-gradient(ellipse 70% 40% at 80% 40%, rgba(200,130,255,0.25) 0%, transparent 60%),
              radial-gradient(ellipse 100% 48% at 50% 88%, rgba(224,190,255,0.42) 0%, transparent 62%),
              radial-gradient(ellipse 110% 58% at 50% 95%, rgba(120,60,200,0.55) 0%, transparent 70%),
              linear-gradient(180deg, #1a0840 0%, #1e0c48 28%, #230f52 55%, #2a145e 80%, #301968 100%)
            `}} />
        }

        {/* Dark overlay to preserve readability */}
        <div className="absolute inset-0 z-[1] m-book-overlay"
          style={{ background: 'linear-gradient(180deg, rgba(6,2,18,0.05) 0%, rgba(6,2,18,0.20) 35%, rgba(6,2,18,0.52) 62%, rgba(6,2,18,0.72) 100%)' }}
        />

        {/* ── Two-column layout on desktop, stacked on mobile ── */}
        <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center pl-8 md:pl-[13rem] lg:pl-[18rem] pr-8 md:pr-16 lg:pr-24 pt-20 md:pt-0 gap-12 md:gap-16 lg:gap-24">

          {/* ── Left: headline + CTA ── */}
          <div className="flex flex-col items-start max-w-lg w-full">

            {/* Duration badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 }}
              className="rounded-full px-4 py-2 flex items-center gap-2 mb-7 w-fit"
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
              initial={{ opacity: 0, y: 24 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.05] mb-5"
            >
              {tr.workWithUs}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="text-white/45 text-sm leading-relaxed mb-8 max-w-xs"
            >
              {tr.growthMappingDesc}
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={isActive ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.6, type: 'spring', damping: 15 }}
              className="mb-8"
            >
              <NeonButton onClick={onBooking} size="lg">
                {tr.bookCall}
              </NeonButton>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-3"
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
                <span className="text-white/58 font-medium">12+</span> {language === 'de' ? 'Unternehmen automatisieren bereits' : language === 'fr' ? 'entreprises déjà automatisées' : 'businesses already automating'}
              </p>
            </motion.div>
          </div>

          {/* ── Divider ── */}
          <div className="hidden md:block w-px self-stretch shrink-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.10) 20%, rgba(255,255,255,0.10) 80%, transparent)' }} />

          {/* ── Right: animated steps card ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isActive ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex flex-col gap-3 w-full max-w-[320px]"
          >
            <p className="text-white/30 text-xs tracking-[0.22em] uppercase mb-2">{tr.workWithUsDesc}</p>

            {steps.map((step, i) => {
              const lit = activeStep >= i
              return (
                <motion.div
                  key={i}
                  className="flex items-start gap-4 rounded-xl px-4 py-3.5"
                  animate={{
                    background: lit ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                    borderColor: lit ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
                  }}
                  transition={{ duration: 0.5 }}
                  style={{ border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {/* Number */}
                  <motion.span
                    className="text-xs font-mono shrink-0 mt-0.5"
                    animate={{ color: lit ? 'rgba(200,160,255,0.90)' : 'rgba(255,255,255,0.20)' }}
                    transition={{ duration: 0.4 }}
                  >
                    {step.num}
                  </motion.span>

                  <div className="flex flex-col gap-1 min-w-0">
                    {/* Step title */}
                    <motion.div className="flex items-center gap-2">
                      <motion.span
                        className="text-sm font-medium"
                        animate={{ color: lit ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.30)' }}
                        transition={{ duration: 0.4 }}
                      >
                        {step.text}
                      </motion.span>
                      {lit && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          <CheckCircle style={{ width: 12, height: 12, color: 'rgba(52,211,153,0.85)' }} />
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}

            <motion.p
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: 1 } : {}}
              transition={{ delay: 1.2 }}
              className="text-white/20 text-[10px] tracking-wider mt-2"
            >
              {tr.agencyNote}
            </motion.p>
          </motion.div>

        </div>

      </div>
    </SectionReveal>
  )
}
