import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface NeonButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'orange'
}

export function NeonButton({ children, onClick, className = '', size = 'md', variant = 'default' }: NeonButtonProps) {
  const [hovered, setHovered] = useState(false)

  const sizeClass = {
    sm: 'px-5 py-2.5 text-xs',
    md: 'px-7 py-3.5 text-sm',
    lg: 'px-9 py-4 text-[15px]',
  }[size]

  const isOrange = variant === 'orange'

  const bgStyle = isOrange
    ? (hovered
        ? 'linear-gradient(135deg, #FF6B20 0%, #E84500 100%)'
        : 'linear-gradient(135deg, #FF5500 0%, #D83A00 100%)')
    : (hovered
        ? 'linear-gradient(135deg, rgba(14,7,38,0.88) 0%, rgba(10,5,28,0.82) 100%)'
        : 'linear-gradient(135deg, rgba(10,5,30,0.82) 0%, rgba(7,3,20,0.76) 100%)')

  const borderStyle = isOrange
    ? `1px solid ${hovered ? 'rgba(255,160,100,0.9)' : 'rgba(255,130,70,0.7)'}`
    : `1px solid ${hovered ? 'rgba(255,195,90,0.75)' : 'rgba(255,180,75,0.50)'}`

  const shadowStyle = isOrange
    ? (hovered
        ? '0 0 40px rgba(255,100,30,0.65), 0 0 100px rgba(255,70,20,0.32), inset 0 1px 0 rgba(255,210,170,0.38)'
        : '0 0 24px rgba(255,100,30,0.42), 0 0 70px rgba(255,70,20,0.22), inset 0 1px 0 rgba(255,200,155,0.28)')
    : (hovered
        ? '0 0 32px rgba(255,170,60,0.40), 0 0 80px rgba(255,120,40,0.20), inset 0 1px 0 rgba(255,220,120,0.28)'
        : '0 0 18px rgba(255,160,55,0.22), 0 0 50px rgba(255,110,40,0.10), inset 0 1px 0 rgba(255,205,100,0.18)')

  const shimmerColor = isOrange
    ? 'rgba(255,240,220,0.22)'
    : 'rgba(255,220,130,0.18)'

  const shimmerLineColor = isOrange
    ? `rgba(255,230,200,${hovered ? '0.45' : '0.22'})`
    : `rgba(255,210,110,${hovered ? '0.55' : '0.30'})`

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
            opacity: hovered ? 0.95 : isOrange ? 0.85 : 0.55,
            transition: 'opacity 0.3s ease',
            color: isOrange ? 'rgba(255,235,210,1)' : 'rgba(255,210,110,1)',
          }}
        />
      </motion.span>
    </motion.button>
  )
}
