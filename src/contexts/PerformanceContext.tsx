import { createContext, useContext } from 'react'
import type { PerformanceTier } from '../hooks/usePerformanceTier'

const PerformanceContext = createContext<PerformanceTier>('full')

export function PerformanceProvider({
  children,
  tier,
}: {
  children: React.ReactNode
  tier: PerformanceTier
}) {
  return (
    <PerformanceContext.Provider value={tier}>
      {children}
    </PerformanceContext.Provider>
  )
}

/** Returns the detected performance tier for this device. */
export function usePerformance(): PerformanceTier {
  return useContext(PerformanceContext)
}
