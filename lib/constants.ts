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
export const CLAUDE_MODEL = 'claude-opus-4-5'
export const CLAUDE_MAX_TOKENS = 4096
