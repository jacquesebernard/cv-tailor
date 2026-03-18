import { extractCvText } from '../../lib/extractCv'

// pdf-parse is a native module — mock it for unit tests
jest.mock('pdf-parse', () => jest.fn().mockResolvedValue({ text: 'pdf content' }))
jest.mock('mammoth', () => ({
  extractRawText: jest.fn().mockResolvedValue({ value: 'docx content' }),
}))

function makeFile(name: string, type: string, sizeBytes: number): File {
  const content = 'x'.repeat(sizeBytes)
  return new File([content], name, { type })
}

describe('extractCvText', () => {
  it('rejects files larger than 5MB', async () => {
    const file = makeFile('big.pdf', 'application/pdf', 6 * 1024 * 1024)
    await expect(extractCvText(file)).rejects.toThrow('File size exceeds 5MB limit')
  })

  it('rejects disallowed MIME types when provided', async () => {
    const file = makeFile('test.exe', 'application/x-msdownload', 100)
    await expect(extractCvText(file)).rejects.toThrow('Invalid file type')
  })

  it('rejects unsupported extensions', async () => {
    const file = makeFile('test.xls', '', 100)
    await expect(extractCvText(file)).rejects.toThrow('Unsupported file format')
  })

  it('accepts a valid PDF file', async () => {
    const file = makeFile('cv.pdf', 'application/pdf', 1000)
    const result = await extractCvText(file)
    expect(result).toBe('pdf content')
  })

  it('accepts a valid DOCX file', async () => {
    const file = makeFile('cv.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1000)
    const result = await extractCvText(file)
    expect(result).toBe('docx content')
  })

  it('accepts a valid TXT file', async () => {
    const file = makeFile('cv.txt', 'text/plain', 100)
    const result = await extractCvText(file)
    expect(typeof result).toBe('string')
  })

  it('allows DOCX with empty MIME type (browser compatibility)', async () => {
    const file = makeFile('cv.docx', '', 1000)
    await expect(extractCvText(file)).resolves.toBeDefined()
  })
})
