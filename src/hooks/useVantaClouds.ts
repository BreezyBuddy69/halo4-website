import { useEffect, useRef } from 'react'

interface VantaCloudsConfig {
  backgroundColor?: number
  skyColor?: number
  cloudColor?: number
  lightColor?: number
  speed?: number
  texturePath?: string
}

export function useVantaClouds(
  containerRef: React.RefObject<HTMLDivElement | null>,
  config: VantaCloudsConfig = {},
  isActive = true
) {
  const effectRef = useRef<{ destroy: () => void } | null>(null)
  const scriptsReadyRef = useRef(false)

  // Load Three.js + Vanta scripts once, then set scriptsReadyRef
  useEffect(() => {
    const initEffect = () => {
      if (!containerRef.current) return
      const vanta = window as { VANTA?: { CLOUDS2?: (c: Record<string, unknown>) => { destroy: () => void } } }
      if (!vanta.VANTA?.CLOUDS2) return
      try {
        effectRef.current?.destroy()
        effectRef.current = vanta.VANTA.CLOUDS2({
          el: containerRef.current,
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
        })
        scriptsReadyRef.current = true
      } catch { /* unavailable */ }
    }

    const loadClouds = () => {
      const vanta = window as { VANTA?: { CLOUDS2?: unknown } }
      if (vanta.VANTA?.CLOUDS2) { initEffect(); return }
      const s = document.createElement('script')
      s.src = '/vanta.clouds2.min.js'
      s.onload = initEffect
      document.head.appendChild(s)
    }

    if ((window as { THREE?: unknown }).THREE) {
      loadClouds()
    } else {
      const s = document.createElement('script')
      s.src = '/three.r121.min.js'
      s.onload = loadClouds
      document.head.appendChild(s)
    }

    return () => {
      effectRef.current?.destroy()
      effectRef.current = null
    }
  }, [containerRef]) // eslint-disable-line react-hooks/exhaustive-deps

  // Destroy effect when section goes inactive, recreate when it comes back
  useEffect(() => {
    if (isActive) {
      if (!effectRef.current && scriptsReadyRef.current) {
        const vanta = window as { VANTA?: { CLOUDS2?: (c: Record<string, unknown>) => { destroy: () => void } } }
        if (!containerRef.current || !vanta.VANTA?.CLOUDS2) return
        try {
          effectRef.current = vanta.VANTA.CLOUDS2({
            el: containerRef.current,
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
          })
        } catch { /* unavailable */ }
      }
    } else {
      effectRef.current?.destroy()
      effectRef.current = null
    }
  }, [isActive]) // eslint-disable-line react-hooks/exhaustive-deps
}
