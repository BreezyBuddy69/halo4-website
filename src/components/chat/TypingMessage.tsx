import { useEffect, useRef, useState } from 'react'

interface TypingMessageProps {
  text: string
  scrollRef: React.RefObject<HTMLDivElement | null>
  onComplete: () => void
  isActive?: boolean
}

interface Segment {
  text: string
  bold: boolean
}

function parseSegments(raw: string): Segment[] {
  const segs: Segment[] = []
  let rem = raw
  while (rem.length > 0) {
    const start = rem.indexOf('**')
    if (start === -1) { segs.push({ text: rem, bold: false }); break }
    if (start > 0) segs.push({ text: rem.slice(0, start), bold: false })
    rem = rem.slice(start + 2)
    const end = rem.indexOf('**')
    if (end === -1) { segs.push({ text: rem, bold: true }); break }
    segs.push({ text: rem.slice(0, end), bold: true })
    rem = rem.slice(end + 2)
  }
  return segs
}

function getCleanText(segs: Segment[]) {
  return segs.map(s => s.text).join('')
}

function renderPartial(segs: Segment[], charCount: number): React.ReactNode[] {
  const result: React.ReactNode[] = []
  let remaining = charCount
  let key = 0
  for (const seg of segs) {
    if (remaining <= 0) break
    const slice = seg.text.slice(0, remaining)
    remaining -= slice.length
    const lines = slice.split('\n')
    lines.forEach((line, i) => {
      if (i > 0) result.push(<br key={`br${key++}`} />)
      if (!line) return
      if (seg.bold) {
        result.push(
          <strong key={key++} style={{ color: 'rgba(255,255,255,0.97)', fontWeight: 650 }}>
            {line}
          </strong>
        )
      } else {
        result.push(<span key={key++}>{line}</span>)
      }
    })
  }
  return result
}

export function TypingMessage({ text, scrollRef, onComplete, isActive = true }: TypingMessageProps) {
  const segments  = parseSegments(text)
  const cleanText = getCleanText(segments)

  const [charCount, setCharCount] = useState(0)
  const indexRef    = useRef(0)
  const timerRef    = useRef<ReturnType<typeof setTimeout>>(undefined)
  const isActiveRef = useRef(isActive)
  const doneRef     = useRef(false)

  function nextDelay(char: string, index: number): number {
    if (char === '\n') return 90 + Math.random() * 60
    if (char === '.') return 160 + Math.random() * 120
    if (char === ',') return 90 + Math.random() * 70
    if (char === ' ') return Math.random() < 0.18 ? 120 + Math.random() * 180 : 40 + Math.random() * 55
    // Occasional hesitation — slightly more frequent near the start
    const hesitateChance = index < 20 ? 0.10 : 0.05
    const base = 38 + Math.random() * 42
    return Math.random() < hesitateChance ? base + 160 + Math.random() * 200 : base
  }

  // Keep ref in sync without restarting the animation
  useEffect(() => {
    isActiveRef.current = isActive
    // If we paused mid-type and just became active again, resume
    if (isActive && !doneRef.current && indexRef.current < cleanText.length) {
      const tick = () => {
        if (!isActiveRef.current) return
        const char = cleanText[indexRef.current] ?? ''
        indexRef.current++
        setCharCount(indexRef.current)
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        if (indexRef.current < cleanText.length) {
          timerRef.current = setTimeout(tick, nextDelay(char, indexRef.current))
        } else {
          doneRef.current = true
          onComplete()
        }
      }
      timerRef.current = setTimeout(tick, 42)
    }
    return () => clearTimeout(timerRef.current)
  }, [isActive]) // eslint-disable-line react-hooks/exhaustive-deps

  // Start fresh when text changes
  useEffect(() => {
    indexRef.current = 0
    doneRef.current  = false
    setCharCount(0)

    const tick = () => {
      if (!isActiveRef.current) return
      const char = cleanText[indexRef.current] ?? ''
      indexRef.current++
      setCharCount(indexRef.current)
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      if (indexRef.current < cleanText.length) {
        timerRef.current = setTimeout(tick, nextDelay(char, indexRef.current))
      } else {
        doneRef.current = true
        onComplete()
      }
    }

    timerRef.current = setTimeout(tick, 42)
    return () => clearTimeout(timerRef.current)
  }, [text]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span>
      {renderPartial(segments, charCount)}
    </span>
  )
}
