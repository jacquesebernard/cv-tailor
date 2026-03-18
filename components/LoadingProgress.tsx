'use client'

import { useState, useEffect } from 'react'

const STAGES = [
  { label: 'Extracting CV text...', duration: 2000 },
  { label: 'Fetching job description...', duration: 4000 },
  { label: 'Rewriting with Claude AI...', duration: 16000 },
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
    <div className="mt-6 flex flex-col items-center gap-4 py-8">
      {/* Spinner */}
      <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>

      {/* Stage label */}
      <p className="text-sm font-medium text-gray-700 animate-pulse">{stage.label}</p>

      {/* Step dots */}
      <div className="flex gap-2">
        {STAGES.map((s, i) => (
          <div
            key={s.label}
            className={`h-2 w-2 rounded-full transition-colors duration-500 ${
              i <= stageIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
