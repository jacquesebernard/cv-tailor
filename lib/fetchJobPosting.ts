import { parse } from 'node-html-parser'
import { ValidationError } from './errors'
import {
  FETCH_TIMEOUT_MS,
  MIN_JOB_CONTENT_LENGTH,
  MIN_JOB_CONTENT_FALLBACK,
  MAX_JOB_CONTENT_LENGTH,
} from './constants'

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
}


const BLOCKED_HOSTNAMES = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^\[?::1\]?$/,
]

function cleanText(raw: string): string {
  return raw
    .replace(/\t/g, ' ')
    .replace(/ {2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function extractFromHtml(html: string): string {
  const root = parse(html)

  root
    .querySelectorAll('script, style, nav, footer, header, aside, [role="banner"], [role="navigation"]')
    .forEach(el => el.remove())

  const selectors = [
    '[class*="job-description"]',
    '[id*="job-description"]',
    '[class*="jobDescription"]',
    '[id*="jobDescription"]',
    '[class*="description"]',
    '[id*="description"]',
    '[class*="job-detail"]',
    '[id*="job-detail"]',
    '[class*="posting"]',
    'article',
    '[role="main"]',
    'main',
  ]

  let best = ''
  for (const selector of selectors) {
    try {
      for (const el of root.querySelectorAll(selector)) {
        const candidate = cleanText(el.text)
        if (candidate.length > best.length && candidate.length > MIN_JOB_CONTENT_LENGTH) {
          best = candidate
        }
      }
      if (best.length > MIN_JOB_CONTENT_FALLBACK) break
    } catch {
      // unsupported selector, continue
    }
  }

  if (best.length < MIN_JOB_CONTENT_LENGTH) {
    const body = root.querySelector('body')
    best = cleanText(body ? body.text : root.text)
  }

  return best
}

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(id)
  }
}

async function tryJinaReader(url: string): Promise<string> {
  const jinaUrl = `https://r.jina.ai/${url}`
  const response = await fetchWithTimeout(jinaUrl, { headers: BROWSER_HEADERS })
  if (!response.ok) {
    throw new Error(`Jina Reader failed: ${response.status}`)
  }
  const text = cleanText(await response.text())
  return text.length > MAX_JOB_CONTENT_LENGTH ? text.substring(0, MAX_JOB_CONTENT_LENGTH) : text
}

/**
 * Fetches and extracts the job description text from a URL.
 * Tries a direct HTML fetch first; falls back to Jina AI Reader for JS-rendered pages.
 *
 * @param url - Public URL of the job posting (http/https only)
 * @returns Extracted job description text (max 8000 chars)
 * @throws {ValidationError} If the URL is invalid, uses a disallowed scheme, or targets an internal network
 * @throws {Error} If content cannot be extracted after both fetch strategies
 */
export async function fetchJobPosting(url: string): Promise<string> {
  // Validate URL format and scheme
  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    throw new ValidationError('Invalid URL provided.')
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new ValidationError('Only HTTP and HTTPS URLs are allowed.')
  }

  if (BLOCKED_HOSTNAMES.some(p => p.test(parsedUrl.hostname))) {
    throw new ValidationError('Access to internal/private networks is not allowed.')
  }

  // 1. Try direct fetch first (fast path for plain-HTML job sites)
  let directText = ''
  try {
    const response = await fetchWithTimeout(url, { headers: BROWSER_HEADERS })

    if (response.status === 403 || response.status === 401) {
      // Hard block — skip straight to Jina
    } else if (response.ok) {
      const html = await response.text()
      directText = extractFromHtml(html)
    }
  } catch (error) {
    console.warn(`Direct fetch failed for ${url}:`, error instanceof Error ? error.message : error)
    // fall through to Jina
  }

  if (directText.length >= MIN_JOB_CONTENT_LENGTH) {
    return directText.length > MAX_JOB_CONTENT_LENGTH ? directText.substring(0, MAX_JOB_CONTENT_LENGTH) : directText
  }

  // 2. Jina AI Reader fallback — handles JS-rendered SPAs (Greenhouse, Lever, Workday, etc.)
  try {
    return await tryJinaReader(url)
  } catch (error) {
    console.warn(`Jina Reader failed for ${url}:`, error instanceof Error ? error.message : error)
  }

  throw new Error(
    'Could not extract content from this URL. The page may require login or is heavily restricted. Please paste the job description text instead.'
  )
}
