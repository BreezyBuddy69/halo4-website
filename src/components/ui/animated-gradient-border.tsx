import React, { CSSProperties, ReactNode, HTMLAttributes } from 'react'

type AnimationMode = 'auto-rotate' | 'rotate-on-hover' | 'stop-rotate-on-hover'

interface BorderRotateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  children: ReactNode
  className?: string
  animationMode?: AnimationMode
  animationSpeed?: number
  gradientColors?: { primary: string; secondary: string; accent: string }
  backgroundColor?: string
  borderWidth?: number
  borderRadius?: number
  style?: CSSProperties
}

const BorderRotate: React.FC<BorderRotateProps> = ({
  children,
  className = '',
  animationMode = 'auto-rotate',
  animationSpeed = 3,
  gradientColors = { primary: '#7c2d00', secondary: '#ea580c', accent: '#fed7aa' },
  backgroundColor = 'transparent',
  borderWidth = 2,
  borderRadius = 9999,
  style = {},
  ...props
}) => {
  const modeClass = {
    'auto-rotate': 'gradient-border-auto',
    'rotate-on-hover': 'gradient-border-hover',
    'stop-rotate-on-hover': 'gradient-border-stop-hover',
  }[animationMode]

  const combinedStyle: CSSProperties = {
    '--gradient-primary': gradientColors.primary,
    '--gradient-secondary': gradientColors.secondary,
    '--gradient-accent': gradientColors.accent,
    '--bg-color': backgroundColor,
    '--border-width': `${borderWidth}px`,
    '--border-radius': `${borderRadius}px`,
    '--animation-duration': `${animationSpeed}s`,
    border: `${borderWidth}px solid transparent`,
    borderRadius: `${borderRadius}px`,
    backgroundImage: `
      linear-gradient(${backgroundColor}, ${backgroundColor}),
      conic-gradient(
        from var(--gradient-angle, 0deg),
        ${gradientColors.primary} 0%,
        ${gradientColors.secondary} 35%,
        ${gradientColors.accent} 50%,
        ${gradientColors.secondary} 65%,
        ${gradientColors.primary} 100%
      )
    `,
    backgroundClip: 'padding-box, border-box',
    backgroundOrigin: 'padding-box, border-box',
    ...style,
  } as CSSProperties

  return (
    <div className={`gradient-border-component ${modeClass} ${className}`} style={combinedStyle} {...props}>
      {children}
    </div>
  )
}

export { BorderRotate }
