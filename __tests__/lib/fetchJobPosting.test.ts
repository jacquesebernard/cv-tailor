import { fetchJobPosting } from '../../lib/fetchJobPosting'

// Prevent real network calls in unit tests
global.fetch = jest.fn()

afterEach(() => {
  jest.clearAllMocks()
})

describe('fetchJobPosting — URL validation', () => {
  it('throws ValidationError for a malformed URL', async () => {
    await expect(fetchJobPosting('not-a-url')).rejects.toThrow('Invalid URL provided.')
  })

  it('throws ValidationError for non-http/https schemes', async () => {
    await expect(fetchJobPosting('ftp://example.com/job')).rejects.toThrow(
      'Only HTTP and HTTPS URLs are allowed.'
    )
    await expect(fetchJobPosting('file:///etc/passwd')).rejects.toThrow(
      'Only HTTP and HTTPS URLs are allowed.'
    )
  })
})

describe('fetchJobPosting — SSRF protection', () => {
  it('blocks localhost', async () => {
    await expect(fetchJobPosting('http://localhost/admin')).rejects.toThrow(
      'Access to internal/private networks is not allowed.'
    )
  })

  it('blocks 127.x.x.x', async () => {
    await expect(fetchJobPosting('http://127.0.0.1/secret')).rejects.toThrow(
      'Access to internal/private networks is not allowed.'
    )
  })

  it('blocks 10.x.x.x private range', async () => {
    await expect(fetchJobPosting('http://10.0.0.1/internal')).rejects.toThrow(
      'Access to internal/private networks is not allowed.'
    )
  })

  it('blocks 192.168.x.x private range', async () => {
    await expect(fetchJobPosting('http://192.168.1.1/')).rejects.toThrow(
      'Access to internal/private networks is not allowed.'
    )
  })

  it('blocks 169.254.x.x link-local range', async () => {
    await expect(fetchJobPosting('http://169.254.169.254/metadata')).rejects.toThrow(
      'Access to internal/private networks is not allowed.'
    )
  })
})

describe('fetchJobPosting — content extraction', () => {
  it('returns extracted content from a successful fetch', async () => {
    const html = `<html><body><main>${'Job description content '.repeat(20)}</main></body></html>`
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => html,
    })

    const result = await fetchJobPosting('https://example.com/job')
    expect(result.length).toBeGreaterThan(50)
  })

  it('throws when both direct fetch and Jina Reader fail', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('network error'))

    await expect(fetchJobPosting('https://example.com/job')).rejects.toThrow(
      'Could not extract content from this URL'
    )
  })
})
