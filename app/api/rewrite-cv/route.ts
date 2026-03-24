import { NextRequest, NextResponse } from 'next/server'
import { extractCvText } from '../../../lib/extractCv'
import { fetchJobPosting } from '../../../lib/fetchJobPosting'
import { rewriteCvWithClaude } from '../../../lib/claudeRewrite'
import { generateDocx } from '../../../lib/generateDocx'
import { ValidationError, AIServiceQuotaError, AIServiceError } from '../../../lib/errors'
import { DEFAULT_CLAUDE_MODEL, CLAUDE_MODELS, ClaudeModelId } from '../../../lib/constants'

export const maxDuration = 60

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData()

    const cvFile = formData.get('cvFile') as File | null
    const cvTextRaw = formData.get('cvText') as string | null
    const jobInput = formData.get('jobInput') as string | null
    const modelId = (formData.get('model') as string) || DEFAULT_CLAUDE_MODEL

    // Validate model
    if (!(modelId in CLAUDE_MODELS)) {
      return NextResponse.json(
        { success: false, error: 'Invalid model selected.' },
        { status: 400 }
      )
    }

    // Validate inputs
    const hasCvFile = cvFile && cvFile.size > 0
    const hasCvText = cvTextRaw && cvTextRaw.trim().length > 0

    if (!hasCvFile && !hasCvText) {
      return NextResponse.json(
        { success: false, error: 'Please provide a CV file or paste your CV text.' },
        { status: 400 }
      )
    }

    if (!jobInput || jobInput.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please provide a job description or URL.' },
        { status: 400 }
      )
    }

    // Extract CV text
    let cvText: string
    if (hasCvFile) {
      cvText = await extractCvText(cvFile)
    } else {
      cvText = cvTextRaw!.trim()
    }

    // Get job description
    let jobDescription: string
    if (jobInput.startsWith('http://') || jobInput.startsWith('https://')) {
      jobDescription = await fetchJobPosting(jobInput)
    } else {
      jobDescription = jobInput
    }

    // Rewrite CV with Claude using selected model
    const rewrittenCv = await rewriteCvWithClaude(cvText, jobDescription, modelId as ClaudeModelId)

    // Generate DOCX
    const docxBuffer = await generateDocx(rewrittenCv)
    const docxBase64 = docxBuffer.toString('base64')

    return NextResponse.json({ success: true, cv: rewrittenCv, docxBase64 })
  } catch (error) {
    // Handle validation errors (user input issues)
    if (error instanceof ValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    // Handle AI service quota errors (credit/billing issues)
    if (error instanceof AIServiceQuotaError) {
      console.error('AI Service Quota Error:', error.detailedError)
      return NextResponse.json({ success: false, error: error.userMessage }, { status: 503 })
    }

    // Handle AI service errors (API issues)
    if (error instanceof AIServiceError) {
      console.error('AI Service Error:', error.detailedError)
      return NextResponse.json({ success: false, error: error.userMessage }, { status: 503 })
    }

    // Handle unexpected errors
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
