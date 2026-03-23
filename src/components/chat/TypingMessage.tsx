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
        result.push(<strong key={key++} style={{ color: 'rgba(255,255,255,0.96)', fontWeight: 600 }}>{line}</strong>)
      } else {
        result.push(line)
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

  // Keep ref in sync without restarting the animation
  useEffect(() => {
    isActiveRef.current = isActive
    // If we paused mid-type and just became active again, resume
    if (isActive && !doneRef.current && indexRef.current < cleanText.length) {
      const tick = () => {
        if (!isActiveRef.current) return  // paused — stop scheduling
        indexRef.current++
        setCharCount(indexRef.current)
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        if (indexRef.current < cleanText.length) {
          timerRef.current = setTimeout(tick, 9)
        } else {
          doneRef.current = true
          onComplete()
        }
      }
      timerRef.current = setTimeout(tick, 9)
    }
    return () => clearTimeout(timerRef.current)
  }, [isActive]) // eslint-disable-line react-hooks/exhaustive-deps

  // Start fresh when text changes
  useEffect(() => {
    indexRef.current = 0
    doneRef.current  = false
    setCharCount(0)

    const tick = () => {
      if (!isActiveRef.current) return  // paused — stop scheduling
      indexRef.current++
      setCharCount(indexRef.current)
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      if (indexRef.current < cleanText.length) {
        timerRef.current = setTimeout(tick, 9)
      } else {
        doneRef.current = true
        onComplete()
      }
    }

    timerRef.current = setTimeout(tick, 9)
    return () => clearTimeout(timerRef.current)
  }, [text]) // eslint-disable-line react-hooks/exhaustive-deps

  return <span>{renderPartial(segments, charCount)}</span>
}
