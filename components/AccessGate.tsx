'use client'

import { useState } from 'react'

interface Props {
  onUnlock: () => void
}

export default function AccessGate({ onUnlock }: Props) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || isVerifying) return

    setIsVerifying(true)
    setError(null)

    try {
      const res = await fetch('/api/verify-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()

      if (data.valid) {
        onUnlock()
      } else {
        setError('Invalid access code. Please try again.')
        setCode('')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center px-4">
      {/* Mesh gradient background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 10% 0%, rgba(33,101,191,0.10) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(33,101,191,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="glass-card p-10 w-full max-w-sm animate-scale-in">
        {/* Branding */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-ink-primary tracking-tight">CV Tailor</h1>
          <p className="mt-1.5 text-sm text-ink-tertiary">Enter your access code to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="access-code" className="block text-sm font-semibold text-ink-secondary mb-1.5">
              Access Code
            </label>
            <input
              id="access-code"
              type="password"
              value={code}
              onChange={e => setCode(e.target.value)}
              autoComplete="off"
              autoFocus
              placeholder="Enter code..."
              className="input-glass w-full p-3.5 text-sm"
            />
          </div>

          {error && (
            <p className="text-sm text-danger-600 flex items-center gap-1.5">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
              </svg>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!code.trim() || isVerifying}
            className={`
              w-full py-3.5 rounded-2xl font-bold text-sm min-h-[44px] transition-all duration-350 ease-spring
              ${code.trim() && !isVerifying
                ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-card hover:shadow-float hover:-translate-y-0.5 active:translate-y-0'
                : 'text-ink-tertiary cursor-not-allowed'
              }
            `}
            style={!code.trim() || isVerifying ? { background: 'rgba(100,116,139,0.20)' } : undefined}
          >
            {isVerifying ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Verifying...
              </span>
            ) : (
              'Continue'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
