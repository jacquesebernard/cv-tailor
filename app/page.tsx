'use client'

import { useState, useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'
import DropzoneUpload from '../components/DropzoneUpload'
import JobInput from '../components/JobInput'
import ResultPreview from '../components/ResultPreview'
import DownloadButton from '../components/DownloadButton'
import LoadingProgress from '../components/LoadingProgress'
import AccessGate from '../components/AccessGate'
import { RewriteResult } from '../types/cv'
import { MIN_JOB_INPUT_WARNING_LENGTH } from '../lib/constants'

const ACCESS_KEY = 'cv_tailor_access'

export default function HomePage() {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null)

  useEffect(() => {
    setIsUnlocked(localStorage.getItem(ACCESS_KEY) === 'true')
  }, [])

  const handleUnlock = useCallback(() => {
    localStorage.setItem(ACCESS_KEY, 'true')
    setIsUnlocked(true)
  }, [])

  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvText, setCvText] = useState<string>('')
  const [jobInput, setJobInput] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<RewriteResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileAccepted = useCallback((file: File) => {
    setCvFile(file)
    setCvText('')
  }, [])

  const handleTextFallback = useCallback((text: string) => {
    setCvText(text)
    setCvFile(null)
  }, [])

  // Gate: null = loading from storage, false = locked, true = unlocked
  if (isUnlocked === null) return null
  if (!isUnlocked) return <AccessGate onUnlock={handleUnlock} />

  const hasCv = cvFile !== null || cvText.trim().length > 0
  const hasJob = jobInput.trim().length > 0
  const canSubmit = hasCv && hasJob && !isLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (jobInput.trim().length > 0 && jobInput.trim().length < MIN_JOB_INPUT_WARNING_LENGTH && !jobInput.startsWith('http')) {
      toast('Job description seems short. Make sure you paste the full description.', {
        icon: '⚠️',
      })
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      if (cvFile) formData.append('cvFile', cvFile)
      if (cvText.trim()) formData.append('cvText', cvText)
      formData.append('jobInput', jobInput)

      const response = await fetch('/api/rewrite-cv', {
        method: 'POST',
        body: formData,
      })

      const data = (await response.json()) as RewriteResult

      if (!data.success || !data.cv) {
        throw new Error(data.error || 'Rewrite failed')
      }

      setResult(data)
      toast.success('CV rewritten successfully!')

      // Smooth scroll to results and move keyboard focus
      setTimeout(() => {
        const resultsEl = document.getElementById('results')
        resultsEl?.scrollIntoView({ behavior: 'smooth' })
        resultsEl?.focus()
      }, 100)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setCvFile(null)
    setCvText('')
    setJobInput('')
    setResult(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Mesh gradient background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 10% 0%, rgba(33,101,191,0.10) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(33,101,191,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Screen reader live region */}
      <div role="status" aria-live="polite" className="sr-only">
        {isLoading && 'Processing your CV, please wait...'}
        {result?.success && 'CV rewrite complete. Results are ready below.'}
      </div>

      {/* Header */}
      <header
        className="relative text-white py-12 px-4 text-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(8,15,26,0.96) 0%, rgba(13,27,46,0.92) 60%, rgba(26,79,153,0.85) 100%)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Subtle noise texture overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px',
          }}
        />
        <h1 className="relative text-4xl font-bold tracking-tight text-ink-inverse">
          CV Tailor
        </h1>
        <p className="relative mt-2 text-lg" style={{ color: 'rgba(180,210,255,0.85)' }}>
          Rewrite your CV to match any job description —{' '}
          <span className="font-semibold" style={{ color: 'rgba(120,200,255,1)' }}>ATS optimized</span>
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit}>
          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Inputs */}
            <div className="space-y-6">
              <DropzoneUpload
                onFileAccepted={handleFileAccepted}
                onTextFallback={handleTextFallback}
              />
              <JobInput value={jobInput} onChange={setJobInput} />
            </div>

            {/* Right: Info cards */}
            <div className="space-y-4">
              <div className="glass-card p-6 animate-slide-in" style={{ animationDelay: '0ms' }}>
                <h2 className="text-lg font-bold text-ink-primary mb-4">How it works</h2>
                <ol className="space-y-3">
                  {[
                    { icon: '📄', title: 'Upload your CV', desc: 'PDF, DOCX, or TXT — or paste text directly' },
                    { icon: '💼', title: 'Add the job', desc: 'Paste a description or drop in a URL' },
                    { icon: '⬇️', title: 'Download', desc: 'Get an ATS-ready DOCX in seconds' },
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-2xl">{step.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-ink-primary">{step.title}</p>
                        <p className="text-xs text-ink-tertiary">{step.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="glass-card p-6 animate-slide-in" style={{ animationDelay: '80ms' }}>
                <h2 className="text-lg font-bold text-ink-primary mb-3">What you get</h2>
                <ul className="space-y-2">
                  {[
                    'Keyword matching from the job description',
                    'ATS-friendly formatting',
                    'Strong action verbs & rewritten bullets',
                    'Clean, professional DOCX export',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-ink-secondary">
                      <span className="text-success-600">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Loading progress */}
          {isLoading && <LoadingProgress />}

          {/* Submit button */}
          <div className="mt-8">
            {error && (
              <div
                className="mb-4 p-4 rounded-2xl flex justify-between items-start gap-3"
                style={{
                  background: 'rgba(220,38,38,0.08)',
                  border: '1px solid rgba(220,38,38,0.20)',
                }}
              >
                <p className="text-sm text-danger-700">{error}</p>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-danger-600 hover:text-danger-700 text-lg leading-none shrink-0 transition-colors duration-200"
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            )}
            <button
              type="submit"
              disabled={!canSubmit}
              className={`
                w-full py-4 rounded-2xl font-bold text-lg min-h-[44px] transition-all duration-350 ease-spring
                ${canSubmit
                  ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-card hover:shadow-float hover:-translate-y-0.5 active:translate-y-0'
                  : 'text-ink-tertiary cursor-not-allowed'
                }
              `}
              style={!canSubmit ? { background: 'rgba(100,116,139,0.20)' } : undefined}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Analyzing & rewriting...
                </span>
              ) : (
                'Tailor My CV'
              )}
            </button>
          </div>
        </form>

        {/* Results */}
        {result?.success && result.cv && (
          <div
            id="results"
            tabIndex={-1}
            className="mt-12 space-y-6 animate-fade-in outline-none"
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-2xl font-bold text-ink-primary">Your Tailored CV</h2>
              <button
                type="button"
                onClick={handleReset}
                className="text-sm text-ink-tertiary hover:text-ink-secondary underline transition-colors duration-200"
              >
                Rewrite Another
              </button>
            </div>

            <ResultPreview cv={result.cv} />

            {result.docxBase64 && (
              <DownloadButton
                docxBase64={result.docxBase64}
                candidateName={result.cv.contact.name}
              />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
