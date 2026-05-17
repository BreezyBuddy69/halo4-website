import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SectionReveal } from '../ui/SectionReveal'
import { AnimatedBg } from '../ui/AnimatedBg'
import { t } from '../../utils/translations'
import type { Language } from '../../utils/translations'

interface ResultsSectionProps {
  language: Language
  isActive: boolean
}

function CountUp({ target, suffix = '', duration = 1800 }: { target: number; suffix?: string; duration?: number }) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])

  return <>{value}{suffix}</>
}

export function ResultsSection({ language, isActive }: ResultsSectionProps) {
  const tr = t(language)

  const testimonialLinks = [
    'https://www.linkedin.com',
    'https://www.instagram.com',
    'https://twitter.com',
    'https://www.facebook.com',
    'https://teams.microsoft.com',
  ]

  const stats = [
    { value: 20, suffix: '+', label: tr.statHrs },
    { value: 24, suffix: '/7', label: tr.statAvailability },
    { value: 250, suffix: '+', label: tr.statIntegrations },
  ]

  return (
    <SectionReveal isActive={isActive}>
      <div className="relative w-full h-full overflow-hidden m-bg-results">
        {/* Blue-to-purple atmospheric gradient */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(42,58,165,0.50) 0%, rgba(28,38,118,0.30) 35%, rgba(14,18,60,0.14) 65%, transparent 82%), radial-gradient(ellipse 55% 60% at 50% 50%, rgba(58,72,190,0.22) 0%, transparent 50%)',
        }} />
        {/* Purple accent glow — right side */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: '60vw',
            height: '60vh',
            background: 'radial-gradient(ellipse, rgba(75,55,185,0.14) 0%, transparent 65%)',
            top: '20%',
            right: '-10%',
          }}
        />

        {/* ── Animation: Drift Lines ── */}
        <AnimatedBg variant="driftlines" isActive={isActive} />

        <div className="relative z-10 w-full h-full flex flex-col md:flex-row pl-8 md:pl-[13rem] lg:pl-[20rem] pr-8 md:pr-10 lg:pr-20 pt-20 pb-12 gap-8 md:gap-12 lg:gap-24" style={{ position: 'relative', zIndex: 10 }}>

          {/* Left: stats — dominant, centered vertically */}
          <div className="flex flex-col justify-center gap-10 flex-shrink-0 md:w-[220px] lg:w-[300px]">
            <motion.p
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="text-white/30 max-md:text-white/58 text-xs tracking-[0.3em] uppercase"
            >
              {tr.whyUsTitle}
            </motion.p>

            <div className="flex flex-row md:flex-col gap-6 md:gap-10">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -24 }}
                  animate={isActive ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="text-5xl md:text-8xl lg:text-9xl font-serif text-white leading-none tracking-tight">
                    {isActive && <CountUp target={s.value} suffix={s.suffix} />}
                  </div>
                  <p className="text-white/35 max-md:text-white/62 text-xs md:text-sm tracking-widest uppercase mt-2">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Why us reasons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: 1 } : {}}
              transition={{ delay: 0.85 }}
              className="hidden md:flex flex-col gap-2"
            >
              {tr.reasons.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-white/25 shrink-0" />
                  <span className="text-white/35 text-xs">{r}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px self-stretch shrink-0" style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.08) 80%, transparent)' }} />

          {/* Right: testimonials — capped width */}
          <div className="flex flex-col justify-center gap-4 flex-1 min-w-0 max-w-[560px] md:pl-8 lg:pl-12">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl font-serif text-white mb-1"
            >
              {tr.testimonialsTitle}.
            </motion.h2>

            <div className="flex flex-col gap-5">
              {tr.testimonials.slice(0, 3).map((review, i) => {
                const accentPalette = [
                  { border: 'rgba(120,140,255,0.28)', glow: 'rgba(100,120,255,0.06)', avatar: 'linear-gradient(135deg, rgba(100,120,255,0.30) 0%, rgba(80,100,220,0.18) 100%)', avatarBorder: 'rgba(120,140,255,0.30)', starColor: 'rgba(180,195,255,0.90)' },
                  { border: 'rgba(190,110,255,0.26)', glow: 'rgba(170,90,255,0.06)', avatar: 'linear-gradient(135deg, rgba(180,100,255,0.28) 0%, rgba(140,70,220,0.16) 100%)', avatarBorder: 'rgba(190,110,255,0.28)', starColor: 'rgba(210,160,255,0.90)' },
                  { border: 'rgba(52,211,153,0.24)', glow: 'rgba(52,211,153,0.05)', avatar: 'linear-gradient(135deg, rgba(52,211,153,0.24) 0%, rgba(32,180,130,0.14) 100%)', avatarBorder: 'rgba(52,211,153,0.26)', starColor: 'rgba(100,230,170,0.90)' },
                  { border: 'rgba(139,92,246,0.24)', glow: 'rgba(109,40,217,0.05)', avatar: 'linear-gradient(135deg, rgba(139,92,246,0.24) 0%, rgba(109,40,217,0.14) 100%)', avatarBorder: 'rgba(139,92,246,0.26)', starColor: 'rgba(167,139,250,0.90)' },
                  { border: 'rgba(196,181,253,0.26)', glow: 'rgba(167,139,250,0.05)', avatar: 'linear-gradient(135deg, rgba(196,181,253,0.26) 0%, rgba(167,139,250,0.14) 100%)', avatarBorder: 'rgba(196,181,253,0.28)', starColor: 'rgba(221,214,254,0.90)' },
                ]
                const accent = accentPalette[i % accentPalette.length]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={isActive ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a
                      href={testimonialLinks[i % testimonialLinks.length]}
                      target="_blank"
                      rel="noopener noreferrer"
                     
                      className="block group"
                    >
                      <div
                        className="px-4 py-3 flex flex-col gap-2.5 m-card relative"
                        style={{
                          background: `linear-gradient(135deg, ${accent.glow.replace('0.06', '0.09')} 0%, rgba(255,255,255,0.02) 100%)`,
                          border: `1px solid ${accent.border}`,
                          boxShadow: `0 4px 24px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                          transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLDivElement
                          el.style.background = `linear-gradient(135deg, ${accent.glow.replace('0.06', '0.15')} 0%, rgba(255,255,255,0.04) 100%)`
                          el.style.borderColor = accent.border.replace('0.28', '0.45').replace('0.26', '0.42').replace('0.24', '0.40')
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLDivElement
                          el.style.background = `linear-gradient(135deg, ${accent.glow.replace('0.06', '0.09')} 0%, rgba(255,255,255,0.02) 100%)`
                          el.style.borderColor = accent.border
                        }}
                      >
                        {/* Corner dots */}
                        <div className="absolute -left-1.5 -top-1.5 h-3 w-3 z-30" style={{ background: accent.starColor, opacity: 0.75 }} />
                        <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 z-30" style={{ background: accent.starColor, opacity: 0.75 }} />
                        <div className="absolute -right-1.5 -top-1.5 h-3 w-3 z-30" style={{ background: accent.starColor, opacity: 0.75 }} />
                        <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 z-30" style={{ background: accent.starColor, opacity: 0.75 }} />
                        {/* Star rating */}
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, s) => (
                            <svg key={s} width="9" height="9" viewBox="0 0 10 10" fill="none">
                              <path d="M5 1l1.12 2.27 2.5.36-1.81 1.76.43 2.49L5 6.77 2.76 7.88l.43-2.49L1.38 3.63l2.5-.36L5 1z"
                                fill={accent.starColor} />
                            </svg>
                          ))}
                        </div>

                        <p className="text-white/58 max-md:text-white/82 text-xs leading-relaxed line-clamp-3">"{review.review}"</p>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[9px] text-white/80 font-semibold"
                              style={{ background: accent.avatar, border: `1px solid ${accent.avatarBorder}` }}
                            >
                              {review.name[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-white/65 max-md:text-white/88 text-[11px] font-medium truncate">{review.name}</p>
                              <p className="text-white/30 max-md:text-white/55 text-[10px] truncate">{review.role}</p>
                            </div>
                          </div>
                          <span className="text-white/18 text-[9px] tracking-wider whitespace-nowrap group-hover:text-white/48 transition-colors shrink-0">
                            ↗
                          </span>
                        </div>
                      </div>
                    </a>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </SectionReveal>
  )
}
