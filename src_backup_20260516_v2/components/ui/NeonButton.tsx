import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface NeonButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'violet' | 'orange'
}

export function NeonButton({ children, onClick, className = '', size = 'md', variant = 'default' }: NeonButtonProps) {
  const [hovered, setHovered] = useState(false)

  const sizeClass = {
    sm: 'px-5 py-2.5 text-xs',
    md: 'px-7 py-3.5 text-sm',
    lg: 'px-9 py-4 text-[15px]',
  }[size]

  const isViolet = variant === 'violet'
  const isOrange = variant === 'orange'

  // Orange uses gradient border trick — background is split across padding-box + border-box
  const orangeBg = `
    linear-gradient(135deg, ${hovered ? '#c2410c' : '#9a3412'} 0%, ${hovered ? '#ea580c' : '#c2410c'} 100%),
    conic-gradient(
      from var(--gradient-angle, 0deg),
      #7c2d00 0%,
      #ea580c 30%,
      #fde68a 50%,
      #ea580c 70%,
      #7c2d00 100%
    )
  `

  const bgStyle = isOrange
    ? orangeBg
    : isViolet
      ? (hovered
          ? 'linear-gradient(135deg, #9F67FF 0%, #7C3AED 100%)'
          : 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)')
      : (hovered
          ? 'linear-gradient(135deg, rgba(14,7,38,0.88) 0%, rgba(10,5,28,0.82) 100%)'
          : 'linear-gradient(135deg, rgba(10,5,30,0.82) 0%, rgba(7,3,20,0.76) 100%)')

  const borderStyle = isOrange
    ? '1.5px solid transparent'
    : isViolet
      ? `1px solid ${hovered ? 'rgba(167,139,250,0.9)' : 'rgba(139,92,246,0.7)'}`
      : `1px solid ${hovered ? 'rgba(167,139,250,0.75)' : 'rgba(139,92,246,0.50)'}`

  const shadowStyle = isOrange
    ? (hovered
        ? '0 0 28px rgba(234,88,12,0.60), 0 0 60px rgba(194,65,12,0.25), inset 0 1px 0 rgba(253,186,116,0.25)'
        : '0 0 16px rgba(234,88,12,0.38), 0 0 40px rgba(194,65,12,0.12), inset 0 1px 0 rgba(253,186,116,0.15)')
    : isViolet
      ? (hovered
          ? 'inset 0 1px 0 rgba(196,181,253,0.38)'
          : 'inset 0 1px 0 rgba(196,181,253,0.28)')
      : (hovered
          ? '0 0 32px rgba(139,92,246,0.40), 0 0 80px rgba(109,40,217,0.20), inset 0 1px 0 rgba(196,181,253,0.28)'
          : '0 0 18px rgba(139,92,246,0.22), 0 0 50px rgba(109,40,217,0.10), inset 0 1px 0 rgba(167,139,250,0.18)')

  const shimmerColor = isOrange
    ? 'rgba(253,186,116,0.20)'
    : isViolet
      ? 'rgba(196,181,253,0.22)'
      : 'rgba(167,139,250,0.18)'

  const shimmerLineColor = isOrange
    ? `rgba(254,215,170,${hovered ? '0.45' : '0.20'})`
    : isViolet
      ? `rgba(221,214,254,${hovered ? '0.45' : '0.22'})`
      : `rgba(196,181,253,${hovered ? '0.55' : '0.30'})`

  const orangeExtraStyle = isOrange ? {
    backgroundImage: bgStyle,
    backgroundClip: 'padding-box, border-box',
    backgroundOrigin: 'padding-box, border-box',
    animation: 'gradient-rotate 2.5s linear infinite',
  } : {}

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      className={`relative rounded-full font-medium text-white tracking-wide overflow-hidden flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${sizeClass} ${className}`}
      style={{
        ...(isOrange ? {} : { background: bgStyle }),
        border: borderStyle,
        boxShadow: shadowStyle,
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        ...orangeExtraStyle,
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
            opacity: hovered ? 0.95 : (isViolet || isOrange) ? 0.85 : 0.55,
            transition: 'opacity 0.3s ease',
            color: isOrange ? 'rgba(254,215,170,1)' : isViolet ? 'rgba(221,214,254,1)' : 'rgba(196,181,253,1)',
          }}
        />
      </motion.span>
    </motion.button>
  )
}
