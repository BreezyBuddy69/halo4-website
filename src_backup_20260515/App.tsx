import { useState, useCallback, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Header } from './components/layout/Header'
import { SideNav } from './components/layout/SideNav'
import { SectionStack } from './components/layout/SectionStack'
import { HeroSection } from './components/sections/HeroSection'
import { VideoSection } from './components/sections/VideoSection'
import { WorkSection } from './components/sections/WorkSection'
import { ResultsSection } from './components/sections/ResultsSection'
import { AboutSection } from './components/sections/AboutSection'
import { BookSection } from './components/sections/BookSection'
import { SplashGate } from './components/ui/SplashGate'
import { ChatBot } from './components/chat/ChatBot'
import { BookingModal } from './components/booking/BookingModal'
import { useSectionScroll } from './hooks/useSectionScroll'
import { useMediaQuery } from './hooks/useMediaQuery'
import { ChatProvider, addGlobalChatMessage } from './contexts/ChatContext'
import { PerformanceProvider } from './contexts/PerformanceContext'
import { usePerformanceTier } from './hooks/usePerformanceTier'
import { t } from './utils/translations'
import type { Language } from './utils/translations'
import { GradientBackground } from './components/ui/paper-design-shader-background'

const SECTION_COLORS = [
  ['hsl(258, 60%, 40%)', 'hsl(278, 55%, 35%)', 'hsl(220, 50%, 35%)'], // 0: Hero
  ['hsl(240, 60%, 35%)', 'hsl(260, 55%, 30%)', 'hsl(220, 50%, 30%)'], // 1: Video
  ['hsl(228, 72%, 52%)', 'hsl(255, 68%, 48%)', 'hsl(210, 62%, 46%)'], // 2: Results
  ['hsl(243, 68%, 50%)', 'hsl(263, 63%, 46%)', 'hsl(223, 58%, 46%)'], // 3: Work
  ['hsl(268, 68%, 52%)', 'hsl(283, 62%, 47%)', 'hsl(250, 58%, 50%)'], // 4: About
  ['hsl(270, 72%, 48%)', 'hsl(255, 70%, 44%)', 'hsl(285, 65%, 44%)'], // 5: Book
]

function getSplashSeen() {
  try { return sessionStorage.getItem('splash_seen') === '1' } catch { return false }
}
function setSplashSeen() {
  try { sessionStorage.setItem('splash_seen', '1') } catch { /* */ }
}

const TOTAL_SECTIONS = 6

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


function AppInner() {
  const tier = usePerformanceTier()
  const [splashDone, setSplashDone] = useState(getSplashSeen)
  const [currentSection, setCurrentSection] = useState(0)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [chatContext, setChatContext] = useState('')
  const [language, setLanguage] = useState<Language>(detectLanguage)
  const [introDone, setIntroDone] = useState(getSplashSeen)
  const [mailMessages, setMailMessages] = useState<MailMessage[]>([])
  const [mailboxOpen, setMailboxOpen] = useState(false)
  const heroInputRef = useRef<HTMLTextAreaElement>(null)

  const handleSplashDone = useCallback(() => {
    setSplashDone(true)
    setSplashSeen()
    setIntroDone(true)
  }, [])

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
      <GradientBackground colors={SECTION_COLORS[currentSection]} />
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
            onScrollToVideo={() => handleNavigate(1)}
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
          <BookSection
            key="book"
            language={language}
            isActive={currentSection === 5}
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

  return (
    <PerformanceProvider tier={tier}>
      <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#0D0B1A' }}>
        <AnimatePresence>
          {!splashDone && <SplashGate key="splash" onDone={handleSplashDone} />}
        </AnimatePresence>

        {splashDone && appContent}
      </div>
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
