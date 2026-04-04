import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, animate } from 'framer-motion'
import { Header } from './components/layout/Header'
import { SideNav } from './components/layout/SideNav'
import { SectionStack } from './components/layout/SectionStack'
import { HeroSection } from './components/sections/HeroSection'
import { VideoSection } from './components/sections/VideoSection'
import { WorkSection } from './components/sections/WorkSection'
import { ResultsSection } from './components/sections/ResultsSection'
import { ProcessSection } from './components/sections/ProcessSection'
import { AboutSection } from './components/sections/AboutSection'
import { BookSection } from './components/sections/BookSection'
import { ChatBot } from './components/chat/ChatBot'
import { BookingModal } from './components/booking/BookingModal'
import { useSectionScroll } from './hooks/useSectionScroll'
import { useMediaQuery } from './hooks/useMediaQuery'
import { ChatProvider, addGlobalChatMessage } from './contexts/ChatContext'
import { PerformanceProvider } from './contexts/PerformanceContext'
import { usePerformanceTier } from './hooks/usePerformanceTier'
import { t } from './utils/translations'
import type { Language } from './utils/translations'

const TOTAL_SECTIONS = 7

export interface MailMessage {
  id: string
  text: string
  time: string
  read: boolean
}

function detectLanguage(): Language {
  const lang = (navigator.language || navigator.languages?.[0] || 'en').toLowerCase()
  if (lang.startsWith('de')) return 'de'
  if (lang.startsWith('fr')) return 'fr'
  return 'en'
}

// Premium 2-phase intro:
// Phase 1 — a box scales from small to full-screen (box expand)
// Phase 2 — titles split/cross/spring, then blur lifts
function IntroReveal({ children, onDone, isMobile, title1, title2 }: {
  children: React.ReactNode
  onDone: () => void
  isMobile: boolean
  title1: string
  title2: string
}) {
  const t1Ref = useRef<HTMLHeadingElement>(null)
  const t2Ref = useRef<HTMLHeadingElement>(null)
  const [done, setDone] = useState(false)
  const [revealing, setRevealing] = useState(false)
  const [boxOpen, setBoxOpen] = useState(false)

  // Phase 2: title choreography — starts after box is mostly open
  useEffect(() => {
    if (!boxOpen) return

    const run = async () => {
      await new Promise<void>(r => setTimeout(r, 60))
      const t1 = t1Ref.current
      const t2 = t2Ref.current
      if (!t1 || !t2) return

      const travel = window.innerWidth * (isMobile ? 0.34 : 0.42)

      // Fade in centered titles
      await Promise.all([
        animate(t1, { opacity: 1 }, { duration: 0.28 }),
        animate(t2, { opacity: 1 }, { duration: 0.28, delay: 0.1 }),
      ])
      await new Promise<void>(r => setTimeout(r, 80))

      // Split — t1 left, t2 right
      await Promise.all([
        animate(t1, { x: -travel }, { duration: 0.32, ease: [0.4, 0, 0.2, 1] }),
        animate(t2, { x: travel },  { duration: 0.32, ease: [0.4, 0, 0.2, 1] }),
      ])
      await new Promise<void>(r => setTimeout(r, 75))

      // Cross — t1 right, t2 left
      await Promise.all([
        animate(t1, { x: travel * 0.88 },  { duration: 0.36, ease: [0.4, 0, 0.6, 1] }),
        animate(t2, { x: -travel * 0.88 }, { duration: 0.36, ease: [0.4, 0, 0.6, 1] }),
      ])
      await new Promise<void>(r => setTimeout(r, 65))

      // Split again, smaller
      await Promise.all([
        animate(t1, { x: -travel * 0.40 }, { duration: 0.26, ease: [0.4, 0, 0.2, 1] }),
        animate(t2, { x: travel * 0.40 },  { duration: 0.26, ease: [0.4, 0, 0.2, 1] }),
      ])

      // Spring back to center + start unblurring
      animate(t1, { x: 0 }, { type: 'spring', damping: 22, stiffness: 300, mass: 0.7 })
      animate(t2, { x: 0 }, { type: 'spring', damping: 22, stiffness: 300, mass: 0.7, delay: 0.05 })
      setRevealing(true)

      await new Promise<void>(r => setTimeout(r, 660))

      // Titles drift down and fade out
      const toY = window.innerHeight * 0.21
      await Promise.all([
        animate(t1, { y: toY, opacity: 0 }, { duration: 0.46, ease: [0.4, 0, 1, 1] }),
        animate(t2, { y: toY, opacity: 0 }, { duration: 0.46, ease: [0.4, 0, 1, 1], delay: 0.06 }),
      ])

      setDone(true)
      onDone()
    }
    run()
  }, [boxOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* App content always lives in the same fixed container — never remounts */}
      <div className={isMobile ? 'min-h-screen' : 'fixed inset-0'} style={{ zIndex: done ? 0 : 190 }}>
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0.12 }}
          animate={{ opacity: done || revealing ? 1 : 0.12 }}
          transition={{ duration: 0.95, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </div>

      {/* Intro overlay — sits on top, removed when done */}
      {!done && (
        <>
          {/* Black backdrop behind the expanding box */}
          <div className="fixed inset-0 z-[192] pointer-events-none" style={{ background: '#000' }} />

          {/* The box: scales from small to full-screen */}
          <motion.div
            className="fixed z-[195] pointer-events-none overflow-hidden"
            style={{
              top: '50%', left: '50%',
              width: '100vw', height: '100vh',
              x: '-50%', y: '-50%',
              willChange: 'transform, borderRadius',
            }}
            initial={{ scale: 0.18, borderRadius: '28px' }}
            animate={{ scale: 1, borderRadius: '0px' }}
            transition={{ type: 'spring', damping: 28, stiffness: 180, mass: 1 }}
            onAnimationComplete={() => setBoxOpen(true)}
          >
            {/* Glow border fades as box expands */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{
                borderRadius: 'inherit',
                boxShadow: '0 0 0 1.5px rgba(255,255,255,0.22), 0 0 50px rgba(255,255,255,0.10), inset 0 0 50px rgba(255,255,255,0.05)',
                pointerEvents: 'none',
              }}
            />
          </motion.div>

          {/* Backdrop blur — fades once revealing */}
          <motion.div
            className="fixed inset-0 z-[196] pointer-events-none"
            animate={{ opacity: revealing ? 0 : 1 }}
            transition={{ duration: 0.95, ease: 'easeOut' }}
            style={{ backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)' }}
          />

          {/* Titles — appear after box is open */}
          {boxOpen && (
            <div
              className="fixed inset-0 z-[197] flex flex-col items-center justify-center gap-1 md:gap-2 pointer-events-none"
              style={{ mixBlendMode: 'difference' }}
            >
              <h1
                ref={t1Ref}
                className="text-[clamp(2.2rem,6vw,6.5rem)] font-serif leading-[1] tracking-tight text-white"
                style={{ opacity: 0, willChange: 'transform, opacity' }}
              >
                {title1}
              </h1>
              <h1
                ref={t2Ref}
                className="text-[clamp(2.2rem,6vw,6.5rem)] font-serif leading-[1] tracking-tight"
                style={{ color: 'rgba(255,255,255,0.82)', opacity: 0, willChange: 'transform, opacity' }}
              >
                {title2}
              </h1>
            </div>
          )}
        </>
      )}
    </>
  )
}

function AppInner() {
  const tier = usePerformanceTier()
  const [currentSection, setCurrentSection] = useState(0)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [chatContext, setChatContext] = useState('')
  const [language, setLanguage] = useState<Language>(detectLanguage)
  const [introDone, setIntroDone] = useState(false)
  const [mailMessages, setMailMessages] = useState<MailMessage[]>([])
  const [mailboxOpen, setMailboxOpen] = useState(false)
  const heroInputRef = useRef<HTMLTextAreaElement>(null)

  const isMobile = useMediaQuery('(max-width: 767px)')

  const handleNavigate = useCallback((index: number) => {
    setCurrentSection(Math.max(0, Math.min(TOTAL_SECTIONS - 1, index)))
  }, [])

  useSectionScroll({
    totalSections: TOTAL_SECTIONS,
    currentSection,
    onNavigate: handleNavigate,
    isMobile,
  })

  // Auto-focus hero chat input handled by HeroSection itself (after greeting)
  // Only focus if user navigates back to hero after intro
  useEffect(() => {
    if (introDone && currentSection === 0) {
      setTimeout(() => heroInputRef.current?.focus(), 600)
    }
  }, [currentSection]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleBookingConfirmed = useCallback(() => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    const mailMsg: MailMessage = {
      id: Date.now().toString(),
      text: 'Your booking request has been sent. We\'re confirming your strategy session — you\'ll receive a confirmation message shortly.',
      time: timeStr,
      read: false,
    }
    setMailMessages(prev => [mailMsg, ...prev])
    addGlobalChatMessage({
      role: 'assistant',
      content: '📬 Booking Sent\n\nYour booking request has been received. We\'re confirming your strategy session — you\'ll get a notification here once it\'s confirmed.',
      isNew: true,
      isConfirmation: true,
    })
  }, [])

  const handleAIConfirmation = useCallback((aiMessage: string) => {
    addGlobalChatMessage({
      role: 'assistant',
      content: '✅ Booking Confirmed\n\n' + aiMessage,
      isNew: true,
      isConfirmation: true,
    })
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    setMailMessages(prev => [{
      id: Date.now().toString(),
      text: aiMessage,
      time: timeStr,
      read: false,
    }, ...prev])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenMailbox = useCallback(() => {
    setIsBookingOpen(false)
    setMailboxOpen(true)
  }, [])

  const handleMarkAllRead = useCallback(() => {
    setMailMessages(prev => prev.map(m => ({ ...m, read: true })))
  }, [])

  const appContent = (
    <>
      <Header
        language={language}
        onLanguageChange={setLanguage}
        mailMessages={mailMessages}
        onMarkAllRead={handleMarkAllRead}
        externalOpen={mailboxOpen}
        onExternalOpenChange={setMailboxOpen}
        currentSection={currentSection}
        onNavigate={handleNavigate}
        onBooking={() => setIsBookingOpen(true)}
      />

      <SideNav
        currentSection={currentSection}
        onNavigate={handleNavigate}
        language={language}
      />

      <SectionStack currentSection={currentSection} onSectionChange={handleNavigate}>
        {[
          <HeroSection
            key="hero"
            language={language}
            isActive={currentSection === 0}
            onAskAI={setChatContext}
            onBooking={() => setIsBookingOpen(true)}
            inputRef={heroInputRef}
            onIntroDone={() => setIntroDone(true)}
            introDone={introDone}
          />,
          <VideoSection
            key="video"
            isActive={currentSection === 1}
            language={language}
          />,
          <ResultsSection
            key="results"
            language={language}
            isActive={currentSection === 2}
          />,
          <WorkSection
            key="work"
            language={language}
            isActive={currentSection === 3}
            onAskAI={setChatContext}
          />,
          <AboutSection
            key="about"
            language={language}
            isActive={currentSection === 4}
          />,
          <ProcessSection
            key="process"
            language={language}
            isActive={currentSection === 5}
            onBooking={() => setIsBookingOpen(true)}
          />,
          <BookSection
            key="book"
            language={language}
            isActive={currentSection === 6}
            onBooking={() => setIsBookingOpen(true)}
          />,
        ]}
      </SectionStack>

      {currentSection !== 0 && (
        <ChatBot
          language={language}
          context={chatContext}
          onContextUsed={() => setChatContext('')}
        />
      )}

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onConfirmed={handleBookingConfirmed}
        onOpenMailbox={handleOpenMailbox}
        onAIConfirmation={handleAIConfirmation}
        language={language}
      />
    </>
  )

  const tr = t(language)

  return (
    <PerformanceProvider tier={tier}>
      <IntroReveal onDone={() => setIntroDone(true)} isMobile={isMobile} title1={tr.heroTitle1} title2={tr.heroTitle2}>
        {appContent}
      </IntroReveal>
    </PerformanceProvider>
  )
}

function App() {
  return (
    <ChatProvider>
      <AppInner />
    </ChatProvider>
  )
}

export default App
