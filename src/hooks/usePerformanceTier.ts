import { useState } from 'react'

export type PerformanceTier = 'full' | 'reduced' | 'minimal'

/**
 * Detects device capability from browser APIs.
 *
 * full    — high-end desktop: WebGL Vanta, custom cursor, mouse effects
 * reduced — mobile/touch or mid-range PC: static gradient bg, no mouse effects
 * minimal — very low-power device: same as reduced + no cursor RAF loop
 *
 * Signals used (all synchronous, safe in SSR-free React):
 *   (hover: none)           → touch/phone, always at least reduced
 *   prefers-reduced-motion  → OS accessibility preference
 *   hardwareConcurrency     → logical CPU cores
 *   deviceMemory            → GB of RAM (Chrome only, falls back to 4)
 */
function detectTier(): PerformanceTier {
  const isTouch             = window.matchMedia('(hover: none)').matches
  const prefersLessMotion   = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const cores               = navigator.hardwareConcurrency ?? 4
  const memory              = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4

  if (cores <= 2 || memory <= 1) return 'minimal'
  if (isTouch || prefersLessMotion || cores <= 4 || memory <= 4) return 'reduced'
  return 'full'
}

/** Returns the performance tier for this device — computed once on mount. */
export function usePerformanceTier(): PerformanceTier {
  const [tier] = useState<PerformanceTier>(detectTier)
  return tier
}
