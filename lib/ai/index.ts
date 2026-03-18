import { AIProvider } from './provider'
import { ClaudeProvider } from './claude'

/**
 * Returns the configured AI provider based on the AI_PROVIDER environment variable.
 * Defaults to Claude if not set.
 *
 * @returns An AIProvider instance ready to rewrite CVs
 * @throws {Error} If an unknown provider name is configured
 */
export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER ?? 'claude'
  switch (provider) {
    case 'claude':
      return new ClaudeProvider()
    default:
      throw new Error(`Unknown AI provider: "${provider}". Supported providers: claude`)
  }
}
