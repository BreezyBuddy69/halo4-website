import { useEffect, useRef } from 'react'

interface VantaCloudsConfig {
  backgroundColor?: number
  skyColor?: number
  cloudColor?: number
  lightColor?: number
  speed?: number
  texturePath?: string
}

type VantaEffect = { destroy: () => void }
type VantaWin = { THREE?: unknown; VANTA?: { CLOUDS2?: (c: Record<string, unknown>) => VantaEffect } }

const BASE = {
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200,
  minWidth: 200,
  scale: 1.0,
  backgroundColor: 0x0,
  skyColor: 0x5ca6ca,
  cloudColor: 0x334d80,
  lightColor: 0xffffff,
  speed: 1,
  texturePath: '/gallery/noise.png',
}

// Load a script once (idempotent)
function loadScript(src: string): Promise<void> {
  return new Promise(resolve => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = () => resolve() // resolve anyway so chain continues
    document.head.appendChild(s)
  })
}

export function useVantaClouds(
  containerRef: React.RefObject<HTMLDivElement | null>,
  config: VantaCloudsConfig = {},
  _isActive = true,
  enabled = true
) {
  const effectRef = useRef<VantaEffect | null>(null)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    // Load scripts and init immediately — the intro animation runs for ~2.5s,
    // giving Three.js plenty of time to compile shaders before the overlay lifts.
    const run = async () => {
      if (cancelled || effectRef.current) return

      const w = window as VantaWin

      if (!w.THREE) await loadScript('/three.r121.min.js')
      if (cancelled) return

      if (!w.VANTA?.CLOUDS2) await loadScript('/vanta.clouds2.min.js')
      if (cancelled) return

      if (!containerRef.current) return
      const clouds2 = (window as VantaWin).VANTA?.CLOUDS2
      if (!clouds2) return

      try {
        effectRef.current = clouds2({ el: containerRef.current, ...BASE, ...config })
      } catch { /* WebGL unavailable */ }
    }

    run()

    return () => {
      cancelled = true
      effectRef.current?.destroy()
      effectRef.current = null
    }
  }, [containerRef]) // eslint-disable-line react-hooks/exhaustive-deps
  // isActive intentionally unused — effect stays alive to avoid shader-recompile stutter on revisit
}
