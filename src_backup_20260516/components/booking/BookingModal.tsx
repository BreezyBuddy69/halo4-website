import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, Mail, ArrowLeft } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { Calendar } from './Calendar'
import { BookingForm, type FormData } from './BookingForm'
import { t } from '../../utils/translations'
import type { Language } from '../../utils/translations'

const BOOKING_URL = import.meta.env.VITE_BOOKING_URL as string
const RATE_LIMIT_MS = 60_000

function generateNonce(): string {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('')
}

let lastSubmitTime = 0

type Step = 'calendar' | 'form' | 'confirmation'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirmed?: () => void
  onOpenMailbox?: () => void
  onAIConfirmation?: (msg: string) => void
  language: Language
}

export function BookingModal({ isOpen, onClose, onConfirmed, onOpenMailbox, onAIConfirmation, language }: BookingModalProps) {
  const tr = t(language)
  const [visible, setVisible] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)
  const [step, setStep] = useState<Step>('calendar')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedTimezone, setSelectedTimezone] = useState('')
  const [formData, setFormData] = useState<FormData | null>(null)
  const [confirmEmail, setConfirmEmail] = useState('')
  const [isSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setVisible(true)
      setTimeout(() => setAnimateIn(true), 10)
    } else {
      setAnimateIn(false)
      setTimeout(() => { setVisible(false); resetModal() }, 500)
    }
  }, [isOpen])

  const resetModal = () => {
    setStep('calendar')
    setSelectedDate(null)
    setSelectedTime('')
    setSelectedTimezone('')
    setFormData(null)
    setConfirmEmail('')
    setIsSuccess(false)
  }

  const handleDateTimeSelect = (date: Date, time: string, timezone: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setSelectedTimezone(timezone)
    setStep('form')
  }

  const handleFormSubmit = (data: FormData) => {
    setFormData(data)
    setConfirmEmail(data.email)
    setStep('confirmation')
  }

  const handleConfirm = () => {
    if (!confirmEmail) { alert('Please provide your email.'); return }
    if (!formData || !selectedDate) return

    const now = Date.now()
    if (now - lastSubmitTime < RATE_LIMIT_MS) {
      alert('Please wait before submitting another booking.')
      return
    }
    lastSubmitTime = now

    const params = new URLSearchParams()
    Object.entries(formData).forEach(([k, v]) => params.append(k, v))
    params.set('email', confirmEmail)
    params.set('fullPhone', formData.countryCode + formData.phone)
    params.set('date', selectedDate.toISOString().split('T')[0])
    params.set('time', selectedTime)
    params.set('timezone', selectedTimezone)
    params.set('_nonce', generateNonce())

    // Show "Booking Sent" immediately — don't wait for webhook
    setIsSuccess(true)
    onConfirmed?.()

    // Fetch webhook in background — may take 30-60 seconds
    fetch(BOOKING_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
      .then(res => res.json().catch(() => null))
      .then(data => {
        let aiResponse = ''
        if (data) {
          // n8n webhooks often return an array — unwrap it
          const d = Array.isArray(data) ? data[0] : data
          aiResponse = d?.response ?? d?.message ?? d?.output ?? d?.text ?? d?.confirmation ?? ''
          if (aiResponse) aiResponse = aiResponse.replace(/<[^>]*>/g, '').replace(/javascript:/gi, '').replace(/\*\*/g, '').trim()
        }
        onAIConfirmation?.(aiResponse || tr.bookingConfirmationBody)
      })
      .catch(() => {
        onAIConfirmation?.(tr.bookingConfirmationBody)
      })
  }

  if (!visible) return null

  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const stepLabels = [tr.analysisStep, tr.auditStep, tr.nextSteps]
  const currentStepIdx = step === 'calendar' ? 0 : step === 'form' ? 1 : 2

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center md:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: animateIn ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 backdrop-blur-md"
        style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(30,10,80,0.55) 0%, rgba(0,0,0,0.75) 70%)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 24 }}
        animate={{ opacity: animateIn ? 1 : 0, scale: animateIn ? 1 : 0.97, y: animateIn ? 0 : 24 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full md:max-w-2xl flex flex-col"
        style={{ maxHeight: '92vh' }}
      >
        <div
          className="rounded-t-3xl md:rounded-2xl flex flex-col overflow-hidden"
          style={{
            maxHeight: 'inherit',
            background: 'rgba(10,7,18,0.82)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(48px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.05) inset, inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
        >
          {/* Ambient top glow */}
          <div className="absolute top-0 left-0 right-0 h-px rounded-full pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 5%, rgba(109,40,217,0.45) 40%, rgba(139,92,246,0.55) 55%, rgba(109,40,217,0.45) 70%, transparent 95%)' }}
          />

          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400/70 animate-pulse" />
                <span className="text-[10px] text-violet-400/60 tracking-[0.25em] uppercase font-medium">Halo AI</span>
              </div>
              <h2 className="text-base font-medium text-white">{tr.growthMappingCall}</h2>
              <p className="text-xs text-white/35 mt-0.5">{tr.duration} · {tr.growthMappingDesc}</p>
            </div>
            <button onClick={onClose} className="text-white/25 hover:text-white/55 transition-colors mt-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress — glowing segments */}
          <div className="px-6 py-3 flex items-center border-b border-white/[0.04]">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none last:flex-grow-0">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium transition-all duration-400 shrink-0"
                  title={label}
                  style={i < currentStepIdx
                    ? { background: 'rgba(109,40,217,0.25)', border: '1px solid rgba(139,92,246,0.55)', color: 'rgba(167,139,250,0.9)', boxShadow: '0 0 8px rgba(139,92,246,0.3)' }
                    : i === currentStepIdx
                    ? { background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.50)', color: 'rgba(255,255,255,0.85)' }
                    : { background: 'transparent', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.22)' }
                  }
                >
                  {i < currentStepIdx ? '✓' : i + 1}
                </div>
                {i < stepLabels.length - 1 && (
                  <div className="flex-1 mx-2 h-px transition-all duration-400"
                    style={{ background: i < currentStepIdx ? 'rgba(139,92,246,0.40)' : 'rgba(255,255,255,0.06)' }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto chat-scroll px-6 py-5">
            <AnimatePresence mode="wait">
              {step === 'calendar' && (
                <motion.div key="calendar" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <Calendar language={language} onSelect={handleDateTimeSelect} />
                </motion.div>
              )}

              {step === 'form' && (
                <motion.div key="form" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <BookingForm language={language} onSubmit={handleFormSubmit} onBack={() => setStep('calendar')} />
                </motion.div>
              )}

              {step === 'confirmation' && (
                <motion.div key="confirmation" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="flex flex-col gap-4">

                  {isSuccess ? (
                    <div className="flex flex-col items-center gap-6 py-10 text-center">
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 10, stiffness: 160 }}
                        className="relative"
                      >
                        <div className="w-20 h-20 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)' }}>
                          <CheckCircle className="w-10 h-10 text-emerald-400/80" />
                        </div>
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          initial={{ scale: 1, opacity: 0.6 }}
                          animate={{ scale: 1.6, opacity: 0 }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                          style={{ border: '1px solid rgba(52,211,153,0.3)' }}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col gap-2"
                      >
                        <p className="text-white/85 text-lg font-medium">{tr.bookingSent}</p>
                        <p className="text-white/40 text-sm leading-relaxed max-w-xs mx-auto">
                          A confirmation is on its way to<br />
                          <span className="text-white/60">{confirmEmail}</span>
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-3 w-full max-w-sm"
                      >
                        <button
                         
                          onClick={onClose}
                          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-white/12 text-white/50 text-xs
                                     hover:text-white/70 hover:border-white/22 transition-all"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          Stay on Website
                        </button>
                        <button
                         
                          onClick={onOpenMailbox}
                          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-white text-xs font-medium transition-all"
                          style={{
                            background: 'linear-gradient(135deg, rgba(109,40,217,0.22) 0%, rgba(76,29,149,0.16) 100%)',
                            border: '1px solid rgba(167,139,250,0.36)',
                            boxShadow: '0 0 16px rgba(109,40,217,0.14), inset 0 1px 0 rgba(196,181,253,0.12)',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(109,40,217,0.32) 0%, rgba(76,29,149,0.24) 100%)'
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(109,40,217,0.22) 0%, rgba(76,29,149,0.16) 100%)'
                          }}
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Open Inbox
                        </button>
                      </motion.div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs text-white/35 tracking-wider mb-3">{tr.nextSteps}</p>
                        {selectedDate && (
                          <GlassPanel className="rounded-xl p-4 flex flex-col gap-2">
                            <div className="flex justify-between">
                              <span className="text-xs text-white/40">Date</span>
                              <span className="text-xs text-white/70">
                                {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-white/40">Time</span>
                              <span className="text-xs text-white/70">{selectedTime} ({selectedTimezone})</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-white/40">Duration</span>
                              <span className="text-xs text-white/70">{tr.duration}</span>
                            </div>
                          </GlassPanel>
                        )}
                      </div>

                      <div>
                        <label className="text-[10px] text-white/35 tracking-wider block mb-1">Confirm Email *</label>
                        <input
                          type="email"
                          value={confirmEmail}
                          onChange={e => setConfirmEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/70 outline-none focus:border-white/30"
                         
                        />
                      </div>

                      <p className="text-[10px] text-white/25">{tr.agencyNote}</p>

                      <div className="flex gap-3">
                        <button onClick={() => setStep('form')}
                          className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/40 text-xs hover:text-white/60 transition-all">
                          {tr.back}
                        </button>
                        <button
                         
                          onClick={handleConfirm}
                          disabled={isSubmitting || !confirmEmail}
                          className="flex-1 py-2.5 rounded-xl text-white text-xs font-medium transition-all disabled:opacity-40"
                          style={{
                            background: 'linear-gradient(135deg, rgba(109,40,217,0.28) 0%, rgba(76,29,149,0.20) 100%)',
                            border: '1px solid rgba(167,139,250,0.42)',
                            boxShadow: '0 0 20px rgba(109,40,217,0.18), inset 0 1px 0 rgba(196,181,253,0.15)',
                          }}
                        >
                          {isSubmitting ? tr.submitting : tr.submit}
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
