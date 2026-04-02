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

// Cinematic intro: titles slide in from sides, cross, spring back — dark box expands to reveal hero
function IntroReveal({ children, onDone, isMobile, title1, title2 }: {
  children: React.ReactNode
  onDone: () => void
  isMobile: boolean
  title1: string
  title2: string
}) {
  const boxRef = useRef<HTMLDivElement>(null)
  const t1Ref  = useRef<HTMLHeadingElement>(null)
  const t2Ref  = useRef<HTMLHeadingElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const run = async () => {
      await new Promise<void>(r => setTimeout(r, 80))
      const t1  = t1Ref.current
      const t2  = t2Ref.current
      const box = boxRef.current
      if (!t1 || !t2 || !box) return

      // Phase 1: titles enter from opposite sides with spring overshoot
      await Promise.all([
        animate(t1, { opacity: 1, x: 0 }, { type: 'spring', damping: 13, stiffness: 160, mass: 0.9 }),
        animate(t2, { opacity: 1, x: 0 }, { type: 'spring', damping: 13, stiffness: 160, mass: 0.9, delay: 0.10 }),
      ])

      // Hold at center briefly
      await new Promise<void>(r => setTimeout(r, 300))

      // Phase 2: cross to opposite sides
      await Promise.all([
        animate(t1, { x: '55vw'  }, { duration: 0.38, ease: [0.4, 0, 0.6, 1] }),
        animate(t2, { x: '-50vw' }, { duration: 0.38, ease: [0.4, 0, 0.6, 1] }),
      ])

      // Phase 3: spring back to center while dark box expands on top
      animate(t1, { x: 0 }, { type: 'spring', damping: 16, stiffness: 240, mass: 0.8 })
      animate(t2, { x: 0 }, { type: 'spring', damping: 16, stiffness: 240, mass: 0.8 })

      if (isMobile) {
        await animate(box, { scaleX: 1, scaleY: 0.04, borderRadius: '14px', opacity: 0.9 }, {
          type: 'spring', damping: 28, stiffness: 230, mass: 0.45,
        })
        await animate(box, { scaleY: 1, borderRadius: '0px', opacity: 1 }, {
          type: 'spring', damping: 28, stiffness: 190, mass: 0.50,
        })
      } else {
        await animate(box, { scaleY: 1, scaleX: 0.16, borderRadius: '20px', opacity: 0.82 }, {
          type: 'spring', damping: 28, stiffness: 230, mass: 0.45,
        })
        await animate(box, { scaleX: 1, borderRadius: '0px', opacity: 1 }, {
          type: 'spring', damping: 26, stiffness: 190, mass: 0.50,
        })
      }

      setDone(true)
      onDone()
    }
    run()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* App content — always rendered, breathes into view after overlay lifts */}
      <motion.div
        className={done && isMobile ? 'min-h-screen' : 'fixed inset-0'}
        initial={{ opacity: 0.18 }}
        animate={{ opacity: done ? 1 : 0.18 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      >
        {children}
      </motion.div>

      {/* Intro overlay */}
      {!done && (
        <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
          {/* White background */}
          <div className="absolute inset-0 bg-white" />

          {/* Titles — positioned identical to HeroSection, dark on white */}
          <div className="absolute bottom-20 md:bottom-[4.5rem] inset-x-0 flex flex-col items-start md:pl-36 lg:pl-40 px-5 md:px-0">
            <h1
              ref={t1Ref}
              className="text-[clamp(2.2rem,6vw,6.5rem)] font-serif leading-[1] tracking-tight mb-2 md:mb-0.5"
              style={{ color: '#141628', opacity: 0, transform: 'translateX(-110vw)', willChange: 'transform, opacity' }}
            >
              {title1}
            </h1>
            <h1
              ref={t2Ref}
              className="text-[clamp(2.2rem,6vw,6.5rem)] font-serif leading-[1] tracking-tight"
              style={{ color: 'rgba(20,22,40,0.45)', opacity: 0, transform: 'translateX(110vw)', willChange: 'transform, opacity' }}
            >
              {title2}
            </h1>
          </div>

          {/* Dark expanding box — sits above titles */}
          <motion.div
            ref={boxRef}
            className="absolute inset-0"
            initial={{ scaleX: 0.08, scaleY: 0.06, borderRadius: '60px', opacity: 0.3 }}
            style={{ transformOrigin: 'center center', background: '#141628', zIndex: 10 }}
          />
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
    // Add to mail inbox as "sent" (not yet confirmed)
    const mailMsg: MailMessage = {
      id: Date.now().toString(),
      text: 'Your booking request has been sent. We\'re confirming your strategy session — you\'ll receive a confirmation message shortly.',
      time: timeStr,
      read: false,
    }
    setMailMessages(prev => [mailMsg, ...prev])
    // Add to shared AI chat as "booking sent" notification
    addGlobalChatMessage({
      role: 'assistant',
      content: '📬 Booking Sent\n\nYour booking request has been received. We\'re confirming your strategy session — you\'ll get a notification here once it\'s confirmed.',
      isNew: true,
      isConfirmation: true,
    })
  }, [])

  const handleAIConfirmation = useCallback((aiMessage: string) => {
    // Add to AI chat
    addGlobalChatMessage({
      role: 'assistant',
      content: '✅ Booking Confirmed\n\n' + aiMessage,
      isNew: true,
      isConfirmation: true,
    })
    // Also push into inbox as the real confirmation message
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
