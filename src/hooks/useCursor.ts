import { useEffect, useRef, RefObject } from 'react'

// Spring constants — match VideoSection cursor feel
const STIFFNESS = 180
const DAMPING   = 22
const MASS      = 0.6

export function useCursor(
  cursorRef: RefObject<HTMLDivElement>,
  ringRef: RefObject<HTMLDivElement>,
  dotRef: RefObject<HTMLDivElement>,
  textRef: RefObject<HTMLSpanElement>
): void {
  const targetRef  = useRef({ x: -200, y: -200 })
  const currentRef = useRef({ x: -200, y: -200 })
  const velRef     = useRef({ x: 0, y: 0 })
  const lastTimeRef = useRef<number | null>(null)

  const hoverProgressRef = useRef(0)
  const targetHoverRef   = useRef(0)
  const wasHoveringRef   = useRef(false)
  const currentTextRef   = useRef('')
  const rafRef           = useRef<number>(0)

  useEffect(() => {
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }

      // Seed position on first move so the cursor doesn't fly in from (-200,-200)
      if (currentRef.current.x === -200) {
        currentRef.current = { x: e.clientX, y: e.clientY }
        velRef.current = { x: 0, y: 0 }
      }

      const el = (e.target as Element | null)?.closest('[data-cursor]') as HTMLElement | null
      if (el) {
        // Snap to real mouse position the moment the cursor becomes visible
        // so it never slides in from a lagged location
        if (!wasHoveringRef.current) {
          currentRef.current = { x: e.clientX, y: e.clientY }
          velRef.current = { x: 0, y: 0 }
          wasHoveringRef.current = true
        }
        targetHoverRef.current = 1
        const val = el.dataset.cursor || 'hover'
        const newText = val !== 'hover' ? val : ''
        if (newText !== currentTextRef.current) {
          currentTextRef.current = newText
          if (textRef.current) textRef.current.textContent = newText
        }
      } else {
        wasHoveringRef.current = false
        targetHoverRef.current = 0
        if (currentTextRef.current !== '') {
          currentTextRef.current = ''
          if (textRef.current) textRef.current.textContent = ''
        }
      }
    }

    const tick = (now: number) => {
      // ── Δt in seconds, capped so big pauses don't cause instability ──
      const dt = lastTimeRef.current === null
        ? 1 / 60
        : Math.min((now - lastTimeRef.current) / 1000, 1 / 20)
      lastTimeRef.current = now

      const cursor = cursorRef.current
      if (cursor) {
        // Spring physics: F = -k*(x-target) - d*v
        const ax = (-STIFFNESS * (currentRef.current.x - targetRef.current.x) - DAMPING * velRef.current.x) / MASS
        const ay = (-STIFFNESS * (currentRef.current.y - targetRef.current.y) - DAMPING * velRef.current.y) / MASS

        velRef.current.x += ax * dt
        velRef.current.y += ay * dt

        currentRef.current.x += velRef.current.x * dt
        currentRef.current.y += velRef.current.y * dt

        cursor.style.transform = `translate(${currentRef.current.x}px,${currentRef.current.y}px) translate(-50%,-50%)`
      }

      // ── Hover state: lerp is fine here ──
      const ring = ringRef.current
      const dot  = dotRef.current
      if (ring && dot) {
        const prev = hoverProgressRef.current
        const next = lerp(prev, targetHoverRef.current, 0.15)
        if (Math.abs(next - prev) > 0.0005) {
          hoverProgressRef.current = next

          if (cursorRef.current) cursorRef.current.style.opacity = String(next)

          ring.style.transform = `translate(-50%,-50%) scale(${0.6 + next * 0.4})`
          ring.style.opacity = String(next)

          dot.style.transform = `translate(-50%,-50%) scale(1)`
          dot.style.opacity = '1'

          if (textRef.current) {
            const t = currentTextRef.current
              ? Math.min(1, Math.max(0, (next - 0.6) / 0.4))
              : 0
            textRef.current.style.opacity = String(t)
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    document.addEventListener('mousemove', onMove)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [cursorRef, ringRef, dotRef, textRef])
}
