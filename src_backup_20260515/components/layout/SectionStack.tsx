import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useMediaQuery } from '../../hooks/useMediaQuery'

// Sections >= this index use scroll-style transitions instead of crossfade
const SCROLL_TRANSITION_FROM = 2

interface SectionStackProps {
  currentSection: number
  children: React.ReactNode[]
  onSectionChange?: (i: number) => void
}

function ScrollHint({ show, onClick }: { show: boolean; onClick?: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          className="group fixed bottom-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-[5px] cursor-pointer select-none outline-none bg-transparent border-none p-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.55, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          whileHover={{
            opacity: 1,
            scale: 1.15,
            y: -3,
            transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
          }}
          whileTap={{ scale: 0.92, transition: { duration: 0.1 } }}
          onClick={onClick}
        >
          <span
            className="text-white text-[10px] tracking-[0.3em] uppercase transition-all duration-200 group-hover:tracking-[0.45em] group-hover:font-semibold"
          >
            scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-white transition-all duration-200 group-hover:w-6 group-hover:h-6" strokeWidth={1.5} />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export function SectionStack({ currentSection, children, onSectionChange }: SectionStackProps) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [showHint, setShowHint] = useState(false)
  const [prevSection, setPrevSection] = useState(currentSection)
  const directionRef = useRef<1 | -1>(1) // 1 = forward/down, -1 = backward/up
  const isLastSection = currentSection === children.length - 1

  const isScrollSection = (i: number) => i >= SCROLL_TRANSITION_FROM
  const useScrollTransition = isScrollSection(currentSection) && isScrollSection(prevSection)

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
      directionRef.current = currentSection > prevSection ? 1 : -1
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

  const dir = directionRef.current

  // Scroll-style variants for sections 2–5
  // Exit: fade only (no Y) — avoids gap at bottom showing dark base
  // Enter: slide up from below — gives clear downward-scroll feel
  const scrollVariants = {
    enter: (d: number) => ({ opacity: 0, y: d * 52 }),
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 0 },
  }

  const scrollTransition = {
    duration: 0.55,
    ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
    opacity: { duration: 0.4, ease: 'easeInOut' as const },
  }

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden">
        {/* Hero & Video: persistent with opacity crossfade */}
        {children.slice(0, SCROLL_TRANSITION_FROM).map((child, i) => {
          const isCurrent = i === currentSection
          const isPrev = i === prevSection && i !== currentSection
          return (
            <motion.div
              key={i}
              className="absolute inset-0"
              animate={{ opacity: isCurrent ? 1 : 0 }}
              transition={{ duration: 0.55, ease: 'easeInOut' }}
              style={{
                zIndex: isCurrent ? 10 : isPrev ? 9 : i,
                willChange: 'opacity',
                pointerEvents: isCurrent ? 'auto' : 'none',
              }}
            >
              {child}
            </motion.div>
          )
        })}

        {/* Results → Book: scroll-style transition via AnimatePresence */}
        {isScrollSection(currentSection) ? (
          <AnimatePresence custom={dir} mode="sync">
            <motion.div
              key={currentSection}
              className="absolute inset-0"
              custom={dir}
              variants={scrollVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={scrollTransition}
              style={{ zIndex: 10, willChange: 'transform, opacity' }}
            >
              {children[currentSection]}
            </motion.div>
          </AnimatePresence>
        ) : (
          /* Fade out the last scroll section when navigating back to Hero/Video */
          (() => {
            const lastScrollVisible = isScrollSection(prevSection) && !isScrollSection(currentSection)
            return lastScrollVisible ? (
              <motion.div
                key={`scroll-out-${prevSection}`}
                className="absolute inset-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: 'easeInOut' }}
                style={{ zIndex: 9, willChange: 'opacity', pointerEvents: 'none' }}
              >
                {children[prevSection]}
              </motion.div>
            ) : null
          })()
        )}
      </div>
      <ScrollHint
        show={showHint && !isMobile}
        onClick={() => onSectionChange && onSectionChange(Math.min(currentSection + 1, children.length - 1))}
      />
      {/* Global page counter - positioned below chatbot button */}
      <div className="fixed z-50 text-white/25 text-[10px] font-mono tracking-widest hidden md:block"
        style={{ bottom: '1.5rem', right: '1.5rem' }}>
        {String(currentSection + 1).padStart(2, '0')} / {String(children.length).padStart(2, '0')}
      </div>
    </>
  )
}
