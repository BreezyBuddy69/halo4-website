import { useEffect, useRef, useCallback } from 'react'

interface Options {
  totalSections: number
  currentSection: number
  onNavigate: (index: number) => void
  isMobile: boolean
  debounceMs?: number
  wheelThreshold?: number
}

export function useSectionScroll({
  totalSections,
  currentSection,
  onNavigate,
  isMobile,
  debounceMs = 900,
  wheelThreshold = 25,
}: Options) {
  const accRef = useRef(0)
  const isTransitioningRef = useRef(false)
  const touchStartRef = useRef(0)
  const currentRef = useRef(currentSection)

  useEffect(() => {
    currentRef.current = currentSection
  }, [currentSection])

  const navigate = useCallback((dir: 1 | -1) => {
    if (isTransitioningRef.current) return
    const next = currentRef.current + dir
    if (next < 0 || next >= totalSections) return
    isTransitioningRef.current = true
    accRef.current = 0
    onNavigate(next)
    setTimeout(() => {
      isTransitioningRef.current = false
    }, debounceMs)
  }, [totalSections, onNavigate, debounceMs])

  useEffect(() => {
    if (isMobile) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      accRef.current += e.deltaY
      if (accRef.current > wheelThreshold) navigate(1)
      else if (accRef.current < -wheelThreshold) navigate(-1)
    }

    const onTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY
    }

    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStartRef.current - e.changedTouches[0].clientY
      if (delta > 60) navigate(1)
      else if (delta < -60) navigate(-1)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') navigate(1)
      if (e.key === 'ArrowUp' || e.key === 'PageUp') navigate(-1)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isMobile, navigate, wheelThreshold])
}
