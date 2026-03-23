import { motion } from 'framer-motion'
import { SectionReveal } from '../ui/SectionReveal'
import { User, CheckCircle } from 'lucide-react'
import type { Language } from '../../utils/translations'

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
      { title: 'Full transparency & live dashboard', desc: 'No hidden costs. See exactly what you pay for — and watch your automation revenue in real time.' },
      { title: 'Live in 2–4 weeks, done-for-you', desc: 'From first call to running system in 2–4 weeks. No code, no effort on your end.' },
      { title: 'Long-term support', desc: 'Monitoring and improvements long after launch — the system keeps performing.' },
    ],
    photo: 'Photo coming soon',
  },
  de: {
    label: 'Über Uns',
    heading: 'Warum Halo AI.',
    body: 'Wir sind eine spezialisierte KI-Agentur — kein Baukasten, keine Vorlagen. Jedes System wird von Grund auf für Ihr Unternehmen entwickelt. Wir übernehmen 100 % der technischen Arbeit und übergeben alles betriebsbereit.',
    reasons: [
      { title: 'Volle Transparenz & Live-Dashboard', desc: 'Keine versteckten Kosten. Sehen Sie exakt, wofür Sie zahlen — und Ihren Automatisierungs-Umsatz in Echtzeit.' },
      { title: 'Live in 2–4 Wochen, komplett für Sie', desc: 'Vom ersten Gespräch bis zum laufenden System in 2–4 Wochen. Kein Code, kein Aufwand Ihrerseits.' },
      { title: 'Langfristiger Support', desc: 'Überwachung und Weiterentwicklung weit über den Launch hinaus — das System bleibt leistungsstark.' },
    ],
    photo: 'Foto folgt in Kürze',
  },
  fr: {
    label: 'À Propos',
    heading: 'Pourquoi Halo AI.',
    body: "Nous sommes une agence IA spécialisée — pas de modèles, pas d'outils génériques. Chaque système est construit de zéro pour votre entreprise. Nous gérons 100 % du travail technique et vous livrons tout prêt à fonctionner.",
    reasons: [
      { title: 'Transparence totale & tableau de bord live', desc: 'Aucun coût caché. Voyez exactement ce que vous payez — et vos revenus d\'automatisation en temps réel.' },
      { title: 'Opérationnel en 2–4 semaines, fait pour vous', desc: 'Du premier appel au système en production en 2–4 semaines. Aucun code, aucun effort de votre côté.' },
      { title: 'Accompagnement à long terme', desc: 'Suivi et améliorations bien après le lancement — le système continue de performer.' },
    ],
    photo: 'Photo à venir',
  },
}

export function AboutSection({ language, isActive }: AboutSectionProps) {
  const c = content[language]

  return (
    <SectionReveal isActive={isActive}>
      <div className="relative w-full h-full overflow-hidden bg-[#17152e] m-bg-about flex items-center">

        {/* Rich purple radial */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 75% 80% at 50% 50%, rgba(95,55,185,0.52) 0%, rgba(65,35,140,0.32) 30%, rgba(34,16,75,0.14) 58%, transparent 78%), radial-gradient(ellipse 42% 48% at 50% 50%, rgba(115,70,210,0.22) 0%, transparent 44%)',
        }} />
        {/* Pink hint — right side, pointing toward Book */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 45% 55% at 90% 40%, rgba(140,60,180,0.12) 0%, transparent 58%)',
        }} />

        {/* Edge fades */}
        <div className="absolute top-0 inset-x-0 h-20 pointer-events-none z-10 m-edge-fade"
          style={{ background: 'linear-gradient(to bottom, #17152e, transparent)' }} />
        <div className="absolute bottom-0 inset-x-0 h-20 pointer-events-none z-10 m-edge-fade"
          style={{ background: 'linear-gradient(to top, #17152e, transparent)' }} />

        {/* Content layout */}
        <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 px-6 md:pl-[20%] md:pr-16 pt-16 pb-16">

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

          {/* Right: photo placeholder (hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isActive ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 hidden md:flex"
          >
            <div
              className="relative rounded-2xl overflow-hidden flex flex-col items-center justify-center"
              style={{
                width: 240,
                height: 320,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {/* Placeholder person silhouette */}
              <div className="flex flex-col items-center gap-4">
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: 80,
                    height: 80,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.09)',
                  }}
                >
                  <User className="w-9 h-9 text-white/12" />
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="h-1.5 w-20 rounded-full bg-white/[0.06]" />
                  <div className="h-1.5 w-14 rounded-full bg-white/[0.04]" />
                </div>
              </div>

              {/* Bottom caption */}
              <div
                className="absolute bottom-0 left-0 right-0 px-4 py-3 text-center"
                style={{ background: 'linear-gradient(to top, rgba(7,6,13,0.6), transparent)' }}
              >
                <p className="text-white/20 text-[9px] tracking-widest uppercase">{c.photo}</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </SectionReveal>
  )
}
