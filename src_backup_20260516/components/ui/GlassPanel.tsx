import { forwardRef } from 'react'

interface GlassPanelProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
  strong?: boolean
  onClick?: () => void
  style?: React.CSSProperties
  'data-cursor'?: string
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ children, className = '', glow = false, strong = false, onClick, style, 'data-cursor': dataCursor }, ref) => {
    const base = strong
      ? 'backdrop-blur-[40px] bg-[rgba(10,8,20,0.75)] border border-white/[0.12]'
      : 'backdrop-blur-xl bg-white/[0.05] border border-white/[0.10] hover:bg-white/[0.08] hover:border-white/20'

    const shadow = glow
      ? 'shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_40px_rgba(0,0,0,0.4),0_0_60px_rgba(139,92,246,0.15)]'
      : 'shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_40px_rgba(0,0,0,0.4)]'

    return (
      <div
        ref={ref}
        className={`transition-all duration-300 ${base} ${shadow} ${className}`}
        onClick={onClick}
        style={style}
        data-cursor={dataCursor}
      >
        {children}
      </div>
    )
  }
)

GlassPanel.displayName = 'GlassPanel'
