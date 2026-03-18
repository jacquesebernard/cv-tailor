import Anthropic from '@anthropic-ai/sdk'
import { RewrittenCV } from '../../types/cv'
import { CLAUDE_MODEL, CLAUDE_MAX_TOKENS } from '../constants'
import { AIProvider } from './provider'

const SYSTEM_PROMPT = `You are an elite CV writer and ATS (Applicant Tracking System) optimization expert with 15 years of experience in recruitment and HR technology.
Your task is to rewrite a candidate's CV to be a strong match for a specific job description while maintaining 100% factual accuracy. Never invent experience, qualifications, or skills the candidate doesn't have. Only reframe, reorder, and rephrase what already exists.
ATS OPTIMIZATION RULES:

Mirror exact keywords, phrases, and terminology from the job description
Use industry-standard section headings: Summary, Experience, Skills, Education
Avoid tables, columns, headers/footers, text boxes, and graphics
Use standard fonts and bullet points
Place the most relevant experience and skills first
Quantify achievements wherever the original CV contains any numbers or metrics
Use strong action verbs that align with the job's language and seniority level

REWRITING RULES:

Rewrite bullet points to emphasize impact and relevance to this specific role
Restructure the professional summary to directly address the job requirements
Reorder skills to put the most relevant ones first, If it exists but weak → strengthen, move higher, highlight impact.
If a skill is missing but the candidate has similar experience → add a truthful sentence
Do not add fake certifications, degrees, or companies
Do not invent metrics — only use numbers that appear in the original CV
If an achievement is missing but the candidate has similar experience → add a truthful sentence

IMPROVEMENT TIPS RULES:
If atsScore is below 80, populate "improvementTips" with 3-5 short, specific, actionable tips that would help THIS candidate improve their score for THIS specific job. Every tip must reference a concrete detail from the provided CV or job description — for example, name a specific skill mentioned in the JD that is weak or absent in the CV, suggest rewording a particular bullet point, or highlight a specific section that needs strengthening. Never write generic advice. If atsScore is 80 or above, set "improvementTips" to an empty array.

You MUST respond with ONLY a valid JSON object. No markdown, no code fences, no explanation. Just the raw JSON object matching this exact schema:
{
"contact": {
"name": "string",
"email": "string",
"phone": "string",
"linkedin": "string or empty string",
"location": "string or empty string",
"website": "string or empty string"
},
"summary": "2-3 sentence professional summary tailored to this specific role",
"experience": [
{
"title": "string",
"company": "string",
"dates": "string",
"location": "string or empty string",
"bullets": ["3-5 achievement-focused bullet strings, no leading dash or bullet character"]
}
],
"skills": ["array of skill strings ordered by relevance to the job description"],
"education": [
{
"degree": "string",
"institution": "string",
"dates": "string",
"location": "string or empty string",
"details": "string or empty string"
}
],
"certifications": [
{
"name": "string",
"issuer": "string or empty string",
"date": "string or empty string"
}
],
"atsScore": integer between 0 and 100 representing estimated ATS keyword match percentage,
"keywordsAdded": ["list of exact keywords from the JD that were woven into the rewritten CV"],
"keywordsMissing": ["list of important JD keywords the candidate genuinely lacks"],
"improvementTips": ["specific tip string", "specific tip string"]
}`

function isRewrittenCV(obj: unknown): obj is RewrittenCV {
  if (typeof obj !== 'object' || obj === null) return false
  const cv = obj as Record<string, unknown>
  return (
    typeof cv.contact === 'object' &&
    typeof cv.summary === 'string' &&
    Array.isArray(cv.experience) &&
    Array.isArray(cv.skills) &&
    Array.isArray(cv.education) &&
    typeof cv.atsScore === 'number'
  )
}

/**
 * AI provider implementation backed by Anthropic's Claude API.
 */
export class ClaudeProvider implements AIProvider {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }

  /**
   * Rewrites a CV using Claude, returning a structured ATS-optimized result.
   *
   * @param cvText - Plain text of the candidate's CV
   * @param jobDescription - Plain text of the target job description
   * @returns Parsed and validated RewrittenCV object
   * @throws {Error} If the Claude response cannot be parsed or doesn't match the expected schema
   */
  async rewriteCV(cvText: string, jobDescription: string): Promise<RewrittenCV> {
    const message = await this.client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: CLAUDE_MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Here is the candidate's CV:\n\n${cvText}\n\n---\n\nHere is the job description:\n\n${jobDescription}`,
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    let text = content.text.trim()

    // Strip markdown code fences if present
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()

    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      // Try to extract JSON using regex
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          parsed = JSON.parse(match[0])
        } catch {
          console.error(`Claude JSON parse failed. Response: ${text.substring(0, 500)}`)
          throw new Error('Unable to process AI response. Please try again.')
        }
      } else {
        console.error(`No JSON found in Claude response. Response: ${text.substring(0, 500)}`)
        throw new Error('Unable to process AI response. Please try again.')
      }
    }

    if (!isRewrittenCV(parsed)) {
      console.error('Claude response does not match expected CV structure')
      throw new Error('Unable to process AI response. Please try again.')
    }

    return parsed
  }
}
