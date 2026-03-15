import mammoth from 'mammoth'

export async function extractCvText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const fileName = file.name.toLowerCase()

  if (fileName.endsWith('.pdf')) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pdfParse = require('pdf-parse')
    const data = await pdfParse(buffer)
    return data.text
  } else if (fileName.endsWith('.docx')) {
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  } else if (fileName.endsWith('.txt')) {
    return buffer.toString('utf-8')
  } else {
    throw new Error(`Unsupported file format. Please upload a PDF, DOCX, or TXT file. Received: ${file.name}`)
  }
}
