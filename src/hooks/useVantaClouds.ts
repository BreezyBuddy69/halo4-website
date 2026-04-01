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
type VantaWindow = { THREE?: unknown; VANTA?: { CLOUDS2?: (c: Record<string, unknown>) => VantaEffect } }

export function useVantaClouds(
  containerRef: React.RefObject<HTMLDivElement | null>,
  config: VantaCloudsConfig = {},
  _isActive = true,
  enabled = true
) {
  const effectRef = useRef<VantaEffect | null>(null)

  useEffect(() => {
    if (!enabled) return

    const BASE_CONFIG = {
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
      ...config,
    }

    const initEffect = () => {
      if (!containerRef.current || effectRef.current) return
      const w = window as VantaWindow
      if (!w.VANTA?.CLOUDS2) return
      try {
        effectRef.current = w.VANTA.CLOUDS2({ el: containerRef.current, ...BASE_CONFIG })
      } catch { /* unavailable */ }
    }

    const w = window as VantaWindow

    if (w.VANTA?.CLOUDS2) {
      // Both scripts already loaded (preloaded via index.html)
      initEffect()
      return () => { effectRef.current?.destroy(); effectRef.current = null }
    }

    // Fallback: dynamic load if preload missed
    const loadVanta = () => {
      if ((window as VantaWindow).VANTA?.CLOUDS2) { initEffect(); return }
      const s = document.createElement('script')
      s.src = '/vanta.clouds2.min.js'
      s.onload = initEffect
      document.head.appendChild(s)
    }

    if (w.THREE) {
      loadVanta()
    } else {
      const s = document.createElement('script')
      s.src = '/three.r121.min.js'
      s.onload = loadVanta
      document.head.appendChild(s)
    }

    return () => { effectRef.current?.destroy(); effectRef.current = null }
  }, [containerRef]) // eslint-disable-line react-hooks/exhaustive-deps
  // Note: isActive intentionally ignored — effect stays alive to avoid shader recompile stutter on revisit
}
