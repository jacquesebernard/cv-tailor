export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

/**
 * Error thrown when the AI service has insufficient credits or quota issues.
 * This should show a user-friendly message to the end user.
 */
export class AIServiceQuotaError extends Error {
  public readonly userMessage: string
  public readonly detailedError: string

  constructor(userMessage: string, detailedError: string) {
    super(userMessage)
    this.name = 'AIServiceQuotaError'
    this.userMessage = userMessage
    this.detailedError = detailedError
  }
}

/**
 * Error thrown when the AI service returns an error that isn't quota-related.
 * This should show a generic user-friendly message.
 */
export class AIServiceError extends Error {
  public readonly userMessage: string
  public readonly detailedError: string

  constructor(userMessage: string, detailedError: string) {
    super(userMessage)
    this.name = 'AIServiceError'
    this.userMessage = userMessage
    this.detailedError = detailedError
  }
}
