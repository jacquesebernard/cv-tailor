import { RewrittenCV } from '../types/cv'
import { getAIProvider } from './ai'

/**
 * Rewrites a CV using the configured AI provider (default: Claude).
 *
 * @param cvText - Plain text of the candidate's CV
 * @param jobDescription - Plain text of the target job description
 * @returns Structured, ATS-optimized rewritten CV
 */
/**
 * Rewrites a CV using the configured AI provider to maximize ATS keyword matching.
 *
 * @param cvText - Plain text of the candidate's original CV
 * @param jobDescription - Plain text of the target job description
 * @returns Structured, ATS-optimized rewritten CV with score and keyword analysis
 */
export async function rewriteCvWithClaude(
  cvText: string,
  jobDescription: string
): Promise<RewrittenCV> {
  return getAIProvider().rewriteCV(cvText, jobDescription)
}
