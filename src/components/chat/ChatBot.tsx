import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { ThinkingProcess } from './ThinkingProcess'
import { TypingMessage } from './TypingMessage'
import { t } from '../../utils/translations'
import type { Language } from '../../utils/translations'
import { useChatContext } from '../../contexts/ChatContext'

const CHATBOT_URL = 'https://n8n.halovisionai.cloud/webhook/halovisionchatbot997655'
const VALID_CATEGORIES = ['general', 'lead-generation', 'custom-solutions', 'save-time', 'examples']

interface ChatBotProps {
  language: Language
  context: string
  onContextUsed: () => void
}

export function ChatBot({ language, context, onContextUsed }: ChatBotProps) {
  const tr = t(language)
  const { messages, isLoading, addMessage, markDone, setIsLoading } = useChatContext()

  const [isOpen, setIsOpen] = useState(false)
  const [animateOpen, setAnimateOpen] = useState(false)
  const [input, setInput] = useState('')
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [userMsgCount, setUserMsgCount] = useState(0)
  const [limitWarning, setLimitWarning] = useState(false)
  const [buttonBrightness, setButtonBrightness] = useState(0)

  const scrollRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const pendingMsgRef = useRef('')
  const rafRef = useRef<number>(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  // Track which message ids existed before this ChatBot session opened
  const seenMsgIdsRef = useRef<Set<number>>(new Set())
  const hoverCloseTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const openChat = useCallback(() => {
    // Mark all current messages as "already seen" so they don't retype
    seenMsgIdsRef.current = new Set(messages.map(m => m.id))
    // Mark any isNew messages as done so they don't animate again
    messages.forEach(m => { if (m.isNew) markDone(m.id) })
    setIsOpen(true)
    setTimeout(() => setAnimateOpen(true), 10)
  }, [messages, markDone])

  const closeChat = useCallback(() => {
    setAnimateOpen(false)
    setTimeout(() => setIsOpen(false), 300)
  }, [])

  const handleContainerMouseLeave = useCallback(() => {
    hoverCloseTimerRef.current = setTimeout(() => closeChat(), 400)
  }, [closeChat])

  const handleContainerMouseEnter = useCallback(() => {
    clearTimeout(hoverCloseTimerRef.current)
  }, [])

  const handleButtonMouseEnter = useCallback(() => {
    clearTimeout(hoverCloseTimerRef.current)
    if (!isOpen) openChat()
  }, [isOpen, openChat])

  // Scroll to bottom when messages or loading changes
  useEffect(() => {
    const el = scrollRef.current
    if (!el || !isOpen) return
    requestAnimationFrame(() => { el.scrollTop = el.scrollHeight })
  }, [messages, isLoading, isOpen])

  // Attention pulse
  useEffect(() => {
    const startPulse = () => {
      if (isOpen) return
      let start: number | null = null
      const duration = 2000

      const raf = (ts: number) => {
        if (!start) start = ts
        const t = (ts - start) / duration
        const brightness = t < 0.5 ? t * 2 : (1 - t) * 2
        setButtonBrightness(brightness)
        if (t < 1) rafRef.current = requestAnimationFrame(raf)
        else setButtonBrightness(0)
      }
      rafRef.current = requestAnimationFrame(raf)
    }

    const t1 = setTimeout(startPulse, 27000)
    const t2 = setTimeout(startPulse, 207000)
    const t3 = setTimeout(startPulse, 507000)
    timersRef.current = [t1, t2, t3]

    return () => {
      timersRef.current.forEach(clearTimeout)
      cancelAnimationFrame(rafRef.current)
    }
  }, [isOpen])

  // Click outside
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) {
        closeChat()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, closeChat])

  // Context handler
  useEffect(() => {
    if (!context) return
    openChat()
    if (context.startsWith('__suggest__:')) {
      const suggestions = context.slice('__suggest__:'.length).split('|')
      setRecommendations(suggestions)
    } else if (VALID_CATEGORIES.includes(context)) {
      const recs = tr.chatRecommendations[context as keyof typeof tr.chatRecommendations]
      setRecommendations(recs || [])
    } else {
      pendingMsgRef.current = context
    }
    onContextUsed()
  }, [context]) // eslint-disable-line react-hooks/exhaustive-deps

  // Send pending message
  useEffect(() => {
    if (!pendingMsgRef.current || !isOpen) return
    const msg = pendingMsgRef.current
    pendingMsgRef.current = ''
    setTimeout(() => handleSendMessage(msg), 500)
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return
    setRecommendations([])
    setLimitWarning(false)
    setUserMsgCount(c => c + 1)

    addMessage({ role: 'user', content: text })
    setIsLoading(true)

    const history = messages.slice(-9).map(m => ({ role: m.role, content: m.content }))
    history.push({ role: 'user', content: text })

    try {
      const res = await fetch(CHATBOT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, language }),
      })
      const data = await res.json()
      let raw = data.response ?? data.message ?? data.output ?? data.text ?? 'I apologize, I could not process your request.'
      raw = raw.replace(/<[^>]*>/g, '').replace(/\*\*/g, '').replace(/#+\s/g, '').replace(/`/g, '').replace(/>/g, '')
      addMessage({ role: 'assistant', content: raw, isNew: true })
    } catch {
      addMessage({ role: 'assistant', content: 'Error connecting to service.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const maxLen = userMsgCount === 0 ? 3000 : 750
    const val = e.target.value.slice(0, maxLen)
    setLimitWarning(val.length > maxLen * 0.88)
    setInput(val)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px'
  }

  const submitInput = () => {
    if (input.trim() && !limitWarning && userMsgCount < 20) {
      handleSendMessage(input)
      setInput('')
      if (inputRef.current) inputRef.current.style.height = 'auto'
    }
  }

  return (
    <div ref={chatRef} className="fixed z-[100] flex flex-col items-end gap-3"
      style={{ bottom: '3.5rem', right: '1.5rem' }}
      onMouseEnter={handleContainerMouseEnter}
      onMouseLeave={handleContainerMouseLeave}
    >

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={animateOpen ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-80 md:w-96 rounded-2xl overflow-hidden"
            style={{ maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}
          >
            <GlassPanel strong className="rounded-2xl flex flex-col h-full" style={{
              maxHeight: '70vh',
              background: 'linear-gradient(160deg, rgba(22,14,50,0.90) 0%, rgba(10,6,24,0.97) 55%, rgba(5,3,14,0.99) 100%)',
              border: '1px solid rgba(255,255,255,0.14)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.62), 0 8px 24px rgba(0,0,0,0.38), inset 0 1.5px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.30)',
            }}>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.12]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400/80 animate-pulse" />
                  <span className="text-xs font-medium text-white/80">{tr.chatSub}</span>
                </div>
                <button data-cursor="hover" onClick={closeChat} className="text-white/45 hover:text-white/75 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-3 chat-scroll flex flex-col gap-3"
                style={{ minHeight: 0 }}
              >
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.isConfirmation ? (
                      <div className="max-w-[85%] rounded-xl px-3 py-2.5 text-xs leading-relaxed"
                        style={{
                          background: msg.content.startsWith('📬') ? 'rgba(251,191,36,0.10)' : 'rgba(52,211,153,0.10)',
                          border: msg.content.startsWith('📬') ? '1px solid rgba(251,191,36,0.28)' : '1px solid rgba(52,211,153,0.28)',
                        }}>
                        {(() => {
                          const sep = msg.content.indexOf('\n\n')
                          const title = sep >= 0 ? msg.content.slice(0, sep) : msg.content
                          const body = sep >= 0 ? msg.content.slice(sep + 2) : ''
                          return (
                            <>
                              <p className={`font-medium mb-1 text-[10px] tracking-wider ${msg.content.startsWith('📬') ? 'text-amber-400/90' : 'text-emerald-400/90'}`}>{title}</p>
                              {body && <p className="text-white/70 whitespace-pre-line">{body}</p>}
                            </>
                          )
                        })()}
                      </div>
                    ) : (
                      <div
                        className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed
                          ${msg.role === 'user' ? 'bg-white/14 text-white/90' : 'text-white/72'}`}
                      >
                        {msg.role === 'assistant' && msg.isNew && !seenMsgIdsRef.current.has(msg.id) ? (
                          <TypingMessage
                            text={msg.content}
                            scrollRef={scrollRef}
                            onComplete={() => markDone(msg.id)}
                          />
                        ) : (
                          msg.content
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%]">
                      <ThinkingProcess language={language} />
                    </div>
                  </div>
                )}
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="px-4 pb-2 flex flex-col gap-1.5">
                  <p className="text-white/38 text-[10px] tracking-wider">{tr.suggestions}</p>
                  {recommendations.map((rec, i) => (
                    <button
                      key={i}
                      data-cursor="hover"
                      onClick={() => {
                        setRecommendations([])
                        handleSendMessage(rec)
                      }}
                      className="text-left text-[11px] text-white/62 hover:text-white/90 px-3 py-2 rounded-lg
                                 border border-white/[0.12] hover:border-white/22 hover:bg-white/8 transition-all"
                    >
                      {rec}
                    </button>
                  ))}
                </div>
              )}

              {/* Limit warning */}
              {(limitWarning || userMsgCount >= 18) && (
                <p className="px-4 text-[10px] text-amber-400/70 pb-1">
                  {userMsgCount >= 20 ? 'Message limit reached' : limitWarning ? `Max ${userMsgCount === 0 ? 3000 : 750} characters` : `${20 - userMsgCount} messages left`}
                </p>
              )}

              {/* Input */}
              <div className="px-4 py-3 border-t border-white/[0.14] flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      submitInput()
                    }
                  }}
                  placeholder={tr.chatInputPlaceholder}
                  rows={1}
                  className="flex-1 bg-transparent text-white/82 text-xs placeholder-white/38 outline-none resize-none leading-relaxed"
                  style={{ maxHeight: 80 }}
                  data-cursor="hover"
                />
                <button
                  data-cursor="hover"
                  onClick={submitInput}
                  disabled={!input.trim() || limitWarning || isLoading || userMsgCount >= 20}
                  className="w-7 h-7 rounded-full bg-white/16 hover:bg-white/26 flex items-center justify-center
                             transition-colors disabled:opacity-30 shrink-0 mb-0.5"
                >
                  <Send className="w-3 h-3 text-white/82" />
                </button>
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button — liquid glass */}
      <motion.button
        data-cursor="hover"
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => isOpen ? closeChat() : openChat()}
        onMouseEnter={handleButtonMouseEnter}
        className="relative w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(148deg, rgba(255,255,255,${0.18 + buttonBrightness * 0.10}) 0%, rgba(168,130,255,${0.16 + buttonBrightness * 0.14}) 45%, rgba(110,80,230,${0.10 + buttonBrightness * 0.10}) 100%)`,
          border: `1px solid rgba(255,255,255,${0.28 + buttonBrightness * 0.14})`,
          boxShadow: `0 8px ${28 + buttonBrightness * 22}px rgba(139,92,246,${0.42 + buttonBrightness * 0.32}), 0 2px 10px rgba(0,0,0,0.38), inset 0 1.5px 0 rgba(255,255,255,${0.38 + buttonBrightness * 0.14}), inset 0 -1px 0 rgba(0,0,0,0.18)`,
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Inner top-reflection — liquid glass highlight */}
        <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)' }}
        />
        <MessageCircle className="w-5 h-5 text-white/92 relative z-10 drop-shadow-sm" />
      </motion.button>
    </div>
  )
}
