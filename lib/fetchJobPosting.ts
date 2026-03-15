import { parse } from 'node-html-parser'

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
}

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
        if (candidate.length > best.length && candidate.length > 300) {
          best = candidate
        }
      }
      if (best.length > 500) break
    } catch {
      // unsupported selector, continue
    }
  }

  if (best.length < 300) {
    const body = root.querySelector('body')
    best = cleanText(body ? body.text : root.text)
  }

  return best
}

async function tryJinaReader(url: string): Promise<string> {
  const jinaUrl = `https://r.jina.ai/${url}`
  const response = await fetch(jinaUrl, { headers: BROWSER_HEADERS })
  if (!response.ok) {
    throw new Error(`Jina Reader failed: ${response.status}`)
  }
  const text = cleanText(await response.text())
  return text.length > 8000 ? text.substring(0, 8000) : text
}

export async function fetchJobPosting(url: string): Promise<string> {
  // Validate URL
  try {
    new URL(url)
  } catch {
    throw new Error('Invalid URL provided.')
  }

  // 1. Try direct fetch first (fast path for plain-HTML job sites)
  let directText = ''
  try {
    const response = await fetch(url, { headers: BROWSER_HEADERS })

    if (response.status === 403 || response.status === 401) {
      // Hard block — skip straight to Jina
    } else if (response.ok) {
      const html = await response.text()
      directText = extractFromHtml(html)
    }
  } catch {
    // Network error — fall through to Jina
  }

  if (directText.length >= 300) {
    return directText.length > 8000 ? directText.substring(0, 8000) : directText
  }

  // 2. Jina AI Reader fallback — handles JS-rendered SPAs (Greenhouse, Lever, Workday, etc.)
  try {
    return await tryJinaReader(url)
  } catch {
    // Jina also failed
  }

  throw new Error(
    'Could not extract content from this URL. The page may require login or is heavily restricted. Please paste the job description text instead.'
  )
}
