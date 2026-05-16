import { useEffect, type RefObject } from 'react'

/**
 * Subtle parallax: background shifts opposite to mouse position,
 * creating a "looking around" perspective feel.
 * scale(1.10) ensures edges are never visible during translation.
 */
export function useWindEffect(
  containerRef: RefObject<HTMLElement | null>,
  vantaRef: RefObject<HTMLElement | null>,
  maxOffset = 22
) {
  useEffect(() => {
    const container = containerRef.current
    const canvas = vantaRef.current
    if (!container || !canvas) return

    canvas.style.willChange = 'transform'
    canvas.style.transform = 'scale(1.10)'

    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    let raf: number

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width - 0.5   // -0.5 … 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5
      target.x = -nx * maxOffset   // opposite direction
      target.y = -ny * maxOffset
    }

    const tick = () => {
      // Smooth lerp toward target — feels like eased acceleration
      current.x += (target.x - current.x) * 0.045
      current.y += (target.y - current.y) * 0.045
      canvas.style.transform = `translate(${current.x}px, ${current.y}px) scale(1.10)`
      raf = requestAnimationFrame(tick)
    }

    container.addEventListener('mousemove', onMouseMove, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      container.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(raf)
      canvas.style.transform = ''
      canvas.style.willChange = ''
    }
  }, [containerRef, vantaRef, maxOffset])
}
