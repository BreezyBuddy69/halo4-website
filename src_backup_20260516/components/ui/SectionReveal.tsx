import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionRevealProps {
  children: ReactNode
  isActive: boolean
  className?: string
}

export function SectionReveal({ children, isActive, className = '' }: SectionRevealProps) {
  return (
    <motion.div
      className={`w-full h-full ${className}`}
      initial={{ scaleX: 0.93 }}
      animate={{
        scaleX: isActive ? 1 : 0.93,
      }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: 'center center' }}
    >
      {children}
    </motion.div>
  )
}
