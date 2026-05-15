import { GrainGradient } from "@paper-design/shaders-react"
import { useEffect, useRef, useState } from "react"

interface GradientBackgroundProps {
  colors: string[]
}

// Smoothly interpolate between color palettes when section changes
export function GradientBackground({ colors }: GradientBackgroundProps) {
  const [displayColors, setDisplayColors] = useState(colors)
  const [prevColors, setPrevColors] = useState(colors)
  const [blendOpacity, setBlendOpacity] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)
  const DURATION = 700 // ms

  useEffect(() => {
    // Start a new blend from prevColors → colors
    setPrevColors(displayColors)
    setBlendOpacity(0)

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    startRef.current = null

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now
      const t = Math.min((now - startRef.current) / DURATION, 1)
      // ease-in-out cubic
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      setBlendOpacity(ease)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else {
        setDisplayColors(colors)
        setBlendOpacity(0)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [colors.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      {/* Previous colors underneath */}
      <GrainGradient
        style={{ height: "100%", width: "100%", position: "absolute", inset: 0 }}
        colorBack="hsl(0, 0%, 0%)"
        softness={0.76}
        intensity={0.45}
        noise={0}
        shape="corners"
        offsetX={0}
        offsetY={0}
        scale={1}
        rotation={0}
        speed={1}
        colors={prevColors}
      />
      {/* New colors fading in on top */}
      <div style={{ position: "absolute", inset: 0, opacity: blendOpacity }}>
        <GrainGradient
          style={{ height: "100%", width: "100%" }}
          colorBack="hsl(0, 0%, 0%)"
          softness={0.76}
          intensity={0.45}
          noise={0}
          shape="corners"
          offsetX={0}
          offsetY={0}
          scale={1}
          rotation={0}
          speed={1}
          colors={colors}
        />
      </div>
    </div>
  )
}
