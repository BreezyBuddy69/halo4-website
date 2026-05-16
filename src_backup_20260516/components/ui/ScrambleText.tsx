import { useState, useRef, useCallback } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'

interface ScrambleTextProps {
  text: string
  className?: string
  triggerOnMount?: boolean
  as?: keyof JSX.IntrinsicElements
}

export function ScrambleText({ text, className = '', triggerOnMount = false, as: Tag = 'span' }: ScrambleTextProps) {
  const [display, setDisplay] = useState(triggerOnMount ? '' : text)
  const isRunning = useRef(false)
  const frameRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const scramble = useCallback(() => {
    if (isRunning.current) return
    isRunning.current = true
    const chars = text.split('')
    let iteration = 0
    const total = chars.length * 3

    const tick = () => {
      const next = chars.map((char, i) => {
        if (char === ' ') return ' '
        if (i < iteration / 3) return chars[i]
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      }).join('')
      setDisplay(next)
      iteration++
      if (iteration <= total) {
        frameRef.current = setTimeout(tick, 28)
      } else {
        setDisplay(text)
        isRunning.current = false
      }
    }
    tick()
  }, [text])

  return (
    <Tag
      className={className}
      onMouseEnter={scramble}
      style={{ display: 'inline-block' }}
    >
      {display || text}
    </Tag>
  )
}
