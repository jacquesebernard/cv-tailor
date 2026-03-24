// File upload limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// Job content length thresholds
export const MIN_JOB_CONTENT_LENGTH = 300
export const MIN_JOB_CONTENT_FALLBACK = 500
export const MAX_JOB_CONTENT_LENGTH = 8000

// UI validation thresholds
export const MIN_JOB_INPUT_WARNING_LENGTH = 100

// External fetch configuration
export const FETCH_TIMEOUT_MS = 15_000 // 15 seconds

// Claude AI configuration
export const CLAUDE_MAX_TOKENS = 4096

// Available Claude models with pricing info
export const CLAUDE_MODELS = {
  'claude-sonnet-4-5': {
    name: 'Sonnet 4.5',
    description: 'Best balance - Excellent quality, cost-effective',
    inputCost: '$3/MTok',
    outputCost: '$15/MTok',
  },
  'claude-opus-4-6': {
    name: 'Claude 4.6 Opus',
    description: 'Best but costly - Highest quality, more expensive',
    inputCost: '$3/MTok',
    outputCost: '$15/MTok',
  },
  'claude-haiku-4-5': {
    name: 'Haiku 4.5',
    description: 'Fast and economical',
    inputCost: '$0.80/MTok',
    outputCost: '$4/MTok',
  },
} as const

export type ClaudeModelId = keyof typeof CLAUDE_MODELS

// Default model
export const DEFAULT_CLAUDE_MODEL: ClaudeModelId = 'claude-sonnet-4-5'
