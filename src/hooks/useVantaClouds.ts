import { useEffect, useRef } from 'react'

interface VantaCloudsConfig {
  variant?: 'clouds' | 'clouds2'
  backgroundColor?: number
  skyColor?: number
  cloudColor?: number
  cloudShadowColor?: number
  lightColor?: number
  sunColor?: number
  sunGlareColor?: number
  sunlightColor?: number
  speed?: number
  texturePath?: string
}

type VantaEffect = { destroy: () => void }
type VantaWin = {
  THREE?: unknown
  VANTA?: Record<string, ((c: Record<string, unknown>) => VantaEffect) | unknown>
}

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

// Load a script once, safely handling the case where the tag exists but script is still running
function loadScript(src: string): Promise<void> {
  return new Promise(resolve => {
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      // Script tag exists — wait for it if still loading
      if ((existing as HTMLScriptElement).dataset.loaded) { resolve(); return }
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => resolve())
      return
    }
    const s = document.createElement('script')
    s.src = src
    s.onload = () => { s.dataset.loaded = '1'; resolve() }
    s.onerror = () => { s.dataset.loaded = '1'; resolve() }
    document.head.appendChild(s)
  })
}

// Wait for a Vanta effect to be available on window.VANTA, with retry
async function waitForVantaEffect(name: string, maxWaitMs = 2000): Promise<((c: Record<string, unknown>) => VantaEffect) | null> {
  const w = window as VantaWin
  const start = Date.now()
  while (Date.now() - start < maxWaitMs) {
    const effect = w.VANTA?.[name]
    if (typeof effect === 'function') return effect as (c: Record<string, unknown>) => VantaEffect
    await new Promise(r => setTimeout(r, 30))
  }
  return null
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

    const { variant = 'clouds2', ...restConfig } = config
    const effectName = variant === 'clouds' ? 'CLOUDS' : 'CLOUDS2'
    const scriptSrc = variant === 'clouds' ? '/vanta.clouds.min.js' : '/vanta.clouds2.min.js'

    const run = async () => {
      if (cancelled || effectRef.current) return

      const w = window as VantaWin

      // THREE — preloaded via HTML, but load dynamically as fallback
      if (!w.THREE) await loadScript('/three.r121.min.js')
      if (cancelled) return

      // Vanta effect script — preloaded via HTML, but load dynamically as fallback
      const alreadyAvailable = typeof w.VANTA?.[effectName] === 'function'
      if (!alreadyAvailable) await loadScript(scriptSrc)
      if (cancelled) return

      // Wait for window.VANTA[effectName] to be set (handles async script execution)
      const vantaFn = await waitForVantaEffect(effectName)
      if (cancelled || !vantaFn || !containerRef.current) return

      try {
        effectRef.current = vantaFn({ el: containerRef.current, ...BASE, ...restConfig })
      } catch { /* WebGL unavailable */ }
    }

    run()

    return () => {
      cancelled = true
      effectRef.current?.destroy()
      effectRef.current = null
    }
  }, [containerRef]) // eslint-disable-line react-hooks/exhaustive-deps
}
