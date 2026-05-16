import { useRef, useCallback, useEffect, type RefObject } from 'react'

interface MouseGlowOptions {
  radius?: number
  color?: string
  opacity?: number
}

export function useMouseGlow(
  containerRef: RefObject<HTMLElement | null>,
  options: MouseGlowOptions = {}
) {
  const { radius = 300, color = '255,255,255', opacity = 0.08 } = options
  const glowRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect || !glowRef.current) return
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      glowRef.current.style.background =
        `radial-gradient(circle ${radius}px at ${x}px ${y}px, rgba(${color},${opacity}) 0%, rgba(${color},${opacity * 0.25}) 40%, transparent 70%)`
    })
  }, [containerRef, radius, color, opacity])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [containerRef, handleMouseMove])

  return glowRef
}
