'use client'

import { CLAUDE_MODELS, ClaudeModelId } from '../lib/constants'

interface ModelSelectorProps {
  value: ClaudeModelId
  onChange: (model: ClaudeModelId) => void
  disabled?: boolean
}

export default function ModelSelector({ value, onChange, disabled }: ModelSelectorProps) {
  return (
    <select
      id="model-select"
      value={value}
      onChange={(e) => onChange(e.target.value as ClaudeModelId)}
      disabled={disabled}
      className="h-full px-4 py-4 rounded-2xl text-sm font-medium text-ink-primary bg-white border border-stroke-secondary hover:border-stroke-primary focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Select AI model"
    >
      {Object.entries(CLAUDE_MODELS).map(([id, info]) => (
        <option key={id} value={id}>
          {info.name}
        </option>
      ))}
    </select>
  )
}
