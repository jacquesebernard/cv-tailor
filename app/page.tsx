'use client'

import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import DropzoneUpload from '../components/DropzoneUpload'
import JobInput from '../components/JobInput'
import ResultPreview from '../components/ResultPreview'
import DownloadButton from '../components/DownloadButton'
import LoadingProgress from '../components/LoadingProgress'
import { RewriteResult } from '../types/cv'
import { MIN_JOB_INPUT_WARNING_LENGTH } from '../lib/constants'

export default function HomePage() {
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
    <div className="min-h-screen bg-gray-50">
      {/* Screen reader live region */}
      <div role="status" aria-live="polite" className="sr-only">
        {isLoading && 'Processing your CV, please wait...'}
        {result?.success && 'CV rewrite complete. Results are ready below.'}
      </div>
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0d1b2e] to-[#2165bf] text-white py-10 px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          ✨ CV Tailor
        </h1>
        <p className="mt-2 text-blue-200 text-lg">
          Rewrite your CV to match any job description —{' '}
          <span className="text-cyan-400 font-semibold">ATS optimized</span>
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

            {/* Right: Info card */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">How it works</h2>
                <ol className="space-y-3">
                  {[
                    { icon: '📄', title: 'Upload your CV', desc: 'PDF, DOCX, or TXT — or paste text directly' },
                    { icon: '💼', title: 'Add the job', desc: 'Paste a description or drop in a URL' },
                    { icon: '⬇️', title: 'Download', desc: 'Get an ATS-ready DOCX in seconds' },
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-2xl">{step.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{step.title}</p>
                        <p className="text-xs text-gray-500">{step.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-3">What you get</h2>
                <ul className="space-y-2">
                  {[
                    'Keyword matching from the job description',
                    'ATS-friendly formatting',
                    'Strong action verbs & rewritten bullets',
                    'Clean, professional DOCX export',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-green-500">✓</span>
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
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex justify-between items-start gap-3">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600 text-lg leading-none shrink-0"
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
                w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 min-h-[44px]
                ${canSubmit
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-[0.99]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
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
                '✨ Tailor My CV'
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
              <h2 className="text-2xl font-bold text-gray-900">Your Tailored CV</h2>
              <button
                type="button"
                onClick={handleReset}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
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
