'use client'

import { useState, useEffect } from 'react'

const STAGES = [
  { label: 'Extracting CV text...', duration: 2000 },
  { label: 'Fetching job description...', duration: 4000 },
  { label: 'Rewriting with AI...', duration: 16000 },
  { label: 'Generating ATS-optimized document...', duration: Infinity },
]

/**
 * Displays a multi-stage progress indicator while the CV rewrite is in progress.
 * Stages advance on a timed schedule to give the user feedback during the long API call.
 */
export default function LoadingProgress() {
  const [stageIndex, setStageIndex] = useState(0)

  useEffect(() => {
    setStageIndex(0)

    let current = 0
    const advance = () => {
      current += 1
      if (current < STAGES.length - 1) {
        setStageIndex(current)
        setTimeout(advance, STAGES[current].duration)
      } else {
        setStageIndex(STAGES.length - 1)
      }
    }

    const id = setTimeout(advance, STAGES[0].duration)
    return () => clearTimeout(id)
  }, [])

  const stage = STAGES[stageIndex]

  return (
    <div className="mt-6 glass-card p-10 flex flex-col items-center gap-5 animate-scale-in">
      {/* CSS ring spinner */}
      <div className="w-10 h-10 rounded-full border-[3px] border-brand-200 border-t-brand-500 animate-spin" />

      {/* Stage label */}
      <p className="text-sm font-semibold text-ink-secondary animate-pulse tracking-wide">{stage.label}</p>

      {/* Connected step bar */}
      <div
        className="flex items-center"
        role="progressbar"
        aria-valuenow={stageIndex + 1}
        aria-valuemin={1}
        aria-valuemax={STAGES.length}
        aria-label={`Step ${stageIndex + 1} of ${STAGES.length}: ${stage.label}`}
      >
        {STAGES.map((s, i) => (
          <div key={s.label} className="flex items-center">
            {/* Dot */}
            {i === stageIndex ? (
              <div className="w-3 h-3 rounded-full bg-brand-500 shadow-glow" />
            ) : i < stageIndex ? (
              <div className="w-2 h-2 rounded-full bg-brand-500" />
            ) : (
              <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(100,116,139,0.25)' }} />
            )}
            {/* Connector (not after last dot) */}
            {i < STAGES.length - 1 && (
              <div
                className="h-px w-6"
                style={{
                  background: i < stageIndex ? 'var(--color-brand-400, #60a5fa)' : 'rgba(100,116,139,0.20)',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
