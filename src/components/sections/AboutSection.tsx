import { motion } from 'framer-motion'
import { SectionReveal } from '../ui/SectionReveal'
import { AnimatedBg } from '../ui/AnimatedBg'
import { CheckCircle } from 'lucide-react'
import type { Language } from '../../utils/translations'
import { DotPattern } from '../ui/dot-pattern-1'

interface AboutSectionProps {
  language: Language
  isActive: boolean
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
  },
}

export function AboutSection({ language, isActive }: AboutSectionProps) {
  const c = content[language]

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
              className="text-white/55 text-sm leading-relaxed mb-5 md:mb-8 max-w-md hidden md:block"
            >
              {c.body}
            </motion.p>

            <div className="flex flex-col gap-3 md:gap-4">
              {c.reasons.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isActive ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.45 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-white/30 max-md:text-white/55 shrink-0 mt-0.5" />
                  <p className="text-sm leading-snug">
                    <span className="text-white/75 max-md:text-white/92 font-medium">{r.title}</span>
                    <span className="text-white/38 hidden md:inline"> — {r.desc}</span>
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Quote block with dot pattern */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={isActive ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 hidden md:flex items-center"
          >
            <div
              className="relative flex flex-col items-start"
              style={{
                width: 280,
                border: '1px solid rgba(160,100,255,0.45)',
              }}
            >
              {/* Dot pattern fill */}
              <DotPattern
                width={5}
                height={5}
                className="fill-purple-400/20"
              />

              {/* Corner dots */}
              <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-purple-400" style={{ opacity: 0.85 }} />
              <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-purple-400" style={{ opacity: 0.85 }} />
              <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-purple-400" style={{ opacity: 0.85 }} />
              <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-purple-400" style={{ opacity: 0.85 }} />

              {/* Quote content */}
              <div className="relative z-20 p-6">
                <p className="text-[10px] text-purple-300 tracking-[0.25em] uppercase mb-3">Philosophy</p>
                <blockquote className="text-white/85 font-serif leading-snug tracking-tight" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)' }}>
                  "AI should work for you — not the other way around."
                </blockquote>
                <p className="text-white/30 text-[11px] mt-4">— Halo AI</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </SectionReveal>
  )
}
