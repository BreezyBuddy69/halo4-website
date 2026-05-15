import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Send } from 'lucide-react'
import { NeonButton } from '../ui/NeonButton'
import { GlassPanel } from '../ui/GlassPanel'
import { TypingMessage } from '../chat/TypingMessage'
import { ThinkingProcess } from '../chat/ThinkingProcess'
import { BorderRotate } from '../ui/animated-gradient-border'
import { DotPattern } from '../ui/dot-pattern-1'
import { t } from '../../utils/translations'
import type { Language } from '../../utils/translations'
import { useChatContext } from '../../contexts/ChatContext'
import { GooeyFilter } from '../ui/gooey-filter'
import { Boxes } from '../ui/background-boxes'

const CHATBOT_URL = import.meta.env.VITE_CHATBOT_URL as string
const VIOLET = '#8B5CF6'
const ORANGE = '#8B5CF6'

// Track across mounts — once shown, never show again in this JS session
let _continueShownOnce = false

/* Floating orb that subtly follows the mouse */
function MouseOrb() {
  const rawX = useMotionValue(0.5)
  const rawY = useMotionValue(0.5)
  const x = useSpring(rawX, { stiffness: 80, damping: 30 })
  const y = useSpring(rawY, { stiffness: 80, damping: 30 })
  const left = useTransform(x, [0, 1], ['10%', '80%'])
  const top  = useTransform(y, [0, 1], ['10%', '80%'])

  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawX.set(e.clientX / window.innerWidth)
      rawY.set(e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [rawX, rawY])

  return (
    <motion.div
      style={{ left, top, position: 'absolute', translateX: '-50%', translateY: '-50%' }}
      className="pointer-events-none"
    >
      <div style={{
        width: 480, height: 480,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${VIOLET}44 0%, ${VIOLET}11 45%, transparent 70%)`,
        filter: 'blur(60px)',
      }} />
    </motion.div>
  )
}

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
          transition={{ duration: 0.9, delay: delay + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'inline-block', willChange: 'transform, opacity' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

const AMBIENT_ORBS = [
  { w: 500, h: 380, left: '-8%', top: '42%', color: 'radial-gradient(ellipse at center, rgba(139,92,246,0.26) 0%, transparent 68%)', dur: 14, delay: 0, y: -130, x: 55 },
  { w: 400, h: 400, left: '68%', top: '50%', color: 'radial-gradient(ellipse at center, rgba(139,92,246,0.28) 0%, transparent 68%)', dur: 11, delay: 1.5, y: -100, x: -45 },
  { w: 320, h: 320, left: '78%', top: '8%', color: 'radial-gradient(ellipse at center, rgba(88,28,235,0.22) 0%, transparent 65%)', dur: 17, delay: 0.7, y: 90, x: 28 },
  { w: 240, h: 240, left: '38%', top: '72%', color: 'radial-gradient(ellipse at center, rgba(109,40,217,0.20) 0%, transparent 62%)', dur: 9, delay: 2.8, y: -170, x: -55 },
  { w: 200, h: 200, left: '12%', top: '22%', color: 'radial-gradient(ellipse at center, rgba(167,139,250,0.24) 0%, transparent 60%)', dur: 13, delay: 0.4, y: 110, x: 85 },
  { w: 150, h: 150, left: '52%', top: '30%', color: 'radial-gradient(ellipse at center, rgba(167,139,250,0.18) 0%, transparent 58%)', dur: 8, delay: 3.2, y: -80, x: -28 },
]

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
          timerRef.current = setTimeout(tick, 40)
        }
      }
    }
    timerRef.current = setTimeout(tick, 40)
    return () => clearTimeout(timerRef.current)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return displayed
}

export function HeroSection({ language, isActive, onBooking, inputRef, introDone, titleReady, onScrollToVideo }: HeroSectionProps) {
  const tr = t(language)
  const greetingMsg = tr.heroGreeting
  const { messages, isLoading, addMessage, markDone, setIsLoading } = useChatContext()
  const haloFontPx = useFitFont('HALO', 0.97)
  // VISION measured independently so it fills ~74% of viewport, leaving room for AI
  const visionFontPx = useFitFont('VISION', 0.74)
  // AI at 52% of VISION height — together they fill ~97% of the row
  const aiFontPx = Math.floor(visionFontPx * 0.52)

  const [input, setInput] = useState('')
  const [inputVisible, setInputVisible] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(false)
  const [chatAreaVisible, setChatAreaVisible] = useState(false)
  const [userMsgCount, setUserMsgCount] = useState(0)
  const userMsgCountRef = useRef(0)
  const [charWarning, setCharWarning] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [showContinue, setShowContinue] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const placeholders = [tr.heroPlaceholder1, tr.heroPlaceholder2, tr.heroPlaceholder3]
  const typewriterPlaceholder = useTypewriterText(placeholders)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const greetingFiredRef = useRef(false)
  const hasLeftRef = useRef(false)

  // CTA button: show after 10s, or when user starts typing, or after leaving+returning
  useEffect(() => {
    if (ctaVisible) return
    const t = setTimeout(() => setCtaVisible(true), 10000)
    return () => clearTimeout(t)
  }, [ctaVisible])

  // Chat area fades in after introDone
  useEffect(() => {
    if (!introDone) return
    const t = setTimeout(() => setChatAreaVisible(true), 600)
    return () => clearTimeout(t)
  }, [introDone])

  useEffect(() => {
    if (!isActive && introDone) hasLeftRef.current = true
    if (isActive && hasLeftRef.current) setCtaVisible(true)
  }, [isActive, introDone])

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight })
  }, [messages, isLoading])

  useEffect(() => {
    if (messages.length > 0 && messages.every(m => !m.isNew)) {
      setInputVisible(true)
    }
  }, [messages])

  useEffect(() => {
    if (!isActive || !chatAreaVisible || greetingFiredRef.current || messages.length > 0) return
    const timer = setTimeout(() => {
      greetingFiredRef.current = true
      addMessage({ role: 'assistant', content: greetingMsg, isNew: true })
    }, 400)
    return () => clearTimeout(timer)
  }, [isActive, chatAreaVisible]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-advance after 3 s if user doesn't click
  useEffect(() => {
    if (!showContinue) return
    setCountdown(3)
    const iv = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(iv); onScrollToVideo?.(); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [showContinue]) // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return
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
      {/* === LAYER 1: Base deep-space gradient === */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 45% at 50% -2%, rgba(139,92,246,0.14) 0%, transparent 58%),
            radial-gradient(ellipse 60% 55% at 18% 85%, rgba(139,92,246,0.20) 0%, transparent 62%),
            radial-gradient(ellipse 50% 48% at 82% 62%, rgba(88,28,235,0.16) 0%, transparent 58%),
            linear-gradient(180deg, #0D0B1A 0%, #120e2a 40%, #1a0f3d 72%, #22114d 100%)
          `,
        }}
      />

      {/* === LAYER 2: Ambient floating glows === */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        {AMBIENT_ORBS.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.w,
              height: orb.h,
              left: orb.left,
              top: orb.top,
              background: orb.color,
            }}
            animate={{ y: [0, orb.y, 0], x: [0, orb.x, 0] }}
            transition={{ duration: orb.dur, delay: orb.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* === LAYER 3: Intro bloom rings (fire once when introDone) === */}
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

      {/* === LAYER 4: Radial vignette (below boxes) === */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 72% 65% at 50% 44%, transparent 0%, rgba(4,2,18,0.32) 52%, rgba(4,2,18,0.60) 100%)' }}
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
          style={{ top: '10%', bottom: '8%' }}
          animate={{ opacity: chatAreaVisible ? 1 : 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
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
              className="flex items-center justify-center gap-2 mb-12 shrink-0"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: inputVisible && input.length === 0 ? 1 : 0, x: introDone ? 0 : -24 }}
              transition={{ delay: 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  background: input.length > 0 ? 'rgba(255,255,255,0.5)' : 'rgba(139,92,246,0.9)',
                  boxShadow: input.length > 0 ? 'none' : '0 0 8px rgba(139,92,246,0.7)',
                  transition: 'background 0.4s ease, box-shadow 0.4s ease',
                  willChange: 'transform, opacity',
                }}
              />
              <motion.span
                className="text-[11px] tracking-[0.14em] uppercase font-semibold px-2 py-0.5 rounded"
                animate={{ opacity: [0.75, 1, 0.75] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  willChange: 'opacity',
                  color: 'rgba(255,255,255,0.92)',
                  textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.7)',
                  background: 'rgba(0,0,0,0.28)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                }}
              >
                {tr.talkToIntegratedAI}
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
                        className="max-w-[78%] rounded-[18px] px-4 py-2.5 text-[13px] leading-relaxed break-words"
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
                          className="relative overflow-hidden px-5 py-4 text-[13px] leading-[1.70]"
                          style={{
                            background: 'rgba(7,4,24,1)',
                            border: '1px solid rgba(139,92,246,0.38)',
                            color: 'rgba(255,255,255,0.96)',
                            boxShadow: '0 8px 40px rgba(0,0,0,0.72), 0 0 0 1px rgba(139,92,246,0.10)',
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
                                  const count = userMsgCountRef.current
                                  if (count >= 1) setTimeout(() => setShowScrollBtn(true), 300)
                                  if (count >= 3 && !_continueShownOnce) setTimeout(() => { _continueShownOnce = true; setShowContinue(true) }, 500)
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
                        boxShadow: '0 8px 40px rgba(0,0,0,0.72), 0 0 0 1px rgba(139,92,246,0.10)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                      }}>
                      <ThinkingProcess language={language} isFirst={userMsgCount === 1} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Inline scroll btn — appears after first AI reply */}
              <AnimatePresence>
                {showScrollBtn && !showContinue && (
                  <motion.div
                    key="scroll-btn"
                    initial={{ opacity: 0, y: 10, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
                    transition={{ type: 'spring', damping: 22, stiffness: 260, delay: 0.1 }}
                    className="flex justify-start mt-1"
                  >
                    <button
                      onClick={onScrollToVideo}
                      className="flex items-center gap-2 rounded-[16px] px-4 py-2.5 text-[12px] font-medium"
                      style={{
                        background: 'linear-gradient(135deg, rgba(55,20,140,0.93) 0%, rgba(40,10,120,0.96) 100%)',
                        border: '1px solid rgba(139,92,246,0.55)',
                        color: 'rgba(220,200,255,0.97)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.55), 0 0 24px rgba(139,92,246,0.22)',
                        transition: 'background 0.25s ease,box-shadow 0.25s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(75,30,165,0.96) 0%, rgba(55,15,140,0.98) 100%)'
                        e.currentTarget.style.boxShadow = '0 4px 28px rgba(0,0,0,0.60), 0 0 32px rgba(139,92,246,0.38)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(55,20,140,0.93) 0%, rgba(40,10,120,0.96) 100%)'
                        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.55), 0 0 24px rgba(139,92,246,0.22)'
                      }}
                    >
                      <motion.span animate={{ y: [0,3,0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} style={{ display: 'inline-block', fontSize: 13 }}>↓</motion.span>
                      {language === 'de' ? 'Weiter zum Video' : language === 'fr' ? 'Voir la vidéo' : 'See it in action'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* placeholder so layout doesn't shift */}

          {/* Input */}
          <div style={{ width: '100%', maxWidth: 448, marginTop: 12, flexShrink: 0 }} className="pointer-events-auto relative z-[1]">
            <motion.div
              className="w-full"
              animate={{ opacity: inputVisible && !showContinue ? 1 : 0, pointerEvents: inputVisible && !showContinue ? 'auto' : 'none' } as never}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            >
              {(charWarning || userMsgCount >= 18) && (
                <p className="text-[10px] text-violet-400/70 mb-1.5 text-right pr-1">
                  {userMsgCount >= 20 ? 'Message limit reached' : charWarning ? `Max ${userMsgCount === 0 ? 3000 : 750} characters` : `${20 - userMsgCount} messages left`}
                </p>
              )}
              <GlassPanel
                className="flex items-end gap-3 rounded-[20px] px-4 py-3"
                style={{
                  background: 'rgba(8, 5, 26, 0.97)',
                  border: input.length > 0 ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(139,92,246,0.40)',
                  boxShadow: input.length > 0 ? '0 4px 24px rgba(0,0,0,0.50)' : '0 4px 24px rgba(0,0,0,0.50), 0 0 22px rgba(139,92,246,0.18)',
                  transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
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
                  className="flex-1 bg-transparent text-white text-sm placeholder-white/30 outline-none resize-none leading-relaxed"
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
            </motion.div>
          </div>
        </motion.div>

        {/* Giant background titles — HALO / VISION stacked, always fills viewport width */}
        {(titleReady ?? introDone) && isActive && (
          <div
            aria-hidden
            className="absolute inset-0 z-0 select-none pointer-events-none"
          >
            {/* Mouse orb */}
            <div className="absolute inset-0 overflow-hidden">
              <MouseOrb />
            </div>

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
                delay={0.1}
                className="font-anurati"
                style={{
                  fontSize: haloFontPx + 'px',
                  color: '#ffffff',
                  fontWeight: 900,
                  lineHeight: 0.88,
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.02em',
                  textShadow: `0 0 160px ${ORANGE}44, 0 4px 40px rgba(0,0,0,0.5)`,
                }}
              />

              {/* Row 2 — VISION double-outline + AI label */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1vw', lineHeight: 0.88, marginTop: '1vh', paddingRight: 'clamp(120px, 18vw, 280px)' }}>
                {/* VISION — SVG double-stroke: fill="none" = truly transparent, consistent on all glyphs */}
                <motion.svg
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
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
                  {/* Outer wide stroke — soft halo */}
                  <text
                    y={Math.ceil(visionFontPx * 0.82)}
                    fontFamily="anurati, sans-serif"
                    fontSize={visionFontPx}
                    fontWeight={900}
                    letterSpacing={visionFontPx * 0.02}
                    fill="none"
                    stroke="rgba(139,92,246,0.35)"
                    strokeWidth={7}
                  >VISION</text>
                  {/* Inner thin stroke — crisp neon line */}
                  <text
                    y={Math.ceil(visionFontPx * 0.82)}
                    fontFamily="anurati, sans-serif"
                    fontSize={visionFontPx}
                    fontWeight={900}
                    letterSpacing={visionFontPx * 0.02}
                    fill="none"
                    stroke="rgba(167,139,250,0.90)"
                    strokeWidth={1.6}
                    filter="url(#vision-glow)"
                  >VISION</text>
                </motion.svg>
                <motion.span
                  className="font-anurati"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
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
          </div>
        )}

        {/* Book CTA — shows after typing starts, 10s timer, or returning from another section */}
        <motion.div
          className="absolute bottom-24 md:bottom-18 right-4 md:right-16 hidden md:block pointer-events-auto z-[5]"
          initial={{ opacity: 0, y: 8 }}
          animate={ctaVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <NeonButton onClick={onBooking} size="md" variant="violet">
            {tr.startJourney}
          </NeonButton>
        </motion.div>
      </div>
      {/* === FULLSCREEN continue overlay — after 3 chat exchanges === */}
      <AnimatePresence>
        {showContinue && (
          <motion.div
            key="continue-fullscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute inset-0 z-[50] flex flex-col items-center justify-center pointer-events-auto"
            style={{
              background: 'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(10,6,28,0.88) 0%, rgba(4,2,14,0.97) 100%)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
            }}
          >
            {/* Pulse rings */}
            {[0,1,2,3].map(i => (
              <motion.div key={i} className="absolute rounded-full pointer-events-none"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: [0.5, 3.5 + i * 0.4], opacity: [0.6, 0] }}
                transition={{ duration: 2.8, delay: i * 0.6, repeat: Infinity, ease: [0.08,0,0.35,0] as never }}
                style={{ width: 180, height: 180, border: `1px solid rgba(139,92,246,${0.5 - i * 0.1})` }}
              />
            ))}

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16,1,0.3,1] }}
              className="flex flex-col items-center gap-8 relative z-10 px-8"
            >
              {/* Label */}
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-violet-500/60" />
                <p className="text-[11px] tracking-[0.28em] uppercase text-white/45 font-medium">
                  {language === 'de' ? 'Bereit für mehr?' : language === 'fr' ? 'Prêt à aller plus loin ?' : 'Ready to go deeper?'}
                </p>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-violet-500/60" />
              </div>

              {/* CTA button */}
              <button
                onClick={onScrollToVideo}
                className="group relative flex items-center gap-4 rounded-2xl px-10 py-5 text-[16px] font-semibold overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.90) 0%, rgba(88,28,235,0.95) 100%)',
                  border: '1px solid rgba(167,139,250,0.55)',
                  color: 'rgba(255,255,255,0.97)',
                  boxShadow: '0 0 60px rgba(139,92,246,0.50), 0 12px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
                  letterSpacing: '0.02em',
                  transition: 'transform 0.25s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 0 80px rgba(139,92,246,0.75), 0 16px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.30)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 0 60px rgba(139,92,246,0.50), 0 12px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.25)'
                }}
              >
                {/* Shimmer sweep */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.12) 50%, transparent 65%)' }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }}
                />
                <span className="relative z-10">
                  {language === 'de' ? 'Jetzt geht es weiter' : language === 'fr' ? 'Continuer' : 'Continue the journey'}
                </span>
                <motion.span
                  className="relative z-10"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ display: 'inline-block', fontSize: 18 }}
                >→</motion.span>
              </button>

              {/* Countdown ring */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(139,92,246,0.18)" strokeWidth="2" />
                    <motion.circle
                      cx="20" cy="20" r="17"
                      fill="none"
                      stroke="rgba(139,92,246,0.75)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 17}`}
                      animate={{ strokeDashoffset: [0, 2 * Math.PI * 17] }}
                      transition={{ duration: 3, ease: 'linear' }}
                    />
                  </svg>
                  <span className="text-[13px] font-semibold text-violet-400/90 tabular-nums">{countdown}</span>
                </div>
                <p className="text-[10px] tracking-[0.18em] uppercase text-white/28">
                  {language === 'de' ? 'Weiter in' : language === 'fr' ? 'Continue dans' : 'Continuing in'} {countdown}s
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
