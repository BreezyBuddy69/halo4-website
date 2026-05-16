import { motion, AnimatePresence } from 'framer-motion'
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
  const labels = [tr.navHome, tr.navVideo, tr.navResults, tr.navWork, tr.navAbout, tr.navBook]
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <nav className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-1 items-start">
      {labels.map((label, i) => {
        const isActive = i === currentSection
        const isHovered = hoveredIdx === i
        const dist = Math.abs(i - currentSection)

        const scale = isActive ? 1 : dist === 1 ? 0.88 : 0.78
        const opacity = isActive ? 1 : dist === 1 ? 0.6 : 0.4

        return (
          <motion.button
            key={i}
            onClick={() => onNavigate(i)}
            onHoverStart={() => { setHoveredIdx(i); onNavigate(i) }}
            onHoverEnd={() => setHoveredIdx(null)}
            animate={{ scale, opacity, x: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280, mass: 0.7 }}
            className="relative flex items-center gap-2 rounded-full text-left px-3 py-1.5"
            style={{
              transformOrigin: 'left center',
              color: isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.7)',
              background: isActive
                ? 'rgba(8, 5, 26, 0.82)'
                : 'rgba(8, 5, 26, 0.60)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: isActive
                ? '1px solid rgba(139,92,246,0.30)'
                : '1px solid rgba(139,92,246,0.10)',
              boxShadow: isActive
                ? '0 0 14px rgba(139,92,246,0.15)'
                : 'none',
            }}
          >
            {/* Active glow pill */}
            {isActive && (
              <motion.span
                layoutId="sidenav-active"
                className="absolute inset-0 rounded-full"
                style={{ background: 'rgba(139, 92, 246, 0.08)' }}
                transition={{ type: 'spring', damping: 22, stiffness: 260, mass: 0.8 }}
              />
            )}

            {isActive ? (
              <motion.span
                layoutId="sidenav-dot"
                className="w-1.5 h-1.5 rounded-full shrink-0 relative z-10"
                style={{ background: 'rgba(139, 92, 246, 0.9)', boxShadow: '0 0 6px rgba(139,92,246,0.7)' }}
                transition={{ type: 'spring', damping: 22, stiffness: 260, mass: 0.8 }}
              />
            ) : (
              <span className="w-1 h-1 rounded-full bg-white/20 shrink-0 relative z-10" />
            )}

            <span className="text-[10px] font-medium tracking-[0.18em] relative z-10">{label}</span>

            <AnimatePresence>
              {isHovered && !isActive && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-[9px] text-white/35 whitespace-nowrap overflow-hidden relative z-10"
                >
                  {i === 0 ? 'Brand' : i === 1 ? 'Intro' : i === 2 ? 'ROI' : i === 3 ? 'Solutions' : i === 4 ? 'About' : 'Book'}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}
    </nav>
  )
}
