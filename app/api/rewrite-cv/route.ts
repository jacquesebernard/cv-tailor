import { NextRequest, NextResponse } from 'next/server'
import { extractCvText } from '../../../lib/extractCv'
import { fetchJobPosting } from '../../../lib/fetchJobPosting'
import { rewriteCvWithClaude } from '../../../lib/claudeRewrite'
import { generateDocx } from '../../../lib/generateDocx'

export const maxDuration = 60

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData()

    const cvFile = formData.get('cvFile') as File | null
    const cvTextRaw = formData.get('cvText') as string | null
    const jobInput = formData.get('jobInput') as string | null

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

    // Rewrite CV with Claude
    const rewrittenCv = await rewriteCvWithClaude(cvText, jobDescription)

    // Generate DOCX
    const docxBuffer = await generateDocx(rewrittenCv)
    const docxBase64 = docxBuffer.toString('base64')

    return NextResponse.json({ success: true, cv: rewrittenCv, docxBase64 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
