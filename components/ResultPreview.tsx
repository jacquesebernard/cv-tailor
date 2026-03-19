'use client'

import { memo } from 'react'
import { RewrittenCV } from '../types/cv'

interface Props {
  cv: RewrittenCV
}

function ScoreRing({ score }: { score: number }) {
  const isHigh = score >= 80
  const isMed  = score >= 60

  const ringColor  = isHigh ? '#16a34a' : isMed ? '#f59e0b' : '#dc2626'
  const trackColor = 'rgba(15,23,42,0.08)'
  const textColor  = isHigh ? '#16a34a' : isMed ? '#d97706' : '#dc2626'

  const deg = Math.round((score / 100) * 360)

  return (
    <div
      role="img"
      aria-label={`ATS match score: ${score} out of 100`}
      className={`relative w-32 h-32 rounded-full shrink-0 ${score < 60 ? 'animate-pulse-ring' : ''}`}
      style={{
        background: `conic-gradient(${ringColor} ${deg}deg, ${trackColor} ${deg}deg)`,
      }}
    >
      {/* Inner donut */}
      <div
        className="absolute rounded-full bg-white"
        style={{ inset: '8px' }}
      />
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color: textColor }}>{score}</span>
        <span className="text-xs text-ink-tertiary mt-0.5">/ 100</span>
      </div>
    </div>
  )
}

const ResultPreview = memo(function ResultPreview({ cv }: Props) {
  return (
    <div className="space-y-6">
      {/* ATS Score */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-ink-primary mb-4">ATS Match Score</h3>
        <div className="flex items-center gap-6">
          <ScoreRing score={cv.atsScore} />
          <div className="space-y-2">
            <p className="text-sm text-ink-secondary">
              {cv.atsScore >= 80
                ? 'Excellent match! Your CV is well-optimized for this role.'
                : cv.atsScore >= 70
                  ? 'Good match — you\'re close! A few tweaks can push you above 80.'
                  : cv.atsScore >= 60
                    ? 'Moderate match. A few missing keywords may reduce visibility.'
                    : 'Low match. Consider addressing missing keywords below.'}
            </p>
            {cv.atsScore < 80 && cv.improvementTips && cv.improvementTips.length > 0 && (
              <div
                className="mt-2 rounded-xl p-3.5"
                style={{
                  background: 'rgba(217,119,6,0.08)',
                  border: '1px solid rgba(217,119,6,0.20)',
                }}
              >
                <p className="text-xs font-semibold text-warning-800 mb-1.5">Tips to reach 80+</p>
                <ul className="space-y-1.5">
                  {cv.improvementTips.map((tip, i) => (
                    <li key={i} className="text-xs text-warning-600 flex gap-1.5">
                      <span className="shrink-0">→</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keywords */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-ink-primary mb-4">Keywords Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-success-700 mb-2">
              Keywords Added ({cv.keywordsAdded.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {cv.keywordsAdded.map((kw, i) => (
                <span key={i} className="ats-badge bg-success-50 text-success-900 border border-success-200">
                  {kw}
                </span>
              ))}
              {cv.keywordsAdded.length === 0 && (
                <span className="text-xs text-ink-tertiary">None</span>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-danger-700 mb-2">
              Keywords Missing ({cv.keywordsMissing.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {cv.keywordsMissing.map((kw, i) => (
                <span
                  key={i}
                  title="Consider adding these if applicable"
                  className="ats-badge bg-danger-50 text-danger-700 border border-danger-200 cursor-help"
                >
                  {kw}
                </span>
              ))}
              {cv.keywordsMissing.length === 0 && (
                <span className="text-xs text-ink-tertiary">None — great job!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CV Preview */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-ink-primary mb-4">CV Preview</h3>

        {/* White-paper inner container */}
        <div
          className="rounded-3xl p-8 space-y-5"
          style={{
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(15,23,42,0.08)',
            boxShadow: 'inset 0 1px 0 white, 0 4px 16px -2px rgba(15,23,42,0.08)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {/* Header */}
          <div className="text-center border-b pb-4" style={{ borderColor: 'rgba(15,23,42,0.10)' }}>
            <h2 className="text-2xl font-bold text-ink-primary">{cv.contact.name}</h2>
            <p className="text-sm text-ink-tertiary mt-1">
              {[cv.contact.email, cv.contact.phone, cv.contact.location, cv.contact.linkedin, cv.contact.website]
                .filter(Boolean)
                .join(' | ')}
            </p>
          </div>

          {/* Summary */}
          <div>
            <h4 className="section-label mb-1.5">Professional Summary</h4>
            <p className="text-sm text-ink-secondary">{cv.summary}</p>
          </div>

          {/* Experience */}
          <div>
            <h4 className="section-label mb-2.5">Experience</h4>
            <div className="space-y-4">
              {cv.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <span className="text-sm font-semibold text-ink-primary">{exp.title}</span>
                    <span className="text-xs text-ink-tertiary">{exp.dates}</span>
                  </div>
                  <p className="text-xs text-ink-tertiary mb-1.5">
                    {[exp.company, exp.location].filter(Boolean).join(' — ')}
                  </p>
                  <ul className="space-y-1">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2 text-xs text-ink-secondary">
                        <span className="shrink-0 text-brand-400 font-bold">›</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h4 className="section-label mb-1.5">Skills</h4>
            <p className="text-sm text-ink-secondary">{cv.skills.join(' • ')}</p>
          </div>

          {/* Education */}
          <div>
            <h4 className="section-label mb-2.5">Education</h4>
            {cv.education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <span className="text-sm font-semibold text-ink-primary">{edu.degree}</span>
                  <span className="text-xs text-ink-tertiary">{edu.dates}</span>
                </div>
                <p className="text-xs text-ink-tertiary">
                  {[edu.institution, edu.location].filter(Boolean).join(' — ')}
                </p>
                {edu.details && <p className="text-xs text-ink-secondary mt-0.5">{edu.details}</p>}
              </div>
            ))}
          </div>

          {/* Certifications */}
          {cv.certifications && cv.certifications.length > 0 && (
            <div>
              <h4 className="section-label mb-2.5">Certifications</h4>
              {cv.certifications.map((cert, i) => (
                <p key={i} className="text-sm text-ink-secondary">
                  <span className="font-semibold">{cert.name}</span>
                  {(cert.issuer || cert.date) && (
                    <span className="text-ink-tertiary">
                      {' — '}
                      {[cert.issuer, cert.date].filter(Boolean).join(' ')}
                    </span>
                  )}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default ResultPreview
