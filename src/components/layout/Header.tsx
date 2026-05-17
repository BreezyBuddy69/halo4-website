import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Menu } from 'lucide-react'
import { ScrambleText } from '../ui/ScrambleText'
import { t } from '../../utils/translations'
import type { Language } from '../../utils/translations'
import type { MailMessage } from '../../App'

interface HeaderProps {
  language: Language
  onLanguageChange: (lang: Language) => void
  mailMessages: MailMessage[]
  onMarkAllRead: () => void
  externalOpen?: boolean
  onExternalOpenChange?: (open: boolean) => void
  currentSection?: number
  onNavigate?: (i: number) => void
  onBooking?: () => void
}

const LANGS: Language[] = ['en', 'de', 'fr']
const LANG_LABELS: Record<Language, string> = { en: 'EN', de: 'DE', fr: 'FR' }

const GET_IN_CONTACT: Record<Language, string> = {
  en: 'Get in contact',
  de: 'Kontakt aufnehmen',
  fr: 'Nous contacter',
}

const CITIES = [
  { label: 'LDN', tz: 'Europe/London' },
  { label: 'BER', tz: 'Europe/Berlin' },
  { label: 'VDZ', tz: 'Europe/Vaduz' },
  { label: 'DXB', tz: 'Asia/Dubai' },
  { label: 'TKY', tz: 'Asia/Tokyo' },
  { label: 'SYD', tz: 'Australia/Sydney' },
  { label: 'NYC', tz: 'America/New_York' },
  { label: 'LAX', tz: 'America/Los_Angeles' },
]

const PILL_STYLE = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)',
  border: '1px solid rgba(255,255,255,0.15)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  boxShadow: '0 4px 14px rgba(0,0,0,0.36), inset 0 1.5px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.18)',
}

export function Header({
  language, onLanguageChange, mailMessages, onMarkAllRead,
  externalOpen, onExternalOpenChange, currentSection = 0, onNavigate, onBooking,
}: HeaderProps) {
  const [cityIdx, setCityIdx] = useState(0)
  const [cityTime, setCityTime] = useState('')
  const [langHover, setLangHover] = useState(false)

  const [menuOpen, setMenuOpen] = useState(false)
  const langTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)


  const tr = t(language)
  const navLabels = [tr.navHome, tr.navVideo, tr.navResults, tr.navWork, tr.navAbout, tr.navBook]

  // Keep city time updated
  useEffect(() => {
    const update = () => {
      setCityTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: false,
        timeZone: CITIES[cityIdx].tz,
      }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [cityIdx])

  // Cycle cities every 2.8s
  useEffect(() => {
    const id = setInterval(() => setCityIdx(i => (i + 1) % CITIES.length), 5000)
    return () => clearInterval(id)
  }, [])

  // Backward-compat: external mail open just marks as read
  useEffect(() => {
    if (externalOpen) setTimeout(onMarkAllRead, 800)
  }, [externalOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMobileNavigate = (i: number) => {
    onNavigate?.(i)
    setMenuOpen(false)
  }

  const handleLangEnter = () => { clearTimeout(langTimerRef.current); setLangHover(true) }
  const handleLangLeave = () => { langTimerRef.current = setTimeout(() => setLangHover(false), 180) }


  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">

        {/* ── MOBILE: menu button ── */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(o => !o)}
           
            style={PILL_STYLE}
            className="rounded-full px-3 py-1.5 text-[11px] font-medium text-white/80 tracking-widest flex items-center gap-1.5"
          >
            <Menu className="w-3 h-3" />
            Menu
          </button>
        </div>

        {/* ── DESKTOP LEFT: language pill — expands right on hover ── */}
        <div
          className="relative hidden md:block"
          onMouseEnter={handleLangEnter}
          onMouseLeave={handleLangLeave}
        >
          <motion.div
            className="rounded-full flex items-center cursor-pointer select-none overflow-hidden"
            style={PILL_STYLE}
            animate={{ paddingLeft: 16, paddingRight: langHover ? 12 : 16, paddingTop: 8, paddingBottom: 8 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
           
          >
            {/* Active language — always visible */}
            <span
              className="text-xs font-medium tracking-widest transition-colors duration-200"
              style={{ color: 'rgba(255,255,255,0.70)' }}
            >
              {LANG_LABELS[language]}
            </span>

            {/* Other languages — slide in to the right */}
            <AnimatePresence>
              {langHover && LANGS.filter(l => l !== language).map((lang, i) => (
                <motion.button
                  key={lang}
                 
                  className="flex items-center gap-1.5 text-xs font-medium tracking-widest text-white/35 hover:text-white/75 transition-colors duration-150"
                  initial={{ opacity: 0, maxWidth: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, maxWidth: 60, marginLeft: i === 0 ? 10 : 0 }}
                  exit={{ opacity: 0, maxWidth: 0, marginLeft: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden', whiteSpace: 'nowrap', paddingRight: 6 }}
                  onClick={() => { onLanguageChange(lang); setLangHover(false) }}
                >
                  <span className="text-white/20">·</span>
                  {LANG_LABELS[lang]}
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── CENTER: brand ── */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <ScrambleText
            text="HALOVISION AI"
            className="font-anurati text-white text-sm tracking-[0.3em] select-none cursor-default"
          />
        </div>

        {/* ── RIGHT: cycling timezone + expandable contact button ── */}
        <div className="flex items-center gap-3">

          {/* Cycling city clock */}
          <div
            className="hidden sm:flex items-center gap-1.5 overflow-hidden"
            style={{ height: 16 }}
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                key={cityIdx}
                className="flex items-center gap-1.5"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="text-[10px] font-mono tracking-widest text-white/25 uppercase">
                  {CITIES[cityIdx].label}
                </span>
                <span className="text-xs font-mono tracking-wider text-white/40">
                  {cityTime}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Get in contact — expands left from icon */}
          <button
            onClick={() => onBooking?.()}
            className="rounded-full flex items-center gap-2 px-4 py-2 cursor-pointer transition-opacity duration-200 hover:opacity-80"
            style={{
              background: 'rgba(139,92,246,0.85)',
              border: '1px solid rgba(167,139,250,0.55)',
              boxShadow: '0 0 18px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.18)',
            }}
          >
            <Mail className="w-3 h-3 text-white/90 shrink-0" />
            <span className="text-[11px] font-semibold text-white tracking-wide whitespace-nowrap">
              {GET_IN_CONTACT[language]}
            </span>
          </button>
        </div>
      </header>

      {/* ── MOBILE MENU OVERLAY ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[180] md:hidden flex flex-col"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'rgba(8,5,20,0.78)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
            }}
          >
            <div className="flex items-center justify-between px-6 py-4">
              <div />
              <ScrambleText
                text="HALOVISION AI"
                className="font-anurati text-white text-sm tracking-[0.3em] select-none cursor-default"
              />
              <button
                onClick={() => setMenuOpen(false)}
               
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-8 gap-3">
              {navLabels.map((label, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleMobileNavigate(i)}
                 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full text-left px-5 py-3 rounded-full text-xs font-medium tracking-widest transition-all"
                  style={currentSection === i ? {
                    background: 'rgba(255,255,255,0.10)',
                    border: '1px solid rgba(255,255,255,0.22)',
                    color: 'rgba(255,255,255,0.95)',
                  } : {
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.45)',
                  }}
                >
                  {label}
                </motion.button>
              ))}
            </div>

            <div className="px-8 pb-12">
              <p className="text-white/20 text-[10px] tracking-[0.3em] uppercase mb-4">Language</p>
              <div className="flex gap-3">
                {LANGS.map(lang => (
                  <button
                    key={lang}
                    onClick={() => onLanguageChange(lang)}
                   
                    className="px-5 py-2 rounded-full text-xs font-medium tracking-widest transition-all"
                    style={lang === language ? {
                      background: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.28)',
                      color: 'rgba(255,255,255,0.90)',
                    } : {
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      color: 'rgba(255,255,255,0.35)',
                    }}
                  >
                    {LANG_LABELS[lang]}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
