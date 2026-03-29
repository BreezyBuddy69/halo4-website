import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, animate } from 'framer-motion'
import { Cursor } from './components/ui/Cursor'
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

// Two-phase reveal: strip narrows in first axis, then expands to fill screen
function IntroReveal({ children, onDone, isMobile }: { children: React.ReactNode; onDone: () => void; isMobile: boolean }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const run = async () => {
      await new Promise<void>(r => setTimeout(r, 100))
      const el = boxRef.current
      if (!el) return
      if (isMobile) {
        // Mobile: full width bar first, then expand height
        await animate(el, { scaleX: 1, scaleY: 0.04, borderRadius: '14px', opacity: 0.9 }, {
          type: 'spring', damping: 28, stiffness: 230, mass: 0.45,
        })
        await animate(el, { scaleY: 1, borderRadius: '0px', opacity: 1 }, {
          type: 'spring', damping: 28, stiffness: 190, mass: 0.50,
        })
      } else {
        // Desktop: height strip first, then expand width
        await animate(el, { scaleY: 1, scaleX: 0.16, borderRadius: '20px', opacity: 0.82 }, {
          type: 'spring', damping: 28, stiffness: 230, mass: 0.45,
        })
        await animate(el, { scaleX: 1, borderRadius: '0px', opacity: 1 }, {
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
      {/* App content — always rendered, starts faint so it breathes into view */}
      <motion.div
        className={done && isMobile ? 'min-h-screen' : 'fixed inset-0'}
        initial={{ opacity: 0.18 }}
        animate={{ opacity: done ? 1 : 0.18 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      >
        {children}
      </motion.div>

      {/* Intro overlay — only during animation */}
      {!done && (
        <div className="fixed inset-0 z-[200] pointer-events-none">
          {/* White background */}
          <div className="absolute inset-0 bg-white" />
          {/* Dark expanding box */}
          <motion.div
            ref={boxRef}
            className="absolute inset-0"
            initial={{ scaleX: 0.08, scaleY: 0.06, borderRadius: '60px', opacity: 0.3 }}
            style={{ transformOrigin: 'center center', background: '#141628' }}
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

  return (
    <PerformanceProvider tier={tier}>
      {tier !== 'minimal' && <Cursor />}
      <IntroReveal onDone={() => setIntroDone(true)} isMobile={isMobile}>
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
