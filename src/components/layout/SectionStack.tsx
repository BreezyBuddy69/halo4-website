import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useMediaQuery } from '../../hooks/useMediaQuery'

interface SectionStackProps {
  currentSection: number
  children: React.ReactNode[]
  onSectionChange?: (i: number) => void
}

function ScrollHint({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 pointer-events-none"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.75, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="text-white/65 text-[9px] tracking-[0.25em] uppercase">scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-4 h-4 text-white/55" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function SectionStack({ currentSection, children, onSectionChange }: SectionStackProps) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [showHint, setShowHint] = useState(false)
  const [prevSection, setPrevSection] = useState(currentSection)
  const [direction, setDirection] = useState(0) // 1=down, -1=up
  const isLastSection = currentSection === children.length - 1

  // Mobile: sync currentSection with native scroll via IntersectionObserver
  useEffect(() => {
    if (!isMobile || !onSectionChange) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.id.replace('section-', ''), 10)
            if (!isNaN(idx)) onSectionChange(idx)
          }
        })
      },
      { threshold: 0.6 }
    )
    const timer = setTimeout(() => {
      children.forEach((_, i) => {
        const el = document.getElementById(`section-${i}`)
        if (el) observer.observe(el)
      })
    }, 100)
    return () => { clearTimeout(timer); observer.disconnect() }
  }, [isMobile, children.length]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (currentSection !== prevSection) {
      setDirection(currentSection > prevSection ? 1 : -1)
      setPrevSection(currentSection)
    }
  }, [currentSection]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setShowHint(false)
    if (isLastSection) return
    const t = setTimeout(() => setShowHint(true), 3500)
    return () => clearTimeout(t)
  }, [currentSection, isLastSection])

  if (isMobile) {
    return (
      <div
        className="w-full overflow-y-scroll"
        style={{ height: '100dvh', scrollSnapType: 'y mandatory', overscrollBehavior: 'none' }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            id={`section-${i}`}
            className="w-full overflow-hidden"
            style={{ height: '100dvh', scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
          >
            {child}
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden">
        {children.map((child, i) => {
          const isCurrent = i === currentSection
          const isPrev = i === prevSection && i !== currentSection
          const isAnimating = isCurrent || isPrev

          // Pure positional slide — no opacity. Both sections stay fully visible
          // during the transition so there is never a black gap.
          const targetY = i < currentSection ? '-100%' : i > currentSection ? '100%' : '0%'

          return (
            <motion.div
              key={i}
              className="absolute inset-0"
              animate={{ y: targetY }}
              transition={isAnimating
                ? { duration: 0.48, ease: [0.76, 0, 0.24, 1] }
                : { duration: 0 }
              }
              style={{
                zIndex: isCurrent ? 10 : isPrev ? 9 : i,
                willChange: isAnimating ? 'transform' : 'auto',
              }}
            >
              {child}
            </motion.div>
          )
        })}
      </div>
      <ScrollHint show={showHint && !isMobile} />
      {/* Global page counter - positioned below chatbot button */}
      <div className="fixed z-50 text-white/25 text-[10px] font-mono tracking-widest hidden md:block"
        style={{ bottom: '1.5rem', right: '1.5rem' }}>
        {String(currentSection + 1).padStart(2, '0')} / {String(children.length).padStart(2, '0')}
      </div>
    </>
  )
}
