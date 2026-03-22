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

  const steps = [
    { num: '01', title: 'Audit', desc: tr.planStep1.replace('1. Audit: ', '').replace('1. Analyse: ', '') },
    { num: '02', title: 'Strategy', desc: tr.planStep2.replace('2. Strategy: ', '').replace('2. Planung: ', '').replace('2. Planification: ', '') },
    { num: '03', title: 'Build', desc: tr.planStep3.replace('3. Build: ', '').replace('3. Entwicklung: ', '').replace('3. Développement: ', '') },
    { num: '04', title: 'Go Live', desc: tr.planStep4.replace('4. Go Live: ', '').replace('4. Start: ', '').replace('4. Lancement: ', '') },
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
      <div className="relative w-full h-full overflow-hidden bg-[#0b0918]">

        {/* Deep purple with pink edge — bridging toward Book */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 65% at 18% 22%, rgba(105,48,210,0.22) 0%, rgba(78,34,165,0.12) 42%, transparent 70%), radial-gradient(ellipse 40% 45% at 78% 80%, rgba(140,55,195,0.14) 0%, transparent 55%)',
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
            className="text-white/30 text-[11px] md:text-sm tracking-[0.35em] uppercase mb-6"
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
                data-cursor="hover"
                onClick={() => setActiveStep(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide whitespace-nowrap transition-all duration-300
                  ${activeStep === i
                    ? 'text-white'
                    : 'border border-white/[0.08] text-white/30 hover:text-white/55 hover:border-white/20'
                  }`}
                style={activeStep === i ? { background: 'rgba(110,55,210,0.22)', border: '1px solid rgba(160,100,255,0.40)' } : {}}
              >
                <span className="font-mono text-[9px] opacity-60">{step.num}</span>
                <span>{step.title}</span>
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

              <p className="text-white/60 text-sm md:text-lg leading-relaxed max-w-lg">
                {steps[activeStep].desc}
              </p>

              <div className="flex items-center gap-3 mt-1">
                <span className="text-white/25 text-sm font-mono">{activeStep + 1} / {steps.length}</span>
                <div className="flex gap-1">
                  {steps.map((_, i) => (
                    <div key={i} className={`h-0.5 rounded-full transition-all duration-300 ${i === activeStep ? 'w-6 bg-purple-400/65' : 'w-3 bg-white/15'}`} />
                  ))}
                </div>
              </div>
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
                data-cursor="hover"
                onClick={() => setActiveStep(s => s + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 text-white/50 text-xs whitespace-nowrap
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
