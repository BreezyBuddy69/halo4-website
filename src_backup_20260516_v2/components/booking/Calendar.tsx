import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { TIMEZONES, DEFAULT_TIMEZONE, getAvailableTimesInUTC1, convertTimeToTimezone } from '../../utils/timezones'
import type { Language } from '../../utils/translations'
import { t } from '../../utils/translations'
import { motion } from 'framer-motion'

interface CalendarProps {
  language: Language
  onSelect: (date: Date, time: string, timezone: string) => void
}

export function Calendar({ language, onSelect }: CalendarProps) {
  const tr = t(language)
  const today = new Date(); today.setHours(0, 0, 0, 0)

  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedTimeIdx, setSelectedTimeIdx] = useState(0)
  const [timezone, setTimezone] = useState(() => {
    try {
      const offset = -new Date().getTimezoneOffset() / 60
      const tzStr = offset === 0 ? 'UTC' : offset > 0 ? `UTC+${offset}` : `UTC${offset}`
      return TIMEZONES.find(tz => tz.value === tzStr)?.value || DEFAULT_TIMEZONE
    } catch {
      return DEFAULT_TIMEZONE
    }
  })
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const railRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!selectedDate) return
    const times = getAvailableTimesInUTC1(selectedDate)
      .map(time => convertTimeToTimezone(time, 'UTC+1', timezone))
      .sort()
    setAvailableTimes(times)
    setSelectedTimeIdx(0)
    setSelectedTime(times[0] || '')
  }, [selectedDate, timezone])

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDay }, (_, i) => i)

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const isAvailable = (day: number) => {
    const d = new Date(year, month, day)
    return d >= today
  }

  const getIdxFromClientX = useCallback((clientX: number) => {
    const rail = railRef.current
    if (!rail || availableTimes.length === 0) return 0
    const rect = rail.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return Math.round(ratio * (availableTimes.length - 1))
  }, [availableTimes])

  const handleRailPointerDown = (e: React.PointerEvent) => {
    if (availableTimes.length === 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsDragging(true)
    const idx = getIdxFromClientX(e.clientX)
    setSelectedTimeIdx(idx)
    setSelectedTime(availableTimes[idx])
  }

  const handleRailPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || availableTimes.length === 0) return
    const idx = getIdxFromClientX(e.clientX)
    setSelectedTimeIdx(idx)
    setSelectedTime(availableTimes[idx])
  }

  const handleRailPointerUp = () => {
    setIsDragging(false)
  }

  // Compute block position as percentage
  const totalSlots = availableTimes.length
  // Block visual width: at least 12%, at most 30%, based on 1/totalSlots ratio
  const blockWidthPct = totalSlots > 1 ? Math.max(10, Math.min(30, (1 / totalSlots) * 100 * 3)) : 100
  const trackPct = 100 - blockWidthPct
  const blockLeftPct = totalSlots > 1 ? (selectedTimeIdx / (totalSlots - 1)) * trackPct : 0

  // Compute hour ticks
  const hourTicks = availableTimes
    .map((t, i) => ({ time: t, idx: i }))
    .filter(({ time }) => time.endsWith(':00'))

  const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  return (
    <div className="flex flex-col gap-5">
      {/* Timezone */}
      <div>
        <label className="text-xs text-white/40 tracking-wider block mb-2">{tr.analysisStep}</label>
        <select
          value={timezone}
          onChange={e => setTimezone(e.target.value)}
         
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/70 outline-none
                     focus:border-white/30 transition-colors custom-select"
        >
          {TIMEZONES.map(tz => (
            <option key={tz.value} value={tz.value} style={{ background: '#0e0e1a' }}>{tz.label}</option>
          ))}
        </select>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-white/70">{MONTH_NAMES[month]} {year}</span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1">
        {DAY_LABELS.map(d => (
          <div key={d} className="text-center text-[10px] text-white/25 font-medium py-1">{d}</div>
        ))}
        {blanks.map(b => <div key={`b${b}`} />)}
        {days.map(day => {
          const d = new Date(year, month, day)
          const available = isAvailable(day)
          const isSelected = selectedDate?.toDateString() === d.toDateString()

          return (
            <button
              key={day}
              data-cursor={available ? 'hover' : undefined}
              disabled={!available}
              onClick={() => available && setSelectedDate(new Date(year, month, day))}
              className={`h-8 w-full rounded-lg text-xs font-medium transition-all duration-150
                ${isSelected ? 'bg-violet-500/20 text-white border border-violet-400/50' :
                  available ? 'text-white/60 hover:bg-white/8 hover:text-white/80' :
                  'text-white/15 cursor-not-allowed'}`}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Time Rail */}
      {selectedDate && availableTimes.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-white/40 tracking-wider">
              {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getDate()}
            </label>
            <span className="text-sm font-medium text-white/80 tabular-nums">{selectedTime}</span>
          </div>

          {/* Rail container */}
          <div
            ref={railRef}
            className="relative h-14 rounded-2xl select-none touch-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onPointerDown={handleRailPointerDown}
            onPointerMove={handleRailPointerMove}
            onPointerUp={handleRailPointerUp}
            onPointerCancel={handleRailPointerUp}
           
          >
            {/* Hour tick marks */}
            {hourTicks.map(({ time, idx }) => {
              const tickPct = totalSlots > 1 ? (idx / (totalSlots - 1)) * 100 : 0
              return (
                <div
                  key={time}
                  className="absolute top-1 bottom-1 flex flex-col items-center pointer-events-none"
                  style={{ left: `${tickPct}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="w-px flex-1 opacity-20" style={{ background: 'rgba(255,255,255,0.4)' }} />
                </div>
              )
            })}

            {/* Start / End time labels */}
            <span className="absolute left-2 bottom-1 text-[9px] text-white/25 font-mono pointer-events-none">
              {availableTimes[0]}
            </span>
            <span className="absolute right-2 bottom-1 text-[9px] text-white/25 font-mono pointer-events-none">
              {availableTimes[availableTimes.length - 1]}
            </span>

            {/* Sliding block */}
            <motion.div
              className="absolute top-1.5 bottom-1.5 rounded-xl flex items-center justify-center pointer-events-none"
              style={{
                left: `${blockLeftPct}%`,
                width: `${blockWidthPct}%`,
                background: 'rgba(139,92,246,0.22)',
                border: '1px solid rgba(167,139,250,0.55)',
                boxShadow: '0 0 20px rgba(139,92,246,0.18), inset 0 1px 0 rgba(196,181,253,0.20)',
              }}
              layout
              transition={{ type: 'spring', damping: 28, stiffness: 500, mass: 0.4 }}
            >
              <span className="text-white text-xs font-medium tabular-nums tracking-wide drop-shadow">
                {selectedTime}
              </span>
            </motion.div>
          </div>
        </div>
      )}

      {/* Continue */}
      {selectedDate && selectedTime && (
        <button
         
          onClick={() => onSelect(selectedDate, selectedTime, timezone)}
          className="w-full py-3 rounded-xl text-white text-sm font-medium transition-all duration-200"
          style={{ background: 'rgba(139,92,246,0.18)', border: '1px solid rgba(167,139,250,0.45)' }}
        >
          Continue →
        </button>
      )}
    </div>
  )
}
