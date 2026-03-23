import { useEffect, useRef, RefObject } from 'react'

const STIFFNESS = 220
const DAMPING   = 23
const MASS      = 0.48

export function useCursor(
  cursorRef: RefObject<HTMLDivElement>,
  ringRef: RefObject<HTMLDivElement>,
  dotRef: RefObject<HTMLDivElement>,
  textRef: RefObject<HTMLSpanElement>
): void {
  const targetRef   = useRef({ x: -200, y: -200 })
  const currentRef  = useRef({ x: -200, y: -200 })
  const velRef      = useRef({ x: 0, y: 0 })
  const lastTimeRef = useRef<number | null>(null)

  const hoverProgressRef = useRef(0)
  const pageProgressRef  = useRef(0)
  const targetHoverRef   = useRef(0)
  const targetPageRef    = useRef(0)
  const currentTextRef   = useRef('')
  const rafRef           = useRef<number>(0)

  useEffect(() => {
    // Skip on touch / stylus devices — no hover capability
    if (window.matchMedia('(hover: none)').matches) return

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
      targetPageRef.current = 1

      // Seed position on first move so the cursor doesn't fly in from (-200,-200)
      if (currentRef.current.x === -200) {
        currentRef.current = { x: e.clientX, y: e.clientY }
        velRef.current = { x: 0, y: 0 }
      }

      const el = (e.target as Element | null)?.closest('[data-cursor]') as HTMLElement | null
      if (el) {
        targetHoverRef.current = 1
        const val = el.dataset.cursor || 'hover'
        const newText = val !== 'hover' ? val : ''
        if (newText !== currentTextRef.current) {
          currentTextRef.current = newText
          if (textRef.current) textRef.current.textContent = newText
        }
      } else {
        targetHoverRef.current = 0
        if (currentTextRef.current !== '') {
          currentTextRef.current = ''
          if (textRef.current) textRef.current.textContent = ''
        }
      }
    }

    const onLeave  = () => { targetPageRef.current = 0 }
    const onEnter  = () => { targetPageRef.current = 1 }

    const tick = (now: number) => {
      const rawDt = lastTimeRef.current === null ? 1 / 60 : (now - lastTimeRef.current) / 1000
      const dt = Math.min(rawDt, 1 / 20)
      lastTimeRef.current = now

      const cursor = cursorRef.current
      if (cursor) {
        // If frame took >100ms (jank/cold start), snap directly to avoid rubber-band effect
        if (rawDt > 0.1) {
          currentRef.current = { x: targetRef.current.x, y: targetRef.current.y }
          velRef.current = { x: 0, y: 0 }
        } else {
        const ax = (-STIFFNESS * (currentRef.current.x - targetRef.current.x) - DAMPING * velRef.current.x) / MASS
        const ay = (-STIFFNESS * (currentRef.current.y - targetRef.current.y) - DAMPING * velRef.current.y) / MASS
        velRef.current.x += ax * dt
        velRef.current.y += ay * dt
        currentRef.current.x += velRef.current.x * dt
        currentRef.current.y += velRef.current.y * dt
        }
        cursor.style.transform = `translate(${currentRef.current.x}px,${currentRef.current.y}px) translate(-50%,-50%)`
      }

      const ring = ringRef.current
      const dot  = dotRef.current
      if (ring && dot && cursorRef.current) {
        // Page presence — fades in when mouse enters window
        const nextPage = lerp(pageProgressRef.current, targetPageRef.current, 0.10)
        pageProgressRef.current = nextPage

        // Hover progress — fades in on [data-cursor] elements
        const nextHover = lerp(hoverProgressRef.current, targetHoverRef.current, 0.15)
        hoverProgressRef.current = nextHover

        // Whole container: visible as soon as mouse is on the page
        cursorRef.current.style.opacity = String(nextPage)

        // Dot: always visible on page, shrinks when ring expands
        dot.style.opacity = String(nextPage)
        dot.style.transform = `translate(-50%,-50%) scale(${1 - nextHover * 0.40})`

        // Ring: only expands on [data-cursor]
        ring.style.transform = `translate(-50%,-50%) scale(${0.55 + nextHover * 0.45})`
        ring.style.opacity = String(nextHover)

        // Label text inside ring
        if (textRef.current) {
          const t = currentTextRef.current
            ? Math.min(1, Math.max(0, (nextHover - 0.6) / 0.4))
            : 0
          textRef.current.style.opacity = String(t)
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    // Delay RAF start until page is fully loaded to avoid competing
    // with Vanta/Three.js init which would cause 5fps jank on first load
    const startRaf = () => { rafRef.current = requestAnimationFrame(tick) }
    if (document.readyState === 'complete') {
      startRaf()
    } else {
      window.addEventListener('load', startRaf, { once: true })
    }

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(rafRef.current)
    }
  }, [cursorRef, ringRef, dotRef, textRef])
}
