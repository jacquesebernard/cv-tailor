import { RewrittenCV } from '../../types/cv'

/**
 * Common interface for AI providers that can rewrite CVs.
 * Implement this to add support for new AI backends (OpenAI, Gemini, etc.).
 */
export interface AIProvider {
  /**
   * Rewrites a candidate's CV to match a specific job description.
   *
   * @param cvText - Plain text content of the candidate's CV
   * @param jobDescription - Plain text of the target job description
   * @returns Structured, ATS-optimized rewritten CV
   */
  rewriteCV(cvText: string, jobDescription: string): Promise<RewrittenCV>
}
