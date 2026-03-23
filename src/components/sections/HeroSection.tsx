import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'
import { useVantaClouds } from '../../hooks/useVantaClouds'
import { NeonButton } from '../ui/NeonButton'
import { GlassPanel } from '../ui/GlassPanel'
import { TypingMessage } from '../chat/TypingMessage'
import { ThinkingProcess } from '../chat/ThinkingProcess'
import { t } from '../../utils/translations'
import type { Language } from '../../utils/translations'
import { useChatContext } from '../../contexts/ChatContext'

const CHATBOT_URL = 'https://n8n.halovisionai.cloud/webhook/halovisionchatbot997655'

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
}

const CLOUDS_CONFIG = {
  backgroundColor: 0x0,
  skyColor: 0x5ca6ca,
  cloudColor: 0x334d80,
  lightColor: 0xffffff,
  speed: 1,
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

export function HeroSection({ language, isActive, onBooking, inputRef, introDone }: HeroSectionProps) {
  const tr = t(language)
  const greetingMsg = tr.heroGreeting
  const vantaRef = useRef<HTMLDivElement>(null)
  useVantaClouds(vantaRef, CLOUDS_CONFIG, isActive)

  const { messages, isLoading, addMessage, markDone, setIsLoading } = useChatContext()

  const [input, setInput] = useState('')
  const [inputVisible, setInputVisible] = useState(false)
  const [userMsgCount, setUserMsgCount] = useState(0)
  const [charWarning, setCharWarning] = useState(false)
  const placeholders = [tr.heroPlaceholder1, tr.heroPlaceholder2, tr.heroPlaceholder3]
  const typewriterPlaceholder = useTypewriterText(placeholders)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const greetingFiredRef = useRef(false)

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
    if (!isActive || !introDone || greetingFiredRef.current || messages.length > 0) return
    const timer = setTimeout(() => {
      greetingFiredRef.current = true
      addMessage({ role: 'assistant', content: greetingMsg, isNew: true })
    }, 800)
    return () => clearTimeout(timer)  // leaving before 800ms resets greetingFiredRef so it retries on return
  }, [isActive, introDone]) // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return
    setUserMsgCount(c => c + 1)
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
      raw = raw.replace(/<[^>]*>/g, '').replace(/\*\*/g, '').replace(/#+\s/g, '').replace(/`/g, '')
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
      <div ref={vantaRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 z-[1] pointer-events-none m-hero-overlay"
        style={{ background: 'linear-gradient(160deg, rgba(4,6,14,0.60) 0%, rgba(6,10,20,0.40) 40%, rgba(4,6,14,0.65) 100%)' }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-56 z-[1] pointer-events-none m-hero-fade"
        style={{ background: 'linear-gradient(to bottom, transparent, #0f1422)' }}
      />

      <div className="relative z-10 w-full h-full">
        {/* Chat area */}
        <div
          className="absolute inset-x-0 flex flex-col items-center px-4 md:px-12 lg:px-20"
          style={{ top: '5%', bottom: '30%' }}
        >
          {/* Messages */}
          <div
            ref={scrollContainerRef}
            className="w-full max-w-md flex-1 min-h-0 overflow-y-auto chat-scroll-hero flex flex-col justify-end pb-2"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%)',
            }}
          >
            <motion.div
              className="flex items-center justify-center gap-2 mb-12 shrink-0"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: inputVisible && input.length === 0 ? 1 : 0, x: introDone ? 0 : -24 }}
              transition={{ delay: 0.15, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-emerald-400/80"
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ willChange: 'transform, opacity' }}
              />
              <motion.span
                className="text-[11px] text-white/50 max-md:text-white/75 tracking-[0.22em] uppercase font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ willChange: 'opacity' }}
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
                      <div className="max-w-[84%] rounded-2xl px-4 py-3 text-xs leading-relaxed backdrop-blur-md"
                        style={{
                          background: msg.content.startsWith('📬') ? 'rgba(251,191,36,0.08)' : 'rgba(52,211,153,0.09)',
                          border: msg.content.startsWith('📬') ? '1px solid rgba(251,191,36,0.22)' : '1px solid rgba(52,211,153,0.25)',
                          boxShadow: msg.content.startsWith('📬') ? '0 4px 24px rgba(251,191,36,0.05), inset 0 1px 0 rgba(251,191,36,0.10)' : '0 4px 24px rgba(52,211,153,0.06), inset 0 1px 0 rgba(52,211,153,0.12)',
                        }}
                      >
                        {(() => {
                          const sep = msg.content.indexOf('\n\n')
                          const title = sep >= 0 ? msg.content.slice(0, sep) : msg.content
                          const body = sep >= 0 ? msg.content.slice(sep + 2) : ''
                          return (
                            <>
                              <p className={`font-medium mb-1.5 text-[11px] tracking-wider ${msg.content.startsWith('📬') ? 'text-amber-400/80' : 'text-emerald-400/85'}`}>{title}</p>
                              {body && <p className="text-white/65">{renderContent(body)}</p>}
                            </>
                          )
                        })()}
                      </div>
                    ) : msg.role === 'user' ? (
                      /* User bubble */
                      <div
                        className="max-w-[78%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed"
                        style={{
                          background: 'rgba(255,255,255,0.14)',
                          border: '1px solid rgba(255,255,255,0.20)',
                          boxShadow: '0 2px 20px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.18)',
                          color: 'rgba(255,255,255,0.92)',
                          backdropFilter: 'blur(20px)',
                        }}
                      >
                        {renderContent(msg.content)}
                      </div>
                    ) : (
                      /* AI bubble — glass morphism */
                      <div
                        className="max-w-[86%] rounded-2xl px-5 py-4 text-[13px] leading-[1.70]"
                        style={{
                          background: 'rgba(255,255,255,0.09)',
                          border: '1px solid rgba(255,255,255,0.16)',
                          backdropFilter: 'blur(28px)',
                          WebkitBackdropFilter: 'blur(28px)',
                          color: 'rgba(255,255,255,0.90)',
                          boxShadow: '0 8px 40px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.20), inset 0 -1px 0 rgba(0,0,0,0.05)',
                        }}
                      >
                        {/* Halo AI label */}
                        <div className="flex items-center gap-1.5 mb-3 pb-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.09)' }}>
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ willChange: 'opacity' }}
                          />
                          <span className="text-[9px] tracking-[0.22em] uppercase font-medium" style={{ color: 'rgba(255,255,255,0.42)' }}>Halo AI</span>
                        </div>
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
                    )}
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div key="loading" initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="flex justify-start">
                    <div className="rounded-2xl px-5 py-3.5"
                      style={{
                        background: 'rgba(255,255,255,0.09)',
                        border: '1px solid rgba(255,255,255,0.16)',
                        backdropFilter: 'blur(28px)',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.20)',
                      }}>
                      <ThinkingProcess language={language} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Input */}
          <AnimatePresence>
            {inputVisible && (
              <motion.div
                className="w-full max-w-md mt-3 shrink-0"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {(charWarning || userMsgCount >= 18) && (
                  <p className="text-[10px] text-amber-400/70 mb-1.5 text-right pr-1">
                    {userMsgCount >= 20 ? 'Message limit reached' : charWarning ? `Max ${userMsgCount === 0 ? 3000 : 750} characters` : `${20 - userMsgCount} messages left`}
                  </p>
                )}
                <GlassPanel
                  className="flex items-end gap-3 rounded-2xl px-4 py-3"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    backdropFilter: 'blur(24px)',
                    boxShadow: '0 0 40px rgba(200,100,50,0.07), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.10)',
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
                    data-cursor="hover"
                  />
                  <button data-cursor="hover" onClick={handleSubmit} disabled={!input.trim() || isLoading || userMsgCount >= 20}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0 mb-0.5 disabled:opacity-30">
                    <Send className="w-3.5 h-3.5 text-white/70" />
                  </button>
                </GlassPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Headline — slides in from sides */}
        <div className="absolute bottom-20 md:bottom-18 inset-x-0 flex flex-col items-start md:pl-36 lg:pl-40 px-5 md:px-0 overflow-hidden">
          <motion.h1
            className="text-[clamp(2.2rem,6vw,6.5rem)] font-serif text-white leading-[1] tracking-tight mb-2 md:mb-0.5"
            initial={{ opacity: 0, x: -70 }}
            animate={introDone ? { opacity: 1, x: 0 } : { opacity: 0, x: -70 }}
            transition={{ delay: 0.08, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          >
            {tr.heroTitle1}
          </motion.h1>
          <motion.h1
            className="text-[clamp(2.2rem,6vw,6.5rem)] font-serif text-white/50 max-md:text-white/75 leading-[1] tracking-tight"
            initial={{ opacity: 0, x: 70 }}
            animate={introDone ? { opacity: 1, x: 0 } : { opacity: 0, x: 70 }}
            transition={{ delay: 0.22, duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          >
            {tr.heroTitle2}
          </motion.h1>
        </div>

        {/* Book CTA — bottom right (hidden on mobile) */}
        <motion.div
          className="absolute bottom-24 md:bottom-18 right-4 md:right-16 hidden md:block"
          initial={{ opacity: 0, x: 40 }}
          animate={introDone ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ delay: 0.35, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <NeonButton onClick={onBooking} size="md">
            {tr.startJourney}
          </NeonButton>
        </motion.div>
      </div>
    </div>
  )
}
