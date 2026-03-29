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
  const labels = [tr.navHome, tr.navVideo, tr.navResults, tr.navWork, tr.navAbout, tr.navProcess, tr.navBook]
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <nav data-cursor="hover" className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-0.5 px-2 py-2.5 rounded-2xl"
      style={{
        background: 'rgba(8,5,20,0.42)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
      }}
    >
      {labels.map((label, i) => {
        const isActive = i === currentSection
        const isHovered = hoveredIdx === i

        return (
          <motion.button
            key={i}
            data-cursor="hover"
            layout
            onClick={() => onNavigate(i)}
            onHoverStart={() => { setHoveredIdx(i); onNavigate(i) }}
            onHoverEnd={() => setHoveredIdx(null)}
            className="relative flex items-center gap-2 rounded-full text-left px-3 py-1.5 transition-colors duration-200"
            style={{ color: isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.35)' }}
          >
            {/* Animated active indicator */}
            {isActive && (
              <motion.span
                layoutId="sidenav-active"
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.28)',
                }}
                transition={{ type: 'spring', damping: 22, stiffness: 260, mass: 0.8 }}
              />
            )}

            {isActive ? (
              <motion.span
                layoutId="sidenav-dot"
                className="w-1.5 h-1.5 rounded-full bg-white shrink-0 relative z-10"
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
                  {i === 0 ? 'Brand' : i === 1 ? 'Intro' : i === 2 ? 'ROI' : i === 3 ? 'Solutions' : i === 4 ? 'Plan' : i === 5 ? 'About' : 'Book'}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}
    </nav>
  )
}
