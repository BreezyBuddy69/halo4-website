import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircle } from 'lucide-react'
import { ThinkingProcess } from './ThinkingProcess'
import { TypingMessage } from './TypingMessage'
import { t } from '../../utils/translations'
import type { Language } from '../../utils/translations'
import { useChatContext } from '../../contexts/ChatContext'

function renderText(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'rgba(255,255,255,0.97)', fontWeight: 650 }}>{part.slice(2, -2)}</strong>
    }
    return part.split('\n').flatMap((line, j, arr) => j < arr.length - 1 ? [line, <br key={`${i}-${j}`} />] : [line])
  })
}

const CHATBOT_URL = import.meta.env.VITE_CHATBOT_URL as string
const VALID_CATEGORIES = ['general', 'lead-generation', 'custom-solutions', 'save-time', 'examples']
const CHAT_RATE_LIMIT_MS = 2_000
const ALLOWED_INPUT_RE = /[<>'"]/g

function sanitizeApiResponse(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/#+\s/g, '')
    .replace(/`/g, '')
    .trim()
}

let lastChatTime = 0

interface ChatBotProps {
  language: Language
  context: string
  onContextUsed: () => void
}

export function ChatBot({ language, context, onContextUsed }: ChatBotProps) {
  const tr = t(language)
  const { messages, isLoading, addMessage, markDone, setIsLoading } = useChatContext()

  const [isOpen, setIsOpen] = useState(false)
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
  }, [messages, markDone])

  const closeChat = useCallback(() => {
    setIsOpen(false)
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

    const now = Date.now()
    if (now - lastChatTime < CHAT_RATE_LIMIT_MS) return
    lastChatTime = now

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
      if (!res.ok) throw new Error('Non-OK response')
      const data = await res.json()
      const raw = data.response ?? data.message ?? data.output ?? data.text ?? 'I apologize, I could not process your request.'
      addMessage({ role: 'assistant', content: sanitizeApiResponse(String(raw)), isNew: true })
    } catch {
      addMessage({ role: 'assistant', content: 'Error connecting to service.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const maxLen = userMsgCount === 0 ? 3000 : 750
    const sanitized = e.target.value.replace(ALLOWED_INPUT_RE, '').slice(0, maxLen)
    const val = sanitized
    setLimitWarning(val.length > maxLen * 0.88)
    setInput(val)
    e.target.value = val
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

  // Morph: button expands into chat panel
  const CLOSED_W = 56
  const CLOSED_H = 56
  const OPEN_W = 384
  const OPEN_H = Math.min(Math.round(window.innerHeight * 0.60), 540)

  return (
    <div ref={chatRef} className="fixed z-[100] inset-0 pointer-events-none"
      onMouseEnter={handleContainerMouseEnter}
      onMouseLeave={handleContainerMouseLeave}
    >
      {/* Floating button — bottom-right, hidden when open */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={openChat}
            onMouseEnter={handleButtonMouseEnter}
            className="absolute bottom-6 right-6 pointer-events-auto flex items-center justify-center overflow-hidden"
            style={{
              width: CLOSED_W,
              height: CLOSED_H,
              borderRadius: 9999,
              background: `linear-gradient(148deg, rgba(255,255,255,${0.38 + buttonBrightness * 0.14}) 0%, rgba(220,200,255,${0.30 + buttonBrightness * 0.16}) 45%, rgba(180,150,255,${0.22 + buttonBrightness * 0.12}) 100%)`,
              border: `1px solid rgba(255,255,255,${0.52 + buttonBrightness * 0.18})`,
              boxShadow: `0 8px ${36 + buttonBrightness * 28}px rgba(180,140,255,${0.55 + buttonBrightness * 0.35}), 0 2px 14px rgba(0,0,0,0.28), inset 0 1.5px 0 rgba(255,255,255,${0.72 + buttonBrightness * 0.18}), inset 0 -1px 0 rgba(0,0,0,0.10)`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* glass highlight */}
            <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0.08))' }} />
            <MessageCircle className="w-5 h-5 text-white/92 drop-shadow-sm relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel — centered on screen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute pointer-events-auto overflow-hidden flex flex-col"
            style={{
              width: OPEN_W,
              height: OPEN_H,
              borderRadius: 20,
              right: 24,
              bottom: 80,
              background: 'linear-gradient(160deg, rgba(28,16,60,0.96) 0%, rgba(14,8,34,0.98) 55%, rgba(7,4,18,0.99) 100%)',
              border: '1px solid rgba(160,120,255,0.22)',
              boxShadow: '0 32px 72px rgba(0,0,0,0.72), 0 8px 28px rgba(0,0,0,0.42), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1.5px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.30)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
        <div className="flex flex-col h-full w-full">

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{
                borderBottom: '1px solid rgba(255,255,255,0.10)',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
              }}>
                <div className="flex items-center gap-2.5">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 relative z-10" />
                    <div className="absolute w-4 h-4 rounded-full bg-emerald-400/20 animate-ping" />
                  </div>
                  <span className="text-xs font-semibold text-white/90 tracking-wide">{tr.chatSub}</span>
                </div>
                <button onClick={closeChat}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Messages — flex-col with spacer so messages anchor to bottom, growing upward */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-3 chat-scroll flex flex-col gap-3"
                style={{ minHeight: 0 }}
              >
                <div className="flex-1" />
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.isConfirmation ? (
                      <div className="max-w-[85%] rounded-xl px-3 py-2.5 text-xs leading-relaxed"
                        style={{
                          background: msg.content.startsWith('📬') ? 'rgba(28,12,70,0.97)' : 'rgba(8,36,26,0.97)',
                          border: msg.content.startsWith('📬') ? '1px solid rgba(139,92,246,0.42)' : '1px solid rgba(52,211,153,0.40)',
                        }}>
                        {(() => {
                          const sep = msg.content.indexOf('\n\n')
                          const title = sep >= 0 ? msg.content.slice(0, sep) : msg.content
                          const body = sep >= 0 ? msg.content.slice(sep + 2) : ''
                          return (
                            <>
                              <p className={`font-medium mb-1 text-[10px] tracking-wider ${msg.content.startsWith('📬') ? 'text-violet-400/90' : 'text-emerald-400/90'}`}>{title}</p>
                              {body && <p className="text-white/70 whitespace-pre-line">{body}</p>}
                            </>
                          )
                        })()}
                      </div>
                    ) : (
                      <div
                        className="max-w-[85%] rounded-xl px-3 py-2.5 text-xs leading-relaxed"
                        style={msg.role === 'user' ? {
                          background: 'linear-gradient(135deg, rgba(95,45,215,0.92) 0%, rgba(70,22,185,0.96) 100%)',
                          border: '1px solid rgba(167,139,250,0.45)',
                          color: 'rgba(255,255,255,0.97)',
                        } : {
                          background: 'rgba(10, 6, 28, 1.0)',
                          border: '1px solid rgba(139,92,246,0.25)',
                          borderLeft: '2px solid rgba(139,92,246,0.60)',
                          color: 'rgba(255,255,255,0.92)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.55)',
                        }}
                      >
                        {msg.role === 'assistant' && msg.isNew && !seenMsgIdsRef.current.has(msg.id) ? (
                          <TypingMessage
                            text={msg.content}
                            scrollRef={scrollRef}
                            onComplete={() => markDone(msg.id)}
                          />
                        ) : (
                          renderText(msg.content)
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
                <div className="px-4 pb-2 flex flex-col gap-1.5 shrink-0">
                  <p className="text-white/38 text-[10px] tracking-wider">{tr.suggestions}</p>
                  {recommendations.map((rec, i) => (
                    <button
                      key={i}
                     
                      onClick={() => {
                        setRecommendations([])
                        handleSendMessage(rec)
                      }}
                      className="text-left text-[11px] text-white/70 hover:text-white/95 px-3 py-2 rounded-lg transition-all"
                      style={{
                        background: 'rgba(139,92,246,0.08)',
                        border: '1px solid rgba(139,92,246,0.25)',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.18)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.08)' }}
                    >
                      {rec}
                    </button>
                  ))}
                </div>
              )}

              {/* Limit warning */}
              {(limitWarning || userMsgCount >= 18) && (
                <p className="px-4 text-[10px] text-violet-400/70 pb-1 shrink-0">
                  {userMsgCount >= 20 ? 'Message limit reached' : limitWarning ? `Max ${userMsgCount === 0 ? 3000 : 750} characters` : `${20 - userMsgCount} messages left`}
                </p>
              )}

              {/* Input */}
              <div className="px-3 py-3 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
                <div className="flex items-end gap-2 rounded-xl px-3 py-2" style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}>
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
                    className="flex-1 bg-transparent text-white/90 text-xs placeholder-white/35 outline-none resize-none leading-relaxed"
                    style={{ maxHeight: 80 }}
                   
                  />
                  <button
                   
                    onClick={submitInput}
                    disabled={!input.trim() || limitWarning || isLoading || userMsgCount >= 20}
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5 transition-all disabled:opacity-25"
                    style={{
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.8) 0%, rgba(109,40,217,0.9) 100%)',
                      boxShadow: '0 2px 12px rgba(139,92,246,0.45)',
                    }}
                  >
                    <Send className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
