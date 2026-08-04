import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Play } from 'lucide-react'
import { NeonButton } from '../ui/NeonButton'
import { GlassPanel } from '../ui/GlassPanel'
import { TypingMessage } from '../chat/TypingMessage'
import { ThinkingProcess } from '../chat/ThinkingProcess'
import { BorderRotate } from '../ui/animated-gradient-border'
import { DotPattern } from '../ui/dot-pattern-1'
import { t } from '../../utils/translations'
import type { Language } from '../../utils/translations'
import { useScreenSize } from '../../hooks/use-screen-size'
import { useChatContext } from '../../contexts/ChatContext'
import { GooeyFilter } from '../ui/gooey-filter'
import { Boxes } from '../ui/background-boxes'

const CHATBOT_URL = import.meta.env.VITE_CHATBOT_URL as string
const VIOLET = '#8B5CF6'
const ORANGE = '#8B5CF6'


/* Staggered letter animation for background titles */
function AnimatedWord({ word, delay, style, className }: {
  word: string; delay: number; style?: React.CSSProperties; className?: string
}) {
  return (
    <span
      aria-label={word}
      className={className}
      style={{ display: 'block', willChange: 'transform', ...style }}
    >
      {word.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            y: { duration: 0.55, delay: delay + i * 0.04, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.75, delay: delay + i * 0.04, ease: 'easeOut' },
          }}
          style={{ display: 'inline-block', willChange: 'transform, opacity' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}


const BLOOM_RINGS = [0, 1, 2, 3, 4]

// Render message content with **bold** markers and \n line breaks
function renderContent(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let key = 0

  const flushLine = (line: string) => {
    let rem = line
    while (rem.length > 0) {
      const start = rem.indexOf('**')
      if (start === -1) { parts.push(rem); return }
      if (start > 0) parts.push(rem.slice(0, start))
      rem = rem.slice(start + 2)
      const end = rem.indexOf('**')
      if (end === -1) { parts.push(<strong key={key++} style={{ color: 'rgba(255,255,255,0.96)', fontWeight: 600 }}>{rem}</strong>); return }
      parts.push(<strong key={key++} style={{ color: 'rgba(255,255,255,0.96)', fontWeight: 600 }}>{rem.slice(0, end)}</strong>)
      rem = rem.slice(end + 2)
    }
  }

  const lines = text.split('\n')
  lines.forEach((line, i) => {
    if (i > 0) parts.push(<br key={`br${key++}`} />)
    flushLine(line)
  })
  return parts
}

interface HeroSectionProps {
  language: Language
  isActive: boolean
  onAskAI: (ctx: string) => void
  onBooking: () => void
  inputRef: React.RefObject<HTMLTextAreaElement>
  onIntroDone?: () => void
  introDone?: boolean
  titleReady?: boolean
  onScrollToVideo?: () => void
  onUIReady?: () => void
}


function useFitFont(text: string, fillRatio = 0.97): number {
  const [size, setSize] = useState(200)

  useEffect(() => {
    const compute = () => {
      document.fonts.ready.then(() => {
        const el = document.createElement('span')
        el.style.cssText = 'position:fixed;top:-9999px;left:-9999px;white-space:nowrap;visibility:hidden;font-family:anurati,sans-serif;font-weight:900;letter-spacing:0.02em;font-size:100px'
        el.textContent = text
        document.body.appendChild(el)
        const measured = el.offsetWidth || 400
        document.body.removeChild(el)
        const px = Math.max(16, Math.floor(window.innerWidth * fillRatio / measured * 100))
        setSize(px)
      })
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [text, fillRatio])

  return size
}

function useTypewriterText(texts: string[]) {
  const [displayed, setDisplayed] = useState('')
  const stateRef = useRef({ idx: 0, char: 0, phase: 'typing' as 'waiting' | 'deleting' | 'typing' })
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    const tick = () => {
      const s = stateRef.current
      const target = texts[s.idx]
      if (s.phase === 'waiting') {
        s.phase = 'deleting'
        timerRef.current = setTimeout(tick, 100)
      } else if (s.phase === 'deleting') {
        s.char--
        setDisplayed(target.slice(0, s.char))
        if (s.char <= 0) {
          s.idx = (s.idx + 1) % texts.length
          s.phase = 'typing'
          s.char = 0
          timerRef.current = setTimeout(tick, 120)
        } else {
          timerRef.current = setTimeout(tick, 26)
        }
      } else {
        s.char++
        const nextTarget = texts[s.idx]
        setDisplayed(nextTarget.slice(0, s.char))
        if (s.char >= nextTarget.length) {
          s.phase = 'waiting'
          timerRef.current = setTimeout(tick, 3200)
        } else {
          timerRef.current = setTimeout(tick, 28)
        }
      }
    }
    timerRef.current = setTimeout(tick, 28)
    return () => clearTimeout(timerRef.current)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return displayed
}

export function HeroSection({ language, isActive, onBooking, inputRef, introDone, titleReady, onScrollToVideo, onUIReady }: HeroSectionProps) {
  const tr = t(language)
  const { messages, isLoading, addMessage, markDone, setIsLoading } = useChatContext()
  const screenSize = useScreenSize()
  const isMobile = screenSize.lessThan('md')
  const haloFontPx = useFitFont('HALO', 0.97)
  // On mobile use 0.62 so AI has room; on desktop 0.74
  const visionFontPx = useFitFont('VISION', isMobile ? 0.62 : 0.74)
  // AI at 52% of VISION height — together they fill ~97% of the row
  const aiFontPx = Math.floor(visionFontPx * 0.52)

  const [input, setInput] = useState('')
  const [inputVisible, setInputVisible] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(false)
  const [hideBackground, setHideBackground] = useState(false)
  const [showMarketingText, setShowMarketingText] = useState(false)
  const [marketingBoxVisible, setMarketingBoxVisible] = useState(false)
  const [marketingSliding, setMarketingSliding] = useState(false)
  const [marketingParticle, setMarketingParticle] = useState(false)
  const [chatSpawned, setChatSpawned] = useState(false)
  const [chatAreaVisible, setChatAreaVisible] = useState(false)
  const [badgeVisible, setBadgeVisible] = useState(false)
  const [userMsgCount, setUserMsgCount] = useState(0)
  const userMsgCountRef = useRef(0)
  const [showScrollCta, setShowScrollCta] = useState(false)
  const scrollCtaTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [charWarning, setCharWarning] = useState(false)
  const placeholders = [tr.heroPlaceholder1, tr.heroPlaceholder2, tr.heroPlaceholder3]
  const typewriterPlaceholder = useTypewriterText(placeholders)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const hasLeftRef = useRef(false)
  const marketingTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const showMarketingRef = useRef(false)
  useEffect(() => { showMarketingRef.current = showMarketingText }, [showMarketingText])

  // Booking CTA is never gated behind the intro choreography — it is the primary
  // conversion action and must be clickable from the first frame.
  useEffect(() => {
    if (ctaVisible) return
    const t = setTimeout(() => { setCtaVisible(true); onUIReady?.() }, 400)
    return () => clearTimeout(t)
  }, [ctaVisible]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sequence: introDone → bg fades → marketing text → box → slides up (stays visible) → chat spawns
  // Timings roughly halved: the value proposition has to be readable inside the
  // first second, and the chat has to be reachable well before a visitor bounces.
  // Marketing box only fully despawns when user sends their first message
  useEffect(() => {
    if (!introDone) return
    const t1 = setTimeout(() => setHideBackground(true), 900)
    const t2 = setTimeout(() => setShowMarketingText(true), 900)
    const t3 = setTimeout(() => setMarketingBoxVisible(true), 1050)
    const t4 = setTimeout(() => setMarketingSliding(true), 3400)
    const t5 = setTimeout(() => setChatSpawned(true), 3900)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5) }
  }, [introDone])

  // After chat spawns: show area, then input, then badge — staggered
  useEffect(() => {
    if (!chatSpawned) return
    const t1 = setTimeout(() => setChatAreaVisible(true), 150)
    const t2 = setTimeout(() => setInputVisible(true), 350)
    const t3 = setTimeout(() => setBadgeVisible(true), 700)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [chatSpawned])

  // Global key listener: any printable key focuses the hidden-but-mounted input
  useEffect(() => {
    if (!chatSpawned || inputVisible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [chatSpawned, inputVisible])

  useEffect(() => {
    if (!isActive && introDone) hasLeftRef.current = true
    if (isActive && hasLeftRef.current) { setCtaVisible(true); onUIReady?.() }
  }, [isActive, introDone]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight })
  }, [messages, isLoading])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return
    const msgIndex = userMsgCountRef.current

    // On first send: dismiss marketing box but KEEP the input visible
    if (msgIndex === 0) {
      marketingTimersRef.current.forEach(clearTimeout)
      marketingTimersRef.current = []
      if (showMarketingRef.current) setShowMarketingText(false)
      // Input stays visible — no setInputVisible(false)
    }

    // On second send: despawn input, show scroll CTA, start 15s auto-scroll
    if (msgIndex === 1) {
      setInputVisible(false)
      setTimeout(() => setShowScrollCta(true), 480)
      scrollCtaTimerRef.current = setTimeout(() => onScrollToVideo?.(), 15000)
    }

    userMsgCountRef.current += 1
    setUserMsgCount(userMsgCountRef.current)
    addMessage({ role: 'user', content: text })
    setIsLoading(true)
    try {
      const history = messages.slice(-9).map(m => ({ role: m.role, content: m.content }))
      history.push({ role: 'user', content: text })
      const res = await fetch(CHATBOT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, language }),
      })
      const data = await res.json()
      let raw = data.response ?? data.message ?? data.output ?? data.text ?? '...'
      raw = raw.replace(/<[^>]*>/g, '').replace(/#+\s/g, '').replace(/`/g, '')
      addMessage({ role: 'assistant', content: raw, isNew: true })
    } catch {
      addMessage({ role: 'assistant', content: 'Connection error.' })
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, messages, language]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = () => {
    if (!input.trim()) return
    sendMessage(input.trim())
    setInput('')
    if (inputRef.current) inputRef.current.style.height = 'auto'
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* === LAYER 1: Base deep-space gradient — dark field, subtle center lift === */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 52% 42% at 50% 48%, rgba(255,255,255,0.028) 0%, transparent 65%),
            linear-gradient(180deg, #07050F 0%, #0A0818 38%, #0E0B22 68%, #110D28 100%)
          `,
        }}
      />

      {/* === LAYER 2: Intro bloom rings (fire once when introDone) === */}
      <div className="absolute inset-0 z-[2] pointer-events-none flex items-center justify-center overflow-hidden">
        {introDone && BLOOM_RINGS.map(i => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            initial={{ scale: 0, opacity: 0.75 }}
            animate={{ scale: 5 + i * 0.9, opacity: 0 }}
            transition={{ duration: 2.4 + i * 0.12, delay: i * 0.16, ease: [0.08, 0, 0.35, 0] }}
            style={{
              width: 160,
              height: 160,
              border: `1px solid rgba(139,92,246,${0.65 - i * 0.11})`,
              boxShadow: i === 0 ? '0 0 30px rgba(139,92,246,0.25), inset 0 0 30px rgba(139,92,246,0.15)' : 'none',
            }}
          />
        ))}
      </div>

      {/* GooeyFilter SVG definition (hidden, just defines the filter) */}
      <GooeyFilter id="hero-goo" strength={2} />

      {/* === LAYER 4: Radial vignette — deep edge darkening === */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 58% 52% at 50% 46%, transparent 0%, rgba(2,1,12,0.52) 48%, rgba(2,1,12,0.88) 100%)' }}
      />

      {/* === LAYER 5: Interactive background boxes (hidden on mobile — skew glitches on portrait) === */}
      <motion.div
        className="absolute inset-0 z-[4] overflow-hidden hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, delay: 0.4 }}
      >
        <Boxes />
      </motion.div>

      {/* === LAYER 6: Soft overlay on top of boxes so content stays readable === */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 44%, rgba(4,2,18,0.30) 0%, rgba(4,2,18,0.10) 55%, transparent 100%)' }}
      />

      {/* === LAYER 7: Bottom section fade === */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 z-[5] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(13,11,26,0.7) 55%, #0D0B1A 100%)' }}
      />

      <div className="relative z-[10] w-full h-full pointer-events-none">
        {/* Chat area — input fixed at center, messages grow upward */}
        <motion.div
          className="absolute inset-x-0 flex flex-col items-center px-4 md:px-12 lg:px-20 z-[5]"
          style={{ top: '0%', bottom: '30%' }}
          animate={{ opacity: chatAreaVisible ? 1 : 0, y: chatAreaVisible ? 0 : 48 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >

          {/* Messages — flex-1, messages anchored to bottom so they grow upward */}
          <div
            ref={scrollContainerRef}
            className="relative z-[1] w-full max-w-md flex-1 min-h-0 overflow-y-auto overflow-x-hidden chat-scroll-hero flex flex-col pb-4 px-4 pointer-events-auto"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%)',
            }}
          >
            <div className="flex-1" />
            <motion.div
              className="flex flex-col items-center gap-2.5 mb-8 shrink-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: badgeVisible && input.length === 0 && userMsgCount === 0 ? 1 : 0, y: badgeVisible ? 0 : 20 }}
              transition={{ delay: 0.15, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="flex items-center gap-2.5 px-4 py-2 rounded-full"
                animate={{ boxShadow: ['0 0 0px rgba(139,92,246,0.25)', '0 0 22px rgba(139,92,246,0.55)', '0 0 0px rgba(139,92,246,0.25)'] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  background: 'rgba(10,6,28,0.97)',
                  border: '1px solid rgba(139,92,246,0.50)',
                  backdropFilter: 'blur(14px)',
                  willChange: 'box-shadow',
                }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full shrink-0"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  style={{ background: 'rgba(139,92,246,1)', boxShadow: '0 0 10px rgba(139,92,246,0.9)', willChange: 'transform, opacity' }}
                />
                <span style={{ color: 'rgba(225,210,255,0.95)', fontSize: '0.83rem', fontWeight: 500, letterSpacing: '0.01em' }}>
                  {language === 'de'
                    ? 'Fragen? Unsere KI hört zu — tippe einfach.'
                    : language === 'fr'
                    ? 'Des questions ? Notre IA vous écoute — écrivez.'
                    : 'Questions? Our AI is listening — just type.'}
                </span>
              </motion.div>
              <motion.span
                animate={{ y: [0, 5, 0], opacity: [0.35, 0.7, 0.35] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ color: 'rgba(139,92,246,0.8)', fontSize: '1.1rem', lineHeight: 1, willChange: 'transform, opacity' }}
              >
                ↓
              </motion.span>
            </motion.div>

            <div className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.88, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: -6 }}
                    style={{ originX: msg.role === 'user' ? 1 : 0, originY: 1 }}
                    transition={{ type: 'spring', damping: 22, stiffness: 280, mass: 0.7 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.isConfirmation ? (
                      <div className="max-w-[84%] rounded-2xl px-4 py-3 text-xs leading-relaxed"
                        style={{
                          background: msg.content.startsWith('📬') ? 'rgba(25,10,65,0.95)' : 'rgba(8,35,25,0.95)',
                          border: msg.content.startsWith('📬') ? '1px solid rgba(139,92,246,0.40)' : '1px solid rgba(52,211,153,0.38)',
                          boxShadow: msg.content.startsWith('📬') ? '0 4px 24px rgba(139,92,246,0.12), inset 0 1px 0 rgba(139,92,246,0.14)' : '0 4px 24px rgba(52,211,153,0.10), inset 0 1px 0 rgba(52,211,153,0.16)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                        }}
                      >
                        {(() => {
                          const sep = msg.content.indexOf('\n\n')
                          const title = sep >= 0 ? msg.content.slice(0, sep) : msg.content
                          const body = sep >= 0 ? msg.content.slice(sep + 2) : ''
                          return (
                            <>
                              <p className={`font-medium mb-1.5 text-[11px] tracking-wider ${msg.content.startsWith('📬') ? 'text-violet-400/80' : 'text-emerald-400/85'}`}>{title}</p>
                              {body && <p className="text-white/65">{renderContent(body)}</p>}
                            </>
                          )
                        })()}
                      </div>
                    ) : msg.role === 'user' ? (
                      /* User bubble */
                      <div
                        className="max-w-[78%] rounded-[18px] px-4 py-2.5 text-[15px] leading-relaxed break-words"
                        style={{
                          background: 'rgba(38, 20, 100, 1.0)',
                          border: '1px solid rgba(167, 139, 250, 0.45)',
                          boxShadow: '0 4px 24px rgba(0,0,0,0.65), 0 0 0 1px rgba(139,92,246,0.14)',
                          color: 'rgba(255,255,255,0.97)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                        }}
                      >
                        {renderContent(msg.content)}
                      </div>
                    ) : (
                      /* AI bubble — DotPattern bordered style */
                      <div className="relative max-w-[86%]" style={{ isolation: 'isolate' }}>
                        {/* Corner squares — centered on border corners (half inside, half outside) */}
                        <div className="absolute w-3 h-3 z-10" style={{ background: 'rgba(139,92,246,0.95)', left: -6, top: -6 }} />
                        <div className="absolute w-3 h-3 z-10" style={{ background: 'rgba(139,92,246,0.95)', left: -6, bottom: -6 }} />
                        <div className="absolute w-3 h-3 z-10" style={{ background: 'rgba(139,92,246,0.95)', right: -6, top: -6 }} />
                        <div className="absolute w-3 h-3 z-10" style={{ background: 'rgba(139,92,246,0.95)', right: -6, bottom: -6 }} />

                        <div
                          className="relative overflow-hidden px-5 py-4 text-[15px] leading-[1.70]"
                          style={{
                            background: 'rgba(7,4,24,1)',
                            border: '1px solid rgba(139,92,246,0.38)',
                            color: 'rgba(255,255,255,0.96)',
                            boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                          }}
                        >
                          <DotPattern
                            width={6}
                            height={6}
                            cx={1}
                            cy={1}
                            cr={0.7}
                            className="fill-violet-400/[0.07] md:fill-violet-400/[0.07]"
                          />
                          <div className="relative z-10">
                            {msg.isNew ? (
                              <TypingMessage
                                text={msg.content}
                                scrollRef={scrollContainerRef}
                                isActive={isActive}
                                onComplete={() => {
                                  markDone(msg.id)
                                  setTimeout(() => inputRef.current?.focus(), 150)
                                }}
                              />
                            ) : (
                              renderContent(msg.content)
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div key="loading" initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="flex justify-start">
                    <div className="rounded-[20px] px-5 py-3.5"
                      style={{
                        background: 'rgba(7, 4, 24, 1.0)',
                        border: '1px solid rgba(139, 92, 246, 0.32)',
                        boxShadow: '0 20px 120px rgba(0,0,0,0.38), 0 8px 60px rgba(0,0,0,0.28)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                      }}>
                      <ThinkingProcess language={language} isFirst={userMsgCount === 1} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* placeholder so layout doesn't shift */}

          {/* Input + Scroll CTA */}
          <div style={{ width: '100%', maxWidth: 448, marginTop: 12, flexShrink: 0 }} className="pointer-events-auto relative z-[1]">
            {/* Scroll-to-video CTA — appears after 2nd message */}
            <AnimatePresence>
              {showScrollCta && (
                <motion.div
                  key="scroll-cta"
                  className="w-full flex flex-col items-center gap-3"
                  initial={{ opacity: 0, y: 18, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.96 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    onClick={() => {
                      clearTimeout(scrollCtaTimerRef.current)
                      onScrollToVideo?.()
                    }}
                    className="group relative w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-[20px] overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(38,14,100,0.97) 0%, rgba(20,8,60,0.97) 100%)',
                      border: '1px solid rgba(139,92,246,0.55)',
                      boxShadow: '0 0 32px rgba(139,92,246,0.22), 0 4px 24px rgba(0,0,0,0.55), inset 0 1px 0 rgba(167,139,250,0.15)',
                    }}
                  >
                    {/* Shimmer sweep on hover */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background: 'linear-gradient(105deg, transparent 30%, rgba(139,92,246,0.18) 50%, transparent 70%)',
                        transition: 'opacity 0.3s ease',
                      }}
                    />
                    <motion.div
                      className="relative flex items-center justify-center w-7 h-7 rounded-full shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.85) 0%, rgba(109,40,217,0.75) 100%)',
                        boxShadow: '0 0 16px rgba(139,92,246,0.55)',
                      }}
                      animate={{ boxShadow: ['0 0 16px rgba(139,92,246,0.55)', '0 0 28px rgba(139,92,246,0.80)', '0 0 16px rgba(139,92,246,0.55)'] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                    </motion.div>
                    <span
                      className="relative text-[15px] font-medium tracking-wide"
                      style={{ color: 'rgba(220,205,255,0.97)', letterSpacing: '0.02em' }}
                    >
                      {language === 'de' ? 'HaloVision in Aktion sehen' : language === 'fr' ? 'Voir HaloVision en action' : 'See HaloVision in action'}
                    </span>
                    <motion.span
                      className="relative text-violet-400/70 text-sm"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                    >→</motion.span>
                  </button>
                  <motion.p
                    className="text-[11px] text-white/30 tracking-widest uppercase"
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {language === 'de' ? 'oder warte kurz …' : language === 'fr' ? 'ou patiente un instant …' : 'or continuing in a moment …'}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="w-full"
              animate={{ opacity: inputVisible ? 1 : 0, y: inputVisible ? 0 : 12, scale: inputVisible ? 1 : 0.97, pointerEvents: inputVisible ? 'auto' : 'none' } as never}
              transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
            >
              {(charWarning || userMsgCount >= 18) && (
                <p className="text-[10px] text-violet-400/70 mb-1.5 text-right pr-1">
                  {userMsgCount >= 20 ? 'Message limit reached' : charWarning ? `Max ${userMsgCount === 0 ? 3000 : 750} characters` : `${20 - userMsgCount} messages left`}
                </p>
              )}
              <BorderRotate
                animationMode="auto-rotate"
                animationSpeed={4}
                gradientColors={{ primary: '#3b1e7a', secondary: '#8B5CF6', accent: '#c4b5fd' }}
                backgroundColor="rgba(8, 5, 26, 0.97)"
                borderWidth={1}
                borderRadius={20}
                style={{ width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.50), 0 0 22px rgba(139,92,246,0.18)' }}
              >
              <GlassPanel
                className="flex items-end gap-3 rounded-[20px] px-4 py-3"
                style={{
                  background: 'rgba(8, 5, 26, 0.97)',
                  boxShadow: 'none',
                }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  rows={1}
                  onChange={e => {
                    const maxChars = userMsgCount === 0 ? 3000 : 750
                    const val = e.target.value.slice(0, maxChars)
                    setInput(val)
                    if (val.length > 0) setCtaVisible(true)
                    setCharWarning(val.length > maxChars * 0.88)
                    e.target.style.height = 'auto'
                    e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px'
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
                  }}
                  placeholder={typewriterPlaceholder}
                  className="flex-1 bg-transparent text-white text-base placeholder-white/30 outline-none resize-none leading-relaxed"
                  style={{ maxHeight: 80 }}
                 
                />
                <button onClick={handleSubmit} disabled={!input.trim() || isLoading || userMsgCount >= 20}
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5 disabled:opacity-30 transition-all"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.65) 0%, rgba(109,40,217,0.55) 100%)',
                    border: '1px solid rgba(167,139,250,0.35)',
                    boxShadow: '0 0 14px rgba(139,92,246,0.30), inset 0 1px 0 rgba(255,255,255,0.12)',
                  }}
                  onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.boxShadow = '0 0 22px rgba(139,92,246,0.50), inset 0 1px 0 rgba(255,255,255,0.18)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 14px rgba(139,92,246,0.30), inset 0 1px 0 rgba(255,255,255,0.12)' }}
                >
                  <Send className="w-3.5 h-3.5 text-white/90" />
                </button>
              </GlassPanel>
              </BorderRotate>
            </motion.div>
          </div>
        </motion.div>

        {/* Giant background titles — HALO / VISION stacked, always fills viewport width */}
        {(titleReady ?? introDone) && isActive && (
          <motion.div
            aria-hidden
            className="absolute inset-0 z-0 select-none pointer-events-none"
            animate={{ opacity: hideBackground ? 0 : 1 }}
            transition={{ duration: 1.8, ease: [0.4, 0, 0.6, 1] }}
          >
            <div style={{
              position: 'absolute',
              top: '10%',
              left: 0,
              right: 0,
              lineHeight: 1,
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Row 1 — HALO, full-width white fill */}
              <AnimatedWord
                word="HALO"
                delay={0.05}
                className="font-anurati"
                style={{
                  fontSize: haloFontPx + 'px',
                  color: '#ffffff',
                  fontWeight: 900,
                  lineHeight: 0.88,
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.02em',
                  textShadow: `0 0 120px rgba(185,155,255,0.55), 0 0 40px rgba(139,92,246,0.35), 0 0 8px rgba(255,255,255,0.20)`,
                }}
              />

              {/* Row 2 — VISION double-outline + AI label */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1vw', lineHeight: 0.88, marginTop: '1vh', paddingRight: isMobile ? 'clamp(12px, 4vw, 40px)' : 'clamp(120px, 18vw, 280px)' }}>
                {/* VISION — SVG double-stroke: fill="none" = truly transparent, consistent on all glyphs */}
                <motion.svg
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    y: { duration: 0.55, delay: 0.5, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.75, delay: 0.5, ease: 'easeOut' },
                  }}
                  style={{ display: 'block', overflow: 'visible', flexShrink: 1 }}
                  height={Math.ceil(visionFontPx * 0.88)}
                  width="auto"
                >
                  <defs>
                    <filter id="vision-glow" x="-10%" y="-40%" width="120%" height="180%">
                      <feGaussianBlur stdDeviation="10" result="blur" />
                      <feFlood floodColor="rgba(88,28,235,0.5)" result="color" />
                      <feComposite in="color" in2="blur" operator="in" result="glow" />
                      <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  {/* Outer stroke — thin soft halo band */}
                  <text
                    y={Math.ceil(visionFontPx * 0.82)}
                    fontFamily="anurati, sans-serif"
                    fontSize={visionFontPx}
                    fontWeight={900}
                    letterSpacing={visionFontPx * 0.02}
                    fill="none"
                    stroke="rgba(139,92,246,0.55)"
                    strokeWidth={5}
                  >VISION</text>
                  {/* Inner crisp stroke — bright neon line on path center */}
                  <text
                    y={Math.ceil(visionFontPx * 0.82)}
                    fontFamily="anurati, sans-serif"
                    fontSize={visionFontPx}
                    fontWeight={900}
                    letterSpacing={visionFontPx * 0.02}
                    fill="none"
                    stroke="rgba(220,200,255,0.98)"
                    strokeWidth={1.6}
                    filter="url(#vision-glow)"
                  >VISION</text>
                </motion.svg>
                <motion.span
                  className="font-anurati"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    y: { duration: 0.55, delay: 0.95, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.75, delay: 0.95, ease: 'easeOut' },
                  }}
                  style={{
                    fontSize: aiFontPx + 'px',
                    color: 'rgba(185,155,255,0.97)',
                    fontWeight: 700,
                    letterSpacing: '0.10em',
                    paddingBottom: '0.10em',
                    flexShrink: 0,
                    textShadow: `0 0 60px ${VIOLET}, 0 0 24px rgba(139,92,246,0.90), 0 0 8px rgba(167,139,250,0.70)`,
                    filter: 'drop-shadow(0 0 12px rgba(139,92,246,0.60))',
                  }}
                >
                  AI
                </motion.span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Book CTA — shows 1.5s after intro or on return */}
        <motion.div
          className="absolute bottom-20 md:bottom-18 right-4 md:right-16 pointer-events-auto z-[5]"
          initial={{ opacity: 0, y: 8 }}
          animate={ctaVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <NeonButton onClick={onBooking} size="md" variant="violet">
            {tr.startJourney}
          </NeonButton>
        </motion.div>
      </div>
      {/* === Marketing text overlay === */}
      <AnimatePresence>
        {showMarketingText && (
          <motion.div
            key="marketing-text"
            className="absolute inset-0 z-[20] flex flex-col items-center justify-center pointer-events-none px-8"
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={marketingSliding
              ? { y: -190, scale: 0.74, opacity: 1 }
              : { y: 0, scale: 1, opacity: 1 }
            }
            exit={{ opacity: 0, scale: 0.88, y: -220, transition: { duration: 0.45, ease: [0.4, 0, 1, 1] } }}
            transition={marketingSliding
              ? { duration: 1.1, ease: [0.34, 1.56, 0.64, 1] }
              : { duration: 0.4 }
            }
          >
            {/* Draggable content wrapper — whole text block can be grabbed and springs back */}
            <motion.div
              className="relative cursor-grab active:cursor-grabbing"
              style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '2.4rem', maxWidth: '50rem', userSelect: 'none', touchAction: 'none' }}
              drag={!marketingParticle}
              dragElastic={0.22}
              dragTransition={{ bounceStiffness: 360, bounceDamping: 11 }}
              dragConstraints={{ left: -260, right: 260, top: -160, bottom: 160 }}
              whileDrag={{ scale: 1.03 }}
              animate={marketingParticle ? { x: 0, y: 0, scale: 1 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >

              {/* Scaling container — grows from top-left, wraps border + dot pattern + corners */}
              {marketingBoxVisible && (
                <motion.div
                  initial={{ scaleX: 0, scaleY: 0 }}
                  animate={marketingParticle
                    ? { opacity: 0, scaleX: 1, scaleY: 1 }
                    : { scaleX: 1, scaleY: 1, opacity: 1 }
                  }
                  transition={marketingParticle
                    ? { opacity: { duration: 0.35 } }
                    : {
                        scaleX: { duration: 1.1, ease: [0.34, 1.56, 0.64, 1] },
                        scaleY: { duration: 1.3, ease: [0.34, 1.56, 0.64, 1] },
                      }
                  }
                  style={{
                    position: 'absolute',
                    top: -38, left: -53, right: -53, bottom: -38,
                    transformOrigin: 'top left',
                    pointerEvents: 'none',
                  }}
                >
                  {/* Inner bordered area with overflow:hidden for DotPattern */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    border: '1px solid rgba(139,92,246,0.45)',
                    borderRadius: 0,
                    overflow: 'hidden',
                    boxShadow: '0 0 48px rgba(139,92,246,0.10), inset 0 0 48px rgba(139,92,246,0.05)',
                  }}>
                    <DotPattern
                      width={5}
                      height={5}
                      cx={1}
                      cy={1}
                      cr={0.6}
                      className="fill-violet-400/[0.33] md:fill-violet-400/[0.33]"
                    />
                  </div>
                  {/* Corner markers live outside overflow:hidden so they stick out */}
                  <div style={{ position: 'absolute', left: -4, top: -4, width: 8, height: 8, background: 'rgba(139,92,246,0.95)' }} />
                  <div style={{ position: 'absolute', left: -4, bottom: -4, width: 8, height: 8, background: 'rgba(139,92,246,0.95)' }} />
                  <div style={{ position: 'absolute', right: -4, top: -4, width: 8, height: 8, background: 'rgba(139,92,246,0.95)' }} />
                  <div style={{ position: 'absolute', right: -4, bottom: -4, width: 8, height: 8, background: 'rgba(139,92,246,0.95)' }} />
                </motion.div>
              )}

              {/* Headline — word-by-word particle reveal / scatter */}
              <p style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(1.92rem, 4.56vw, 3.12rem)', color: 'rgba(255,255,255,0.96)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.015em', textShadow: '0 2px 60px rgba(139,92,246,0.40)', margin: 0, textAlign: 'center' }}>
                {tr.heroTitle1.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, x: -22, filter: 'blur(6px)' }}
                    animate={marketingParticle
                      ? { opacity: 0, x: (i % 5 - 2) * 38, y: -28 - (i % 4) * 12, filter: 'blur(7px)' }
                      : { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }
                    }
                    transition={marketingParticle
                      ? { duration: 0.48, delay: i * 0.045, ease: [0.4, 0, 1, 1] }
                      : { duration: 0.55, delay: 0.08 + i * 0.09, ease: [0.16, 1, 0.3, 1] }
                    }
                    style={{ display: 'inline-block', marginRight: '0.28em', willChange: 'transform, opacity, filter' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </p>

              {/* Body — word-by-word with later stagger / scatter */}
              <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 'clamp(1.12rem, 2.1vw, 1.4rem)', color: 'rgba(200,185,255,0.68)', lineHeight: 1.65, margin: 0, maxWidth: '42ch', textAlign: 'center' }}>
                {tr.heroSubtitle.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, x: -14, filter: 'blur(4px)' }}
                    animate={marketingParticle
                      ? { opacity: 0, x: ((i + 2) % 5 - 2) * 30, y: -20 - (i % 3) * 10, filter: 'blur(6px)' }
                      : { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }
                    }
                    transition={marketingParticle
                      ? { duration: 0.42, delay: 0.05 + i * 0.03, ease: [0.4, 0, 1, 1] }
                      : { duration: 0.45, delay: 0.45 + i * 0.03, ease: [0.16, 1, 0.3, 1] }
                    }
                    style={{ display: 'inline-block', marginRight: '0.28em', willChange: 'transform, opacity, filter' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
