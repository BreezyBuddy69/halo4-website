import { Home, Play, Briefcase, TrendingUp, User, Calendar } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import type { Language } from '../../utils/translations'
import { t } from '../../utils/translations'

interface MobileNavProps {
  currentSection: number
  onNavigate: (i: number) => void
  language: Language
}

const ICONS = [Home, Play, TrendingUp, Briefcase, User, Calendar]

export function MobileNav({ currentSection, onNavigate, language }: MobileNavProps) {
  const tr = t(language)
  const labels = [tr.navHome, tr.navVideo, tr.navResults, tr.navWork, tr.navAbout, tr.navBook]

  const scrollToSection = (i: number) => {
    const el = document.getElementById(`section-${i}`)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    onNavigate(i)
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-3">
      <GlassPanel strong className="rounded-2xl flex justify-around items-center py-3 px-2">
        {labels.map((label, i) => {
          const Icon = ICONS[i]
          const isActive = i === currentSection
          return (
            <button
              key={i}
              onClick={() => scrollToSection(i)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-200
                ${isActive ? 'text-white bg-white/10' : 'text-white/40 hover:text-white/70'}`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-medium tracking-wider">{label}</span>
            </button>
          )
        })}
      </GlassPanel>
    </div>
  )
}
