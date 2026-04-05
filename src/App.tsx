import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, animate, AnimatePresence } from 'framer-motion'

// Clip-path keyframes for the expanding window: tiny → full-height narrow strip → full screen
const CLIP_INIT = 'inset(49% 49% 49% 49% round 28px)'
const CLIP_TALL = 'inset(0% 45% 0% 45% round 7px)'
const CLIP_FULL = 'inset(0% 0% 0% 0% round 0px)'
const CLIP_SEQ  = [CLIP_INIT, CLIP_TALL, CLIP_FULL]
// Spring-like cubic bezier: moderate start → overshoots slightly → settles (bubbly feel)
const EASE_SPRING = [0.25, 0.92, 0.32, 1] as [number, number, number, number]
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
import { SplashGate } from './components/ui/SplashGate'

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

// Premium intro:
// The website itself is clipped to an expanding window (height first, then width).
// Titles fly in from opposite sides simultaneously. No blur, no dim — content visible immediately inside the window.
function IntroReveal({ children, onDone, isMobile, title1, title2 }: {
  children: React.ReactNode
  onDone: () => void
  isMobile: boolean
  title1: string
  title2: string
}) {
  const t1Ref   = useRef<HTMLHeadingElement>(null)
  const t2Ref   = useRef<HTMLHeadingElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t1 = t1Ref.current
    const t2 = t2Ref.current
    if (!t1 || !t2) return

    const vw = window.innerWidth

    const run = async () => {
      await Promise.all([
        // t1 flies in from the left, scaling up with spring-like overshoot
        animate(t1,
          { x: [-vw * 1.15, 0], opacity: [0, 1], scale: [0.76, 1] },
          { duration: 1.52, ease: EASE_SPRING }
        ),
        // t2 flies in from the right, slight stagger
        animate(t2,
          { x: [vw * 1.15, 0], opacity: [0, 1], scale: [0.76, 1] },
          { duration: 1.52, ease: EASE_SPRING, delay: 0.12 }
        ),
      ])

      // Brief hold — titles settled, window fully open
      await new Promise<void>(r => setTimeout(r, 300))

      setDone(true)
      onDone()
    }

    run()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Black backdrop — fills screen around the expanding clip window */}
      {!done && (
        <div className="fixed inset-0 z-[192] pointer-events-none" style={{ background: '#000' }} />
      )}

      {/* App content — clipped to the expanding window shape, full opacity, content visible inside */}
      <motion.div
        className={isMobile ? 'min-h-screen' : 'fixed inset-0'}
        style={{ zIndex: done ? 0 : 193 }}
        initial={{ clipPath: CLIP_INIT }}
        animate={{ clipPath: done ? CLIP_FULL : CLIP_SEQ }}
        transition={{
          clipPath: done
            ? { duration: 0 }
            : { duration: 2.05, times: [0, 0.44, 1], ease: EASE_SPRING },
        }}
      >
        {children}
      </motion.div>

      {/* Titles — float freely above, not clipped, land at hero's exact bottom-left */}
      {!done && (
        <div className="fixed inset-0 z-[197] pointer-events-none">
          <div className="absolute bottom-20 md:bottom-18 inset-x-0 flex flex-col items-start md:pl-36 lg:pl-40 px-5 md:px-0">
            <h1
              ref={t1Ref}
              className="text-[clamp(2.2rem,6vw,6.5rem)] font-serif text-white leading-[1] tracking-tight mb-2 md:mb-0.5"
              style={{ opacity: 0, willChange: 'transform, opacity', textShadow: '0 0 38px rgba(255,130,50,0.55), 0 0 80px rgba(255,90,20,0.28)' }}
            >
              {title1}
            </h1>
            <h1
              ref={t2Ref}
              className="text-[clamp(2.2rem,6vw,6.5rem)] font-serif leading-[1] tracking-tight"
              style={{ color: 'rgba(255,255,255,0.70)', opacity: 0, willChange: 'transform, opacity', textShadow: '0 0 38px rgba(255,130,50,0.40), 0 0 80px rgba(255,90,20,0.20)' }}
            >
              {title2}
            </h1>
          </div>
        </div>
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
  const [splashDone, setSplashDone] = useState<boolean>(
    () => sessionStorage.getItem('hv_splash_seen') === '1'
  )
  const [mailMessages, setMailMessages] = useState<MailMessage[]>([])
  const [mailboxOpen, setMailboxOpen] = useState(false)
  const heroInputRef = useRef<HTMLTextAreaElement>(null)

  const isMobile = useMediaQuery('(max-width: 767px)')

  const handleNavigate = useCallback((index: number) => {
    setCurrentSection(Math.max(0, Math.min(TOTAL_SECTIONS - 1, index)))
  }, [])

  const handleSplashEnter = useCallback(() => {
    sessionStorage.setItem('hv_splash_seen', '1')
    setSplashDone(true)
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

      {currentSection !== 0 && currentSection !== 1 && (
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
    <>
      <AnimatePresence>
        {!splashDone && (
          <SplashGate key="splash" language={language} onEnter={handleSplashEnter} />
        )}
      </AnimatePresence>
      <PerformanceProvider tier={tier}>
        <IntroReveal onDone={() => setIntroDone(true)} isMobile={isMobile} title1={tr.heroTitle1} title2={tr.heroTitle2}>
          {appContent}
        </IntroReveal>
      </PerformanceProvider>
    </>
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
