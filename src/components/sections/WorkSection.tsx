import { useState, useEffect } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { SectionReveal } from '../ui/SectionReveal'
import { AnimatedBg } from '../ui/AnimatedBg'
import { DotPattern } from '../ui/dot-pattern-1'
import { t, getNodeContent } from '../../utils/translations'
import { SERVICE_NODES } from '../../utils/serviceData'
import type { FilterGroup } from '../../utils/serviceData'
import type { Language } from '../../utils/translations'

interface WorkSectionProps {
  language: Language
  isActive: boolean
  onAskAI: (ctx: string) => void
}

const COLORS = [
  { border: 'rgba(139,92,246,0.32)', accent: 'rgba(167,139,250,0.9)', bg: 'rgba(109,40,217,0.07)', glow: 'rgba(139,92,246,0.10)' },
  { border: 'rgba(120,140,255,0.32)', accent: 'rgba(150,165,255,0.9)', bg: 'rgba(100,120,255,0.07)', glow: 'rgba(110,130,255,0.10)' },
  { border: 'rgba(52,211,153,0.30)', accent: 'rgba(80,220,170,0.9)', bg: 'rgba(52,211,153,0.06)', glow: 'rgba(52,211,153,0.10)' },
  { border: 'rgba(190,110,255,0.30)', accent: 'rgba(210,140,255,0.9)', bg: 'rgba(170,90,255,0.06)', glow: 'rgba(180,100,255,0.10)' },
  { border: 'rgba(99,102,241,0.30)', accent: 'rgba(129,140,248,0.9)', bg: 'rgba(79,70,229,0.06)', glow: 'rgba(99,102,241,0.10)' },
]

const CATEGORIES: FilterGroup[] = ['agents', 'roi', 'faq']

type Phase = 'idle' | 'intro' | 'settled'

export function WorkSection({ language, isActive, onAskAI }: WorkSectionProps) {
  const tr = t(language)
  const [filter, setFilter] = useState<FilterGroup>('agents')
  const [activeIdx, setActiveIdx] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)
  const [phase, setPhase] = useState<Phase>('idle')
  const [typeChars, setTypeChars] = useState(0)

  const titleLen = tr.aiosTitle.length
  const titleDone = typeChars >= titleLen

  // Phase orchestration
  useEffect(() => {
    if (!isActive) {
      setPhase('idle')
      setTypeChars(0)
      return
    }
    // Always restart from intro when section becomes active
    setPhase('intro')
    setTypeChars(0)

    let i = 0
    const interval = setInterval(() => {
      i++
      setTypeChars(i)
      if (i >= titleLen) {
        clearInterval(interval)
        setTimeout(() => setPhase('settled'), 820)
      }
    }, 52)

    return () => clearInterval(interval)
  }, [isActive])

  const displayNodes = SERVICE_NODES.filter(n => n.filterGroup === filter)

  // Auto-advance within category, then cycle to next category
  useEffect(() => {
    if (!isActive || !autoPlay || phase !== 'settled') return
    const timer = setTimeout(() => {
      if (activeIdx < displayNodes.length - 1) {
        setActiveIdx(i => i + 1)
      } else {
        const catIdx = CATEGORIES.indexOf(filter)
        const nextCat = CATEGORIES[(catIdx + 1) % CATEGORIES.length]
        setFilter(nextCat)
        setActiveIdx(0)
      }
    }, 5100)
    return () => clearTimeout(timer)
  }, [activeIdx, filter, isActive, autoPlay, displayNodes.length, phase])

  const activeNode = displayNodes[activeIdx] ?? displayNodes[0]
  const { title: activeTitle, desc: activeDesc } = getNodeContent(activeNode.id, tr)
  const ActiveIcon = activeNode.icon
  const globalIdx = SERVICE_NODES.findIndex(n => n.id === activeNode.id)
  const activeColors = COLORS[Math.max(0, globalIdx) % COLORS.length]

  const prevCard = () => setActiveIdx(i => (i - 1 + displayNodes.length) % displayNodes.length)
  const nextCard = () => setActiveIdx(i => (i + 1) % displayNodes.length)

  const catLabels: Record<FilterGroup, string> = {
    agents: tr.filterAgents,
    faq: tr.filterFaq,
    roi: tr.filterRoi,
  }

  // Shared corner dots used in both phases
  const CornerDots = () => <>
    <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-purple-400 z-30" style={{ opacity: 0.85 }} />
    <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-purple-400 z-30" style={{ opacity: 0.85 }} />
    <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-purple-400 z-30" style={{ opacity: 0.85 }} />
    <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-purple-400 z-30" style={{ opacity: 0.85 }} />
  </>

  return (
    <SectionReveal isActive={isActive}>
      <div className="relative w-full h-full overflow-hidden m-bg-work">

        {/* Blue-purple midpoint radial */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 75% at 50% 50%, rgba(62,50,175,0.55) 0%, rgba(42,32,130,0.34) 28%, rgba(22,14,68,0.16) 56%, transparent 78%), radial-gradient(ellipse 45% 50% at 50% 50%, rgba(82,65,200,0.24) 0%, transparent 42%)',
        }} />

        <AnimatedBg variant="particles" isActive={isActive} />

        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 1.0 }}
          style={{
            background: `radial-gradient(ellipse 70% 60% at 68% 50%, ${activeColors.glow} 0%, transparent 65%)`,
          }}
        />

        {/* Edge fades */}
        <div className="absolute top-0 inset-x-0 h-20 pointer-events-none z-10 m-edge-fade"
          style={{ background: 'linear-gradient(to bottom, #0D0B1A, transparent)' }} />
        <div className="absolute bottom-0 inset-x-0 h-20 pointer-events-none z-10 m-edge-fade"
          style={{ background: 'linear-gradient(to top, #0D0B1A, transparent)' }} />

        {/* ── AIOS BOX: morphs from center-large → top-left-small via layoutId ── */}
        <LayoutGroup>
          <AnimatePresence mode="sync">
            {phase === 'intro' && (
              <motion.div
                key="intro-wrap"
                className="absolute inset-0 z-30 flex items-center justify-center"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  layoutId="aios-box"
                  className="relative"
                  style={{
                    width: 'min(540px, 80vw)',
                    border: '1px solid rgba(160,100,255,0.45)',
                  }}
                  transition={{ type: 'spring', damping: 28, stiffness: 220, mass: 0.7 }}
                >
                  <DotPattern width={5} height={5} className="fill-purple-400/20" />
                  <CornerDots />
                  <div className="relative z-20 p-8 md:p-10">
                    <p
                      className="text-white/90 font-medium mb-4 leading-snug"
                      style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)' }}
                    >
                      {tr.aiosTitle.slice(0, typeChars)}
                      {!titleDone && (
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.85, repeat: Infinity, ease: 'easeInOut' }}
                          style={{
                            display: 'inline-block',
                            width: 3,
                            height: '0.85em',
                            background: 'rgba(180,120,255,0.9)',
                            marginLeft: 4,
                            verticalAlign: 'middle',
                            borderRadius: 2,
                          }}
                        />
                      )}
                    </p>
                    <AnimatePresence>
                      {titleDone && (
                        <motion.p
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="text-white/52 leading-relaxed"
                          style={{ fontSize: 'clamp(0.8rem, 1.4vw, 1rem)' }}
                        >
                          {tr.aiosDesc}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Left panel — only when settled ── */}
          <AnimatePresence>
            {phase === 'settled' && (
              <motion.div
                key="settled-panel"
                className="absolute left-0 top-0 bottom-0 z-20 flex flex-col justify-center pl-6 md:pl-36 lg:pl-44 pr-8 w-full md:w-[55%]"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
              >
                {/* AIOS box — settled, small */}
                <motion.div
                  layoutId="aios-box"
                  className="mb-7 relative max-w-sm"
                  style={{ border: '1px solid rgba(160,100,255,0.45)' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 220, mass: 0.7 }}
                >
                  <DotPattern width={5} height={5} className="fill-purple-400/20" />
                  <CornerDots />
                  <div className="relative z-20 p-5">
                    <p className="text-sm font-medium text-white/90 leading-snug mb-2">{tr.aiosTitle}</p>
                    <p className="text-xs text-white/52 leading-relaxed">{tr.aiosDesc}</p>
                  </div>
                </motion.div>

                {/* Category filter tabs */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-2 mb-11"
                >
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setFilter(cat); setActiveIdx(0) }}
                      className={`px-4 py-1.5 rounded-full text-xs tracking-wide transition-all whitespace-nowrap ${
                        filter === cat
                          ? 'bg-white/12 border border-white/35 text-white'
                          : 'border border-white/[0.08] text-white/30 max-md:text-white/58 hover:text-white/55 hover:border-white/20'
                      }`}
                    >
                      {catLabels[cat]}
                    </button>
                  ))}
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-9"
                  style={{ minHeight: 'clamp(4rem, 9vw, 9rem)' }}
                >
                  <AnimatePresence mode="wait">
                    <motion.h2
                      key={activeTitle}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-serif text-white leading-[0.93] tracking-tight"
                      style={{ fontSize: 'clamp(2.6rem, 5.5vw, 5.2rem)' }}
                    >
                      {activeTitle}{/[.!?]$/.test(activeTitle) ? '' : '.'}
                    </motion.h2>
                  </AnimatePresence>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="mb-10"
                  style={{ minHeight: '7rem' }}
                >
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`${filter}-${activeNode.id}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="text-white/72 max-md:text-white/90 text-[1.05rem] leading-[1.7] max-w-lg"
                    >
                      {activeDesc}
                    </motion.p>
                  </AnimatePresence>
                </motion.div>

                {/* Explore button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.42, duration: 0.5 }}
                  onClick={() => onAskAI(`__suggest__:What can ${activeTitle} do for my business?|How does ${activeTitle} work in practice?|What's the ROI of implementing ${activeTitle}?`)}
                  className="text-xs tracking-wider text-left transition-colors w-fit mb-11"
                  style={{ color: activeColors.accent.replace('0.9', '0.45') }}
                  onMouseEnter={e => (e.currentTarget.style.color = activeColors.accent)}
                  onMouseLeave={e => (e.currentTarget.style.color = activeColors.accent.replace('0.9', '0.45'))}
                >
                  {tr.exploreAI} →
                </motion.button>

                {/* Controls */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2"
                >
                  <button
                    onClick={prevCard}
                    className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/45 hover:text-white/80 hover:border-white/35 transition-all"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex gap-1.5 mx-1">
                    {displayNodes.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIdx(i)}
                        className={`rounded-full transition-all duration-300 ${
                          i === activeIdx ? 'w-5 h-1 bg-white/70' : 'w-1 h-1 bg-white/25 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextCard}
                    className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/45 hover:text-white/80 hover:border-white/35 transition-all"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setAutoPlay(p => !p)}
                    className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ml-1 ${
                      autoPlay
                        ? 'border-white/12 text-white/35 hover:text-white/65 hover:border-white/28'
                        : 'border-white/30 text-white/65 bg-white/[0.05]'
                    }`}
                  >
                    {autoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>

        {/* 3D card cascade — right side, only when settled */}
        <AnimatePresence>
          {phase === 'settled' && (
            <motion.div
              key="cards"
              className="absolute right-0 top-0 bottom-0 hidden md:block"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: '62%',
                perspective: '1000px',
                perspectiveOrigin: '30% 50%',
              }}
            >
              <div className="relative w-full h-full">
                {displayNodes.map((node, i) => {
                  const offset = i - activeIdx
                  const absOffset = Math.abs(offset)
                  if (absOffset > 4) return null

                  const gIdx = SERVICE_NODES.findIndex(n => n.id === node.id)
                  const colors = COLORS[Math.max(0, gIdx) % COLORS.length]
                  const { title, desc } = getNodeContent(node.id, tr)
                  const NodeIcon = node.icon

                  return (
                    <motion.div
                      key={node.id}
                      onClick={() => setActiveIdx(i)}
                      style={{
                        position: 'absolute',
                        width: 280,
                        height: 330,
                        left: '50%',
                        top: '50%',
                        marginLeft: -140,
                        marginTop: -165,
                        cursor: 'pointer',
                        borderRadius: 10,
                      }}
                      animate={{
                        x: offset * 130,
                        y: offset * -50,
                        rotateY: -20 + offset * 2.5,
                        rotateX: 5,
                        scale: offset === 0 ? 1 : Math.max(0.52, 0.83 - absOffset * 0.1),
                        opacity: offset === 0 ? 1 : Math.max(0.14, 0.70 - absOffset * 0.18),
                        zIndex: 20 - absOffset,
                      }}
                      transition={{ type: 'spring', damping: 32, stiffness: 280, mass: 0.65 }}
                    >
                      <div
                        className="w-full h-full p-6 flex flex-col relative overflow-hidden"
                        style={{
                          borderRadius: offset === 0 ? 0 : 10,
                          background: offset === 0
                            ? `linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 60%, rgba(0,0,0,0.15) 100%)`
                            : 'rgba(255,255,255,0.03)',
                          border: offset === 0
                            ? '1px solid rgba(160,100,255,0.45)'
                            : `1px solid rgba(255,255,255,0.08)`,
                          backdropFilter: offset === 0 ? 'blur(24px)' : 'none',
                          boxShadow: offset === 0
                            ? `0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.20), 0 0 40px ${colors.glow}`
                            : `0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)`,
                        }}
                      >
                        {offset === 0 && <DotPattern width={5} height={5} className="fill-purple-400/15" />}
                        {offset === 0 && <>
                          <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-purple-400 z-30" style={{ opacity: 0.85 }} />
                          <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-purple-400 z-30" style={{ opacity: 0.85 }} />
                          <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-purple-400 z-30" style={{ opacity: 0.85 }} />
                          <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-purple-400 z-30" style={{ opacity: 0.85 }} />
                        </>}
                        <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                          style={{ background: offset === 0
                            ? `linear-gradient(90deg, transparent 8%, ${colors.accent.replace('0.9', '0.28')} 40%, rgba(255,255,255,0.18) 55%, ${colors.accent.replace('0.9', '0.18')} 70%, transparent 92%)`
                            : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)'
                          }}
                        />

                        <div className="flex items-start justify-between mb-5">
                          <div className="w-9 h-9 flex items-center justify-center shrink-0"
                            style={{
                              borderRadius: 6,
                              background: colors.bg,
                              border: `1px solid ${colors.border}`,
                            }}>
                            <NodeIcon className="w-4.5 h-4.5" style={{ color: colors.accent }} />
                          </div>
                          <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.22)' }}>{String(i + 1).padStart(2, '0')}</span>
                        </div>

                        <h3 className="text-white/92 text-sm font-medium leading-snug mb-3 tracking-wide">{title}</h3>
                        <p className="text-white/52 text-[11px] leading-relaxed line-clamp-5">{desc}</p>

                        <div className="mt-auto pt-3">
                          <div className="h-px" style={{
                            width: '50%',
                            background: `linear-gradient(90deg, ${colors.border}, transparent)`,
                          }} />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </SectionReveal>
  )
}
