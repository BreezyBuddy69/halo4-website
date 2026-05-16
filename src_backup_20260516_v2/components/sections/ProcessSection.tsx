import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionReveal } from '../ui/SectionReveal'
import { NeonButton } from '../ui/NeonButton'
import { t } from '../../utils/translations'
import type { Language } from '../../utils/translations'
import { ArrowRight } from 'lucide-react'

interface ProcessSectionProps {
  language: Language
  isActive: boolean
  onBooking: () => void
}

export function ProcessSection({ language, isActive, onBooking }: ProcessSectionProps) {
  const tr = t(language)
  const [activeStep, setActiveStep] = useState(0)

  const stepTitles = {
    en: ['Discovery', 'Plan', 'Build', 'Launch'],
    de: ['Gespräch', 'Plan', 'Umsetzung', 'Live'],
    fr: ['Appel', 'Plan', 'Construction', 'Live'],
  }
  const titles = stepTitles[language]
  const steps = [
    { num: '01', title: titles[0], desc: tr.planStep1.replace(/^1\.[^:]+:\s*/, '') },
    { num: '02', title: titles[1], desc: tr.planStep2.replace(/^2\.[^:]+:\s*/, '') },
    { num: '03', title: titles[2], desc: tr.planStep3.replace(/^3\.[^:]+:\s*/, '') },
    { num: '04', title: titles[3], desc: tr.planStep4.replace(/^4\.[^:]+:\s*/, '') },
  ]

  // Auto-advance every 5 seconds when active
  useEffect(() => {
    if (!isActive) return
    const timer = setTimeout(() => {
      setActiveStep(s => s < steps.length - 1 ? s + 1 : 0)
    }, 5000)
    return () => clearTimeout(timer)
  }, [activeStep, isActive, steps.length])

  return (
    <SectionReveal isActive={isActive}>
      <div className="relative w-full h-full overflow-hidden m-bg-process">

        {/* Deep purple with pink edge — bridging toward Book */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 65% at 18% 22%, rgba(105,48,210,0.36) 0%, rgba(78,34,165,0.20) 42%, transparent 70%), radial-gradient(ellipse 40% 45% at 78% 80%, rgba(140,55,195,0.24) 0%, transparent 55%)',
        }} />
        {/* Subtle top-edge purple shimmer */}
        <div className="absolute top-0 inset-x-0 h-px pointer-events-none" style={{
          background: 'linear-gradient(to right, transparent 0%, rgba(160,100,255,0.28) 30%, rgba(180,120,255,0.35) 55%, rgba(140,80,240,0.22) 80%, transparent 100%)',
        }} />

        {/* Giant step number — decorative background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-[-2vw] bottom-[-14vh] pointer-events-none select-none"
          >
            <span
              className="font-serif text-white leading-none"
              style={{ fontSize: 'clamp(12rem, 60vw, 80rem)', opacity: 0.09 }}
            >
              {steps[activeStep].num}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center px-6 md:pl-[20%] md:pr-12 lg:pl-[24%] pt-16 pb-16">

          {/* Section label */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-white text-xl md:text-3xl font-bold tracking-tight mb-6"
          >
            {tr.processTitle}
          </motion.p>

          {/* Step indicator pills — wrap on mobile, single row on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap md:flex-nowrap gap-2 mb-8"
          >
            {steps.map((step, i) => (
              <button
                key={i}
               
                onClick={() => setActiveStep(i)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide whitespace-nowrap overflow-hidden"
                style={{
                  border: activeStep >= i ? '1px solid rgba(160,100,255,0.40)' : '1px solid rgba(255,255,255,0.08)',
                  color: activeStep >= i ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.30)',
                  transition: 'color 0.3s ease, border-color 0.3s ease',
                }}
              >
                {/* Liquid fill — sweeps left-to-right when step becomes active, stays for completed */}
                {activeStep >= i && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'rgba(110,55,210,0.25)', originX: 0 }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                <span className="relative z-10 font-mono text-[9px] opacity-60">{step.num}</span>
                <span className="relative z-10">{step.title}</span>
              </button>
            ))}
          </motion.div>

          {/* Active step — LARGE title + description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4"
            >
              <h2 className="font-serif text-white leading-[0.92] tracking-tight"
                style={{ fontSize: 'clamp(3.8rem, 10vw, 8rem)' }}>
                {steps[activeStep].title}.
              </h2>

              <p className="text-white/60 max-md:text-white/82 text-sm md:text-lg leading-relaxed max-w-lg">
                {steps[activeStep].desc}
              </p>

            </motion.div>
          </AnimatePresence>

          {/* Next / Book button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="flex items-center mt-8"
          >
            {activeStep < steps.length - 1 ? (
              <button
               
                onClick={() => setActiveStep(s => s + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 max-md:border-white/30 text-white/50 max-md:text-white/78 text-xs whitespace-nowrap
                           hover:text-white/80 hover:border-white/30 transition-all"
              >
                {tr.nextStep} <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            ) : (
              <NeonButton onClick={onBooking} size="md" className="w-full md:w-auto">
                {tr.bookCall}
              </NeonButton>
            )}
          </motion.div>
        </div>

      </div>
    </SectionReveal>
  )
}
