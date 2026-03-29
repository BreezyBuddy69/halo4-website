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
    <nav className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-1.5">
      {labels.map((label, i) => {
        const isActive = i === currentSection
        const isHovered = hoveredIdx === i
        const lit = isActive || isHovered

        return (
          <motion.button
            key={i}
            data-cursor="hover"
            onClick={() => onNavigate(i)}
            onHoverStart={() => setHoveredIdx(i)}
            onHoverEnd={() => setHoveredIdx(null)}
            whileTap={{ scale: 0.96 }}
            className="relative flex items-center gap-2 rounded-full text-left overflow-hidden"
            style={{
              paddingLeft: 10,
              paddingRight: 14,
              paddingTop: 6,
              paddingBottom: 6,
              background: isActive
                ? 'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.07) 100%)'
                : isHovered
                ? 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)'
                : 'linear-gradient(135deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.18) 100%)',
              backdropFilter: 'blur(18px) saturate(160%)',
              WebkitBackdropFilter: 'blur(18px) saturate(160%)',
              border: isActive
                ? '1px solid rgba(255,255,255,0.28)'
                : '1px solid rgba(255,255,255,0.09)',
              boxShadow: isActive
                ? '0 4px 20px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.26)'
                : '0 2px 8px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)',
              color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.38)',
              transition: 'background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, color 0.22s ease',
            }}
          >
            {/* Top gloss */}
            <span className="absolute top-0 left-4 right-4 h-px pointer-events-none"
              style={{
                background: lit
                  ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
                transition: 'opacity 0.22s ease',
              }}
            />

            {/* Dot — always on left, animates between grey and white */}
            <motion.span
              layoutId={isActive ? 'sidenav-active-dot' : undefined}
              className="shrink-0 rounded-full relative z-10"
              style={{
                width: isActive ? 6 : 5,
                height: isActive ? 6 : 5,
                background: isActive
                  ? 'rgba(255,255,255,1)'
                  : isHovered
                  ? 'rgba(255,255,255,0.55)'
                  : 'rgba(255,255,255,0.22)',
                boxShadow: isActive ? '0 0 6px rgba(255,255,255,0.6)' : 'none',
                transition: 'background 0.22s ease, box-shadow 0.22s ease, width 0.22s ease, height 0.22s ease',
              }}
            />

            <span className="text-[10px] font-medium tracking-[0.16em] whitespace-nowrap relative z-10">
              {label}
            </span>
          </motion.button>
        )
      })}
    </nav>
  )
}
