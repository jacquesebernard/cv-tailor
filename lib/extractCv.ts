import mammoth from 'mammoth'
import { ValidationError } from './errors'
import { MAX_FILE_SIZE } from './constants'

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]

/**
 * Extracts plain text from an uploaded CV file.
 * Supports PDF (via pdf-parse), DOCX (via mammoth), and TXT formats.
 *
 * @param file - The uploaded CV file
 * @returns Extracted plain text content
 * @throws {ValidationError} If the file exceeds 5MB, has a disallowed MIME type, or an unsupported extension
 */
export async function extractCvText(file: File): Promise<string> {
  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError('File size exceeds 5MB limit')
  }

  // Only reject if browser provides a MIME type AND it's not in the allowlist.
  // Some browsers/OS combos omit MIME for DOCX, so an empty type is still allowed
  // and extension-based gating below acts as the final check.
  if (file.type !== '' && !ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new ValidationError('Invalid file type. Please upload a PDF, DOCX, or TXT file.')
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const fileName = file.name.toLowerCase()

  if (fileName.endsWith('.pdf')) {
    const pdfParse = require('pdf-parse')
    const data = await pdfParse(buffer)
    return data.text
  } else if (fileName.endsWith('.docx')) {
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  } else if (fileName.endsWith('.txt')) {
    return buffer.toString('utf-8')
  } else {
    throw new ValidationError(`Unsupported file format. Please upload a PDF, DOCX, or TXT file. Received: ${file.name}`)
  }
}
