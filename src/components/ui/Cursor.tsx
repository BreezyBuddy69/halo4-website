import { useRef } from 'react'
import { useCursor } from '../../hooks/useCursor'

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  useCursor(cursorRef, ringRef, dotRef, textRef)

  return (
    <div
      ref={cursorRef}
      className="cursor-root hidden md:block"
      aria-hidden="true"
    >
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
      <span ref={textRef} className="cursor-text" />
    </div>
  )
}
