import { motion, AnimatePresence } from 'framer-motion'
import { SectionReveal } from '../ui/SectionReveal'
import { AnimatedBg } from '../ui/AnimatedBg'
import { CheckCircle } from 'lucide-react'
import type { Language } from '../../utils/translations'
import { DotPattern } from '../ui/dot-pattern-1'
import { useEffect, useState, useRef } from 'react'


interface AboutSectionProps {
  language: Language
  isActive: boolean
  onBooking: () => void
}

const content = {
  en: {
    label: 'About Us',
    heading: 'Why Halo AI.',
    body: "We're a specialized AI agency — no templates, no generic tools. Every system is built from scratch for your business. We handle 100% of the technical work and hand it over ready to run.",
    reasons: [
      { title: 'Full transparency', desc: 'No hidden costs. Real-time revenue dashboard.' },
      { title: 'Live in 2–4 weeks', desc: 'Zero code. Zero effort. Just results.' },
      { title: 'Long-term support', desc: 'We maintain and improve your system post-launch.' },
    ],
    photoLabel: 'Your photo here',
    aiosCallout: 'You don\'t have to start with everything.',
    aiosCalloutSub: 'Begin with one automation. As results compound, we gradually wrap your entire company in a custom AI Operating System — built around how you actually work.',
    aiosBadge: 'AIOS — AI Operating System',
  },
  de: {
    label: 'Über Uns',
    heading: 'Warum Halo AI.',
    body: 'Wir sind eine spezialisierte KI-Agentur — kein Baukasten, keine Vorlagen. Jedes System wird von Grund auf für Ihr Unternehmen entwickelt. Wir übernehmen 100 % der technischen Arbeit und übergeben alles betriebsbereit.',
    reasons: [
      { title: 'Volle Transparenz', desc: 'Keine versteckten Kosten. Umsatz-Dashboard in Echtzeit.' },
      { title: 'Live in 2–4 Wochen', desc: 'Kein Code. Kein Aufwand. Nur Ergebnisse.' },
      { title: 'Langfristiger Support', desc: 'Wir betreuen das System dauerhaft nach dem Launch.' },
    ],
    photoLabel: 'Ihr Foto hier',
    aiosCallout: 'Du musst nicht mit allem auf einmal starten.',
    aiosCalloutSub: 'Beginne mit einer einzigen Automatisierung. Während die Ergebnisse wachsen, bauen wir schrittweise ein vollständiges KI-Betriebssystem um dein Unternehmen — maßgeschneidert für deine Arbeitsweise.',
    aiosBadge: 'AIOS — KI-Betriebssystem',
  },
  fr: {
    label: 'À Propos',
    heading: 'Pourquoi Halo AI.',
    body: "Nous sommes une agence IA spécialisée — pas de modèles, pas d'outils génériques. Chaque système est construit de zéro pour votre entreprise. Nous gérons 100 % du travail technique et vous livrons tout prêt à fonctionner.",
    reasons: [
      { title: 'Transparence totale', desc: 'Aucun coût caché. Tableau de bord en temps réel.' },
      { title: 'Opérationnel en 2–4 semaines', desc: 'Zéro code. Zéro effort. Juste des résultats.' },
      { title: 'Accompagnement à long terme', desc: 'Nous maintenons et améliorons votre système après le lancement.' },
    ],
    photoLabel: 'Votre photo ici',
    aiosCallout: 'Pas besoin de tout démarrer d\'un coup.',
    aiosCalloutSub: "Commencez par une seule automatisation. Au fil des résultats, nous construisons progressivement un système d'exploitation IA complet autour de votre entreprise — adapté à votre façon de travailler.",
    aiosBadge: 'AIOS — Système d\'exploitation IA',
  },
}

function TypewriterRow({
  title,
  desc,
  active,
  onDone,
}: {
  title: string
  desc: string
  active: boolean
  onDone: () => void
}) {
  const full = `${title} — ${desc}`
  const [chars, setChars] = useState(0)
  const [done, setDone] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!active) return
    setChars(0)
    setDone(false)

    let i = 0
    const tick = () => {
      i++
      setChars(i)
      if (i < full.length) {
        timerRef.current = setTimeout(tick, 30)
      } else {
        timerRef.current = setTimeout(() => {
          setDone(true)
          setTimeout(onDone, 220)
        }, 80)
      }
    }
    timerRef.current = setTimeout(tick, 0)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [active])

  const displayed = full.slice(0, chars)
  const titleLen = title.length
  const shownTitle = displayed.slice(0, titleLen)
  const shownRest = displayed.slice(titleLen)

  return (
    <div className="flex items-start gap-3">
      <div className="w-3.5 h-3.5 shrink-0 mt-[3px] relative">
        <motion.div
          initial={false}
          animate={done ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className="absolute inset-0"
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
        </motion.div>
      </div>

      <p className="text-sm leading-snug">
        <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{shownTitle}</span>
        <span style={{ color: 'rgba(255,255,255,0.45)' }}>{shownRest}</span>
        {active && !done && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              display: 'inline-block',
              width: 2,
              height: 13,
              background: 'rgba(180,130,255,0.9)',
              marginLeft: 2,
              verticalAlign: 'middle',
              borderRadius: 1,
            }}
          />
        )}
      </p>
    </div>
  )
}

const bookingLabel = { en: 'Book a Call', de: 'Jetzt Buchen', fr: 'Réserver' }

export function AboutSection({ language, isActive, onBooking }: AboutSectionProps) {
  const c = content[language]
  const [currentRow, setCurrentRow] = useState(-1)
  const [showBookingBtn, setShowBookingBtn] = useState(false)

  useEffect(() => {
    if (isActive) {
      setCurrentRow(0)
      const timer = setTimeout(() => setShowBookingBtn(true), 50000)
      return () => clearTimeout(timer)
    } else {
      setCurrentRow(-1)
      setShowBookingBtn(false)
    }
  }, [isActive])

  return (
    <SectionReveal isActive={isActive}>
      <div className="relative w-full h-full overflow-hidden m-bg-about flex items-center">

        {/* Rich purple radial */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 75% 80% at 50% 50%, rgba(95,55,185,0.52) 0%, rgba(65,35,140,0.32) 30%, rgba(34,16,75,0.14) 58%, transparent 78%), radial-gradient(ellipse 42% 48% at 50% 50%, rgba(115,70,210,0.22) 0%, transparent 44%)',
        }} />
        {/* Pink hint — right side, pointing toward Book */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 45% 55% at 90% 40%, rgba(140,60,180,0.12) 0%, transparent 58%)',
        }} />

        {/* ── Animation C: Aurora Sweep ── */}
        <AnimatedBg variant="aurora" isActive={isActive} />

        {/* Edge fades */}
        <div className="absolute top-0 inset-x-0 h-20 pointer-events-none z-10 m-edge-fade"
          style={{ background: 'linear-gradient(to bottom, #17152e, transparent)' }} />
        <div className="absolute bottom-0 inset-x-0 h-20 pointer-events-none z-10 m-edge-fade"
          style={{ background: 'linear-gradient(to top, #17152e, transparent)' }} />

        {/* Content layout */}
        <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 lg:gap-20 px-6 md:pl-[13%] lg:pl-[20%] md:pr-10 lg:pr-16 pt-16 pb-16">

          {/* Left: text */}
          <div className="flex-1 max-w-lg">
            <motion.p
              initial={{ opacity: 0 }}
              animate={isActive ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="text-white/35 max-md:text-white/62 text-[11px] tracking-[0.35em] uppercase mb-6"
            >
              {c.label}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-white leading-[0.92] tracking-tight mb-4 md:mb-6"
              style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)' }}
            >
              {c.heading}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.55 }}
              className="text-white/55 text-sm leading-relaxed mb-5 md:mb-8 max-w-md"
            >
              {c.body}
            </motion.p>

            {/* Quote box */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isActive ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.75, duration: 0.55 }}
              className="mt-6 md:mt-8"
            >
              <div
                className="relative"
                style={{ border: '1px solid rgba(160,100,255,0.45)' }}
              >
                <DotPattern width={5} height={5} className="fill-purple-400/20" />
                {/* Corner dots */}
                <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-purple-400" style={{ opacity: 0.85 }} />
                <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-purple-400" style={{ opacity: 0.85 }} />
                <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-purple-400" style={{ opacity: 0.85 }} />
                <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-purple-400" style={{ opacity: 0.85 }} />
                <div className="relative z-20 p-5 flex flex-col gap-4">
                  {c.reasons.map((r, i) => (
                    <TypewriterRow
                      key={`${language}-${i}`}
                      title={r.title}
                      desc={r.desc}
                      active={currentRow === i}
                      onDone={() => setCurrentRow(i + 1)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right: Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={isActive ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 hidden md:flex"
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                width: 220,
                height: 300,
                boxShadow: '0 24px 64px rgba(80,30,180,0.28), inset 0 1px 0 rgba(200,160,255,0.08)',
                border: '1px solid rgba(180,130,255,0.18)',
              }}
            >
              <img
                src="/gallery/WhatsApp Image 2026-04-04 at 18.13.03.jpeg"
                alt="Team"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 35%',
                  transform: 'scale(1.2)',
                  transformOrigin: 'center 35%',
                }}
              />
              {/* Subtle purple tint overlay */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(80,30,180,0.35) 0%, transparent 55%)' }}
              />
            </div>
          </motion.div>

        </div>

        {/* Delayed booking CTA — appears after 50 seconds of reading */}
        <AnimatePresence>
          {showBookingBtn && (
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.94 }}
              transition={{ type: 'spring', damping: 18, stiffness: 200 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/40 text-[10px] tracking-[0.22em] uppercase"
              >
                {language === 'de' ? 'Bereit loszulegen?' : language === 'fr' ? 'Prêt à commencer ?' : 'Ready to get started?'}
              </motion.p>
              <button
                onClick={onBooking}
                className="group relative px-8 py-3 rounded-full text-sm font-medium tracking-wider overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(160,100,255,0.18) 0%, rgba(100,60,220,0.14) 100%)',
                  border: '1px solid rgba(180,130,255,0.40)',
                  boxShadow: '0 0 32px rgba(140,80,255,0.22), 0 0 64px rgba(140,80,255,0.10), inset 0 1px 0 rgba(220,180,255,0.14)',
                  color: 'rgba(230,205,255,0.92)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                {/* Animated glow sweep */}
                <motion.span
                  className="absolute inset-0 rounded-full pointer-events-none"
                  animate={{ opacity: [0, 0.18, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(180,130,255,0.5), transparent)' }}
                />
                <span className="relative z-10">{bookingLabel[language]}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionReveal>
  )
}
