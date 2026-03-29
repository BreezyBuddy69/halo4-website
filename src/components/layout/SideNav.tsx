import { motion } from 'framer-motion'
import { useState } from 'react'
import type { Language } from '../../utils/translations'
import { t } from '../../utils/translations'

interface SideNavProps {
  currentSection: number
  onNavigate: (i: number) => void
  language: Language
}

export function SideNav({ currentSection, onNavigate, language }: SideNavProps) {
  const tr = t(language)
  const labels = [tr.navHome, tr.navVideo, tr.navResults, tr.navWork, tr.navAbout, tr.navProcess, tr.navBook]
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <nav className="hidden md:flex fixed left-5 top-1/2 -translate-y-1/2 z-40 flex-col gap-2">
      {labels.map((label, i) => {
        const isActive = i === currentSection
        const isHovered = hoveredIdx === i

        return (
          <motion.button
            key={i}
            data-cursor="hover"
            onClick={() => onNavigate(i)}
            onHoverStart={() => { setHoveredIdx(i); onNavigate(i) }}
            onHoverEnd={() => setHoveredIdx(null)}
            animate={{
              scale: isHovered ? 1.06 : isActive ? 1.02 : 1,
              x: isHovered ? 3 : 0,
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.6 }}
            className="relative flex items-center gap-2.5 rounded-full text-left overflow-hidden"
            style={{
              paddingLeft: 12,
              paddingRight: 18,
              paddingTop: 8,
              paddingBottom: 8,
              background: isActive
                ? 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0.12) 100%)'
                : isHovered
                ? 'linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.05) 60%, rgba(255,255,255,0.09) 100%)'
                : 'linear-gradient(135deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.18) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: isActive
                ? '1px solid rgba(255,255,255,0.32)'
                : isHovered
                ? '1px solid rgba(255,255,255,0.20)'
                : '1px solid rgba(255,255,255,0.08)',
              boxShadow: isActive
                ? '0 6px 28px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.18) inset, 0 -1px 0 rgba(0,0,0,0.12) inset'
                : isHovered
                ? '0 4px 20px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.14) inset'
                : '0 2px 10px rgba(0,0,0,0.20), 0 1px 0 rgba(255,255,255,0.06) inset',
              color: isActive
                ? 'rgba(255,255,255,0.96)'
                : isHovered
                ? 'rgba(255,255,255,0.75)'
                : 'rgba(255,255,255,0.35)',
              transition: 'background 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease, color 0.28s ease',
            }}
          >
            {/* Gloss line top */}
            <span
              className="absolute top-0 left-5 right-5 h-px pointer-events-none"
              style={{
                background: isActive || isHovered
                  ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.50), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
                transition: 'opacity 0.28s ease',
              }}
            />

            {/* Dot */}
            <motion.span
              className="shrink-0 rounded-full relative z-10"
              animate={{
                width: isActive ? 7 : 5,
                height: isActive ? 7 : 5,
                backgroundColor: isActive
                  ? 'rgba(255,255,255,1)'
                  : isHovered
                  ? 'rgba(255,255,255,0.60)'
                  : 'rgba(255,255,255,0.20)',
                boxShadow: isActive
                  ? '0 0 8px 2px rgba(255,255,255,0.45)'
                  : isHovered
                  ? '0 0 5px 1px rgba(255,255,255,0.20)'
                  : '0 0 0px rgba(255,255,255,0)',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 26 }}
            />

            {/* Label */}
            <motion.span
              className="relative z-10 whitespace-nowrap font-medium tracking-[0.15em]"
              animate={{ fontSize: isActive ? '11px' : '10px' }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            >
              {label}
            </motion.span>
          </motion.button>
        )
      })}
    </nav>
  )
}
