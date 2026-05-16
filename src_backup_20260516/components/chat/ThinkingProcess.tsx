import { useEffect, useRef, useState } from 'react'
import { Database, Brain, Zap, Search, Cpu, Wand2, Terminal, Sparkles } from 'lucide-react'
import type { Language } from '../../utils/translations'
import { t } from '../../utils/translations'

const ICONS = [Database, Brain, Zap, Search, Cpu, Wand2, Terminal, Sparkles]

interface ThinkingProcessProps {
  language: Language
  isFirst?: boolean
}

export function ThinkingProcess({ language, isFirst }: ThinkingProcessProps) {
  const tr = t(language)
  const lines = tr.thinkingLines
  const [lineIdx, setLineIdx] = useState(() => isFirst ? 0 : Math.floor(Math.random() * lines.length))
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pause' | 'deleting'>('typing')
  const [iconIdx, setIconIdx] = useState(0)
  const cycleCountRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const Icon = ICONS[iconIdx % ICONS.length]

  useEffect(() => {
    const line = lines[lineIdx]

    const tick = () => {
      if (phase === 'typing') {
        setDisplayed(prev => {
          const next = line.slice(0, prev.length + 1)
          if (next.length >= line.length) {
            setPhase('pause')
          }
          return next
        })
        timerRef.current = setTimeout(tick, 48)
      } else if (phase === 'pause') {
        timerRef.current = setTimeout(() => setPhase('deleting'), 3200)
      } else {
        setDisplayed(prev => {
          const next = prev.slice(0, prev.length - 1)
          if (next.length === 0) {
            cycleCountRef.current++
            if (cycleCountRef.current % 5 === 0) {
              setIconIdx(i => i + 1)
            }
            // pick next line
            setTimeout(() => {
              setLineIdx(i => {
                let next = Math.floor(Math.random() * lines.length)
                while (next === i) next = Math.floor(Math.random() * lines.length)
                return next
              })
              setPhase('typing')
            }, 300)
          }
          return next
        })
        timerRef.current = setTimeout(tick, 28)
      }
    }

    timerRef.current = setTimeout(tick, 48)
    return () => clearTimeout(timerRef.current)
  }, [phase, lineIdx, lines])

  return (
    <div className="flex items-center gap-2 py-1">
      <Icon className="w-3 h-3 text-white/40 shrink-0" />
      <span className="inline-flex items-center min-h-[1em]">
        <span className="text-white/40 text-xs italic">{displayed}</span>
        <span className="inline-block w-0.5 h-3 bg-white/30 animate-pulse ml-[2px]" />
      </span>
    </div>
  )
}
