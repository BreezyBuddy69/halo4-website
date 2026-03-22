import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface NeonButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function NeonButton({ children, onClick, className = '', size = 'md' }: NeonButtonProps) {
  const [hovered, setHovered] = useState(false)

  const sizeClass = {
    sm: 'px-5 py-2.5 text-xs',
    md: 'px-7 py-3.5 text-sm',
    lg: 'px-9 py-4 text-[15px]',
  }[size]

  return (
    <motion.button
      data-cursor="Book"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      className={`relative rounded-full font-medium text-white tracking-wide overflow-hidden flex items-center gap-2.5 ${sizeClass} ${className}`}
      style={{
        background: hovered
          ? 'linear-gradient(135deg, rgba(255,185,75,0.22) 0%, rgba(255,110,50,0.18) 100%)'
          : 'linear-gradient(135deg, rgba(255,175,65,0.14) 0%, rgba(255,100,45,0.10) 100%)',
        border: `1px solid ${hovered ? 'rgba(255,185,75,0.55)' : 'rgba(255,175,65,0.35)'}`,
        boxShadow: hovered
          ? '0 0 28px rgba(255,170,60,0.28), 0 0 72px rgba(255,120,40,0.14), inset 0 1px 0 rgba(255,210,110,0.22)'
          : '0 0 16px rgba(255,160,55,0.16), 0 0 44px rgba(255,110,40,0.08), inset 0 1px 0 rgba(255,200,100,0.14)',
        transition: 'background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Top shimmer line */}
      <span
        className="absolute top-0 left-6 right-6 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255,210,110,${hovered ? '0.55' : '0.30'}), transparent)`,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Sweep shimmer on hover */}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        initial={{ x: '-100%', opacity: 0 }}
        animate={hovered ? { x: '120%', opacity: 1 } : { x: '-100%', opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,220,130,0.18) 50%, transparent 100%)',
          skewX: '-12deg',
        }}
      />

      <span className="relative z-10">{children}</span>

      {/* Arrow icon */}
      <motion.span
        className="relative z-10 flex items-center"
        animate={{ x: hovered ? 3 : 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        style={{ willChange: 'transform' }}
      >
        <ArrowRight
          className="shrink-0"
          style={{
            width: size === 'sm' ? 13 : size === 'lg' ? 17 : 15,
            height: size === 'sm' ? 13 : size === 'lg' ? 17 : 15,
            opacity: hovered ? 0.9 : 0.55,
            transition: 'opacity 0.3s ease',
            color: 'rgba(255,210,110,1)',
          }}
        />
      </motion.span>
    </motion.button>
  )
}
