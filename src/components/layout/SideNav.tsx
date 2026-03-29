import { motion } from 'framer-motion'
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

  return (
    <nav className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-1.5">
      {labels.map((label, i) => {
        const isActive = i === currentSection

        return (
          <motion.button
            key={i}
            data-cursor="hover"
            onClick={() => onNavigate(i)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            className="relative flex items-center rounded-full text-left overflow-hidden"
            style={{
              paddingLeft: 14,
              paddingRight: 16,
              paddingTop: 7,
              paddingBottom: 7,
              // Liquid glass per pill
              background: isActive
                ? 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: isActive
                ? '1px solid rgba(255,255,255,0.32)'
                : '1px solid rgba(255,255,255,0.10)',
              boxShadow: isActive
                ? '0 4px 20px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -1px 0 rgba(0,0,0,0.10)'
                : '0 2px 10px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.10)',
              color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.42)',
              transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease',
            }}
          >
            {/* Top gloss line */}
            <span
              className="absolute top-0 left-3 right-3 h-px pointer-events-none"
              style={{
                background: isActive
                  ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              }}
            />

            {/* Active dot */}
            {isActive && (
              <motion.span
                layoutId="sidenav-dot"
                className="w-1.5 h-1.5 rounded-full bg-white shrink-0 mr-2"
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              />
            )}

            <span
              className="text-[10px] font-medium tracking-[0.16em] whitespace-nowrap"
              style={{ textShadow: isActive ? '0 1px 8px rgba(255,255,255,0.25)' : 'none' }}
            >
              {label}
            </span>
          </motion.button>
        )
      })}
    </nav>
  )
}
