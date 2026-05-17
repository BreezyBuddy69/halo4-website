import { useState, useRef, useCallback, useEffect, useMemo } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'

type CharPhase = 'scramble' | 'flash' | 'locked' | 'dissolve' | 'reappear'

interface ScrambleTextProps {
  text: string
  className?: string
  triggerOnMount?: boolean
  as?: keyof JSX.IntrinsicElements
}

export function ScrambleText({
  text,
  className = '',
  triggerOnMount = false,
  as: Tag = 'span',
}: ScrambleTextProps) {
  const letters = useMemo(() => text.split(''), [text])

  const [displayChars, setDisplayChars] = useState<string[]>(() => [...letters])
  const [charPhases, setCharPhases] = useState<CharPhase[]>(() =>
    new Array(letters.length).fill('scramble')
  )

  const isRunning = useRef(false)
  const frameRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const flashTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())
  const dissolveRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const reappearRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const doneRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  // per-char random dissolve offsets
  const dd = useRef<Array<{ dx: number; dy: number; delay: number }>>([])

  const clearAll = () => {
    clearTimeout(frameRef.current)
    clearTimeout(dissolveRef.current)
    clearTimeout(reappearRef.current)
    clearTimeout(doneRef.current)
    flashTimers.current.forEach(clearTimeout)
    flashTimers.current.clear()
  }

  const triggerDissolve = useCallback(() => {
    dd.current = letters.map(() => ({
      dx: (Math.random() - 0.5) * 22,
      dy: -(Math.random() * 16 + 6),
      delay: Math.random() * 80,
    }))
    setCharPhases(new Array(letters.length).fill('dissolve'))

    // Wait for dissolve to finish (80ms max delay + 320ms transition + buffer)
    reappearRef.current = setTimeout(() => {
      setDisplayChars([...letters])
      setCharPhases(new Array(letters.length).fill('reappear'))

      // After reappear fade-in completes, unlock
      doneRef.current = setTimeout(() => {
        isRunning.current = false
      }, 400)
    }, 500)
  }, [letters])

  const runAnimation = useCallback(() => {
    if (isRunning.current) return
    isRunning.current = true

    clearAll()
    setCharPhases(new Array(letters.length).fill('scramble'))
    setDisplayChars([...letters])

    let iteration = 0
    const total = letters.length * 3
    const lockedSet = new Set<number>()

    const tick = () => {
      const nextDisplay = [...letters]
      const newlyLocked: number[] = []

      letters.forEach((char, i) => {
        if (char === ' ') { nextDisplay[i] = ' '; return }
        if (lockedSet.has(i)) { nextDisplay[i] = char; return }
        if (i < iteration / 3) {
          lockedSet.add(i)
          newlyLocked.push(i)
          nextDisplay[i] = char
        } else {
          nextDisplay[i] = CHARS[Math.floor(Math.random() * CHARS.length)]
        }
      })

      setDisplayChars([...nextDisplay])

      if (newlyLocked.length > 0) {
        setCharPhases(prev => {
          const next = [...prev]
          newlyLocked.forEach(i => { next[i] = 'flash' })
          return next
        })
        newlyLocked.forEach(i => {
          const t = setTimeout(() => {
            setCharPhases(prev => {
              const next = [...prev]
              next[i] = 'locked'
              return next
            })
            flashTimers.current.delete(i)
          }, 16)
          flashTimers.current.set(i, t)
        })
      }

      iteration++

      if (iteration <= total) {
        frameRef.current = setTimeout(tick, 24)
      } else {
        // Force all locked, then dissolve after brief pause
        flashTimers.current.forEach(clearTimeout)
        flashTimers.current.clear()
        setDisplayChars([...letters])
        setCharPhases(new Array(letters.length).fill('locked'))
        dissolveRef.current = setTimeout(triggerDissolve, 800)
      }
    }

    tick()
  }, [letters, triggerDissolve])

  useEffect(() => {
    if (triggerOnMount) runAnimation()
    return clearAll
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const getStyle = (phase: CharPhase, i: number): React.CSSProperties => {
    const d = dd.current[i]
    switch (phase) {
      case 'scramble':
        return { display: 'inline-block', fontFamily: 'inherit', opacity: 1, transform: 'none', transition: 'none' }
      case 'flash':
        return { display: 'inline-block', fontFamily: 'Georgia, "Times New Roman", serif', opacity: 0, transform: 'none', transition: 'opacity 0s' }
      case 'locked':
        return { display: 'inline-block', fontFamily: 'Georgia, "Times New Roman", serif', opacity: 1, transform: 'none', transition: 'opacity 0.18s ease' }
      case 'dissolve':
        return {
          display: 'inline-block',
          fontFamily: 'Georgia, "Times New Roman", serif',
          opacity: 0,
          transform: d ? `translate(${d.dx}px, ${d.dy}px) scale(0.82)` : 'none',
          transition: d
            ? `opacity 0.32s ease ${d.delay}ms, transform 0.34s ease ${d.delay}ms`
            : 'opacity 0.32s ease, transform 0.34s ease',
        }
      case 'reappear':
        // fades in from opacity 0 (left-over from dissolve), staggered l→r
        return {
          display: 'inline-block',
          fontFamily: 'inherit',
          opacity: 1,
          transform: 'none',
          transition: `opacity 0.22s ease ${i * 14}ms`,
        }
    }
  }

  return (
    <Tag
      className={className}
      onMouseEnter={runAnimation}
      style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
    >
      {letters.map((char, i) =>
        char === ' ' ? (
          <span key={i}>{' '}</span>
        ) : (
          <span key={i} style={getStyle(charPhases[i], i)}>
            {displayChars[i]}
          </span>
        )
      )}
    </Tag>
  )
}
