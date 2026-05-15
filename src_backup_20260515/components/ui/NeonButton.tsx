import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface NeonButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'violet'
}

export function NeonButton({ children, onClick, className = '', size = 'md', variant = 'default' }: NeonButtonProps) {
  const [hovered, setHovered] = useState(false)

  const sizeClass = {
    sm: 'px-5 py-2.5 text-xs',
    md: 'px-7 py-3.5 text-sm',
    lg: 'px-9 py-4 text-[15px]',
  }[size]

  const isViolet = variant === 'violet'

  const bgStyle = isViolet
    ? (hovered
        ? 'linear-gradient(135deg, #9F67FF 0%, #7C3AED 100%)'
        : 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)')
    : (hovered
        ? 'linear-gradient(135deg, rgba(14,7,38,0.88) 0%, rgba(10,5,28,0.82) 100%)'
        : 'linear-gradient(135deg, rgba(10,5,30,0.82) 0%, rgba(7,3,20,0.76) 100%)')

  const borderStyle = isViolet
    ? `1px solid ${hovered ? 'rgba(167,139,250,0.9)' : 'rgba(139,92,246,0.7)'}`
    : `1px solid ${hovered ? 'rgba(167,139,250,0.75)' : 'rgba(139,92,246,0.50)'}`

  const shadowStyle = isViolet
    ? (hovered
        ? 'inset 0 1px 0 rgba(196,181,253,0.38)'
        : 'inset 0 1px 0 rgba(196,181,253,0.28)')
    : (hovered
        ? '0 0 32px rgba(139,92,246,0.40), 0 0 80px rgba(109,40,217,0.20), inset 0 1px 0 rgba(196,181,253,0.28)'
        : '0 0 18px rgba(139,92,246,0.22), 0 0 50px rgba(109,40,217,0.10), inset 0 1px 0 rgba(167,139,250,0.18)')

  const shimmerColor = isViolet
    ? 'rgba(196,181,253,0.22)'
    : 'rgba(167,139,250,0.18)'

  const shimmerLineColor = isViolet
    ? `rgba(221,214,254,${hovered ? '0.45' : '0.22'})`
    : `rgba(196,181,253,${hovered ? '0.55' : '0.30'})`

  return (
    <motion.button

      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      className={`relative rounded-full font-medium text-white tracking-wide overflow-hidden flex items-center gap-2.5 ${sizeClass} ${className}`}
      style={{
        background: bgStyle,
        border: borderStyle,
        boxShadow: shadowStyle,
        transition: 'background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Top shimmer line */}
      <span
        className="absolute top-0 left-6 right-6 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerLineColor}, transparent)`,
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
          background: `linear-gradient(90deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
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
            opacity: hovered ? 0.95 : isViolet ? 0.85 : 0.55,
            transition: 'opacity 0.3s ease',
            color: isViolet ? 'rgba(221,214,254,1)' : 'rgba(196,181,253,1)',
          }}
        />
      </motion.span>
    </motion.button>
  )
}
