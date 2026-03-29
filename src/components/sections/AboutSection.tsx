import { motion } from 'framer-motion'
import { SectionReveal } from '../ui/SectionReveal'
import { CheckCircle, TrendingUp, Clock, Zap, Users } from 'lucide-react'
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

          {/* Right: Impact metrics card (hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={isActive ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 hidden md:flex"
          >
            <div
              className="relative rounded-2xl overflow-hidden flex flex-col gap-0"
              style={{
                width: 240,
                background: 'linear-gradient(160deg, rgba(115,70,210,0.14) 0%, rgba(75,35,155,0.10) 50%, rgba(40,14,88,0.18) 100%)',
                border: '1px solid rgba(140,90,255,0.20)',
                boxShadow: '0 24px 64px rgba(80,30,180,0.20), 0 0 0 0.5px rgba(160,110,255,0.12), inset 0 1px 0 rgba(200,160,255,0.14)',
              }}
            >
              {/* Top shimmer */}
              <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(180,130,255,0.5) 45%, rgba(255,255,255,0.22) 55%, rgba(150,100,255,0.3) 75%, transparent 90%)' }}
              />

              {/* Header row */}
              <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                    style={{ willChange: 'opacity' }}
                  />
                  <span className="text-[9px] tracking-[0.25em] uppercase font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Live Impact</span>
                </div>
                <p className="text-white/70 text-[11px] leading-snug">Client automations running</p>
              </div>

              {/* Metric rows */}
              {[
                { icon: Clock, label: 'Hours saved / week', value: '20+', color: 'rgba(130,200,255,0.9)', bg: 'rgba(100,180,255,0.08)', border: 'rgba(100,180,255,0.20)' },
                { icon: Zap, label: 'Avg. time to launch', value: '3 wks', color: 'rgba(200,160,255,0.9)', bg: 'rgba(160,100,255,0.08)', border: 'rgba(140,90,255,0.22)' },
                { icon: TrendingUp, label: 'Integrations supported', value: '250+', color: 'rgba(100,230,160,0.9)', bg: 'rgba(80,210,140,0.07)', border: 'rgba(80,200,140,0.20)' },
                { icon: Users, label: 'Availability', value: '24/7', color: 'rgba(255,200,100,0.9)', bg: 'rgba(230,170,60,0.07)', border: 'rgba(220,165,60,0.22)' },
              ].map(({ icon: Icon, label, value, color, bg, border }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={isActive ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.55 + i * 0.1, duration: 0.45 }}
                  className="flex items-center gap-3 px-5 py-3.5"
                  style={{ borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: bg, border: `1px solid ${border}` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/35 text-[9px] tracking-wide leading-none mb-0.5">{label}</p>
                    <p className="text-white/88 text-sm font-semibold leading-none" style={{ letterSpacing: '-0.01em' }}>{value}</p>
                  </div>
                </motion.div>
              ))}

              {/* Bottom glow accent */}
              <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(100,50,200,0.18) 0%, transparent 70%)' }}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </SectionReveal>
  )
}
