import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    THREE: unknown
  }
}

export function useVantaHalo(containerRef: React.RefObject<HTMLDivElement | null>) {
  const effectRef = useRef<{ destroy: () => void } | null>(null)

  useEffect(() => {
    const initEffect = () => {
      if (!containerRef.current) return
      try {
        const vanta = window as { VANTA?: { HALO?: (c: Record<string, unknown>) => { destroy: () => void } } }
        const result = vanta.VANTA?.HALO?.({
          el: containerRef.current,
          THREE: window.THREE,
          backgroundColor: 0x080810,
          baseColor: 0x1a0050,
          amplitudeFactor: 1.8,
          size: 2.5,
          mouseControls: false,
          touchControls: true,
          gyroControls: false,
          minHeight: 200,
          minWidth: 200,
        })
        if (result) effectRef.current = result
      } catch {
        // Vanta unavailable, silently continue
      }
    }

    const loadVantaScript = () => {
      if ((window as { VANTA?: { HALO?: unknown } }).VANTA?.HALO) { initEffect(); return }
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js'
      script.onload = initEffect
      document.head.appendChild(script)
    }

    if (window.THREE) {
      loadVantaScript()
    } else {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js'
      script.onload = loadVantaScript
      document.head.appendChild(script)
    }

    return () => {
      effectRef.current?.destroy()
      effectRef.current = null
    }
  }, [containerRef])
}
