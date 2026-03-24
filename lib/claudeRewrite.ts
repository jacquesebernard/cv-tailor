import { RewrittenCV } from '../types/cv'
import { getAIProvider } from './ai'
import { ClaudeModelId, DEFAULT_CLAUDE_MODEL } from './constants'

/**
 * Rewrites a CV using the configured AI provider to maximize ATS keyword matching.
 *
 * @param cvText - Plain text of the candidate's original CV
 * @param jobDescription - Plain text of the target job description
 * @param model - Optional Claude model to use (defaults to DEFAULT_CLAUDE_MODEL)
 * @returns Structured, ATS-optimized rewritten CV with score and keyword analysis
 */
export async function rewriteCvWithClaude(
  cvText: string,
  jobDescription: string,
  model: ClaudeModelId = DEFAULT_CLAUDE_MODEL
): Promise<RewrittenCV> {
  return getAIProvider().rewriteCV(cvText, jobDescription, model)
}
