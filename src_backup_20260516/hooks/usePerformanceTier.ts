import { useState } from 'react'

export type PerformanceTier = 'full' | 'reduced' | 'minimal'

/**
 * Detects device capability from browser APIs.
 *
 * full    — desktop with hover + enough cores: WebGL Vanta, custom cursor
 * reduced — touch/phone or prefers-reduced-motion: static gradient, no mouse effects
 * minimal — very low-power (≤2 cores or ≤1 GB RAM): same + no cursor RAF
 *
 * deviceMemory is Chrome-only. On Firefox/Safari it is undefined — we only
 * use it as a signal when the browser actually reports it, so we don't
 * accidentally downgrade capable laptops on other browsers.
 */
function detectTier(): PerformanceTier {
  const isTouch           = window.matchMedia('(hover: none)').matches
  const prefersLessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const cores             = navigator.hardwareConcurrency ?? 4
  const memory            = (navigator as unknown as { deviceMemory?: number }).deviceMemory // undefined if not Chrome

  // Definitively very low-power
  if (cores <= 2 || (memory !== undefined && memory <= 1)) return 'minimal'

  // Touch devices and accessibility preference always get reduced
  if (isTouch || prefersLessMotion) return 'reduced'

  // Only use RAM as a reduced-tier signal when Chrome actually reports it
  if (memory !== undefined && memory <= 2) return 'reduced'

  return 'full'
}

/** Returns the performance tier for this device — computed once on mount. */
export function usePerformanceTier(): PerformanceTier {
  const [tier] = useState<PerformanceTier>(detectTier)
  return tier
}
