'use client'

import { memo } from 'react'
import { RewrittenCV } from '../types/cv'

interface Props {
  cv: RewrittenCV
}

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 80 ? 'text-green-600' : score >= 60 ? 'text-amber-600' : 'text-red-600'
  const ringColor =
    score >= 80 ? 'border-green-500' : score >= 60 ? 'border-amber-400' : 'border-red-400'
  const bgColor =
    score >= 80 ? 'bg-green-50' : score >= 60 ? 'bg-amber-50' : 'bg-red-50'

  return (
    <div className={`flex flex-col items-center justify-center w-32 h-32 rounded-full border-8 ${ringColor} ${bgColor}`}>
      <span className={`text-3xl font-bold ${color}`}>{score}</span>
      <span className="text-xs text-gray-500 mt-1">/ 100</span>
    </div>
  )
}

const ResultPreview = memo(function ResultPreview({ cv }: Props) {
  return (
    <div className="space-y-6">
      {/* ATS Score */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">ATS Match Score</h3>
        <div className="flex items-center gap-6">
          <ScoreRing score={cv.atsScore} />
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              {cv.atsScore >= 80
                ? 'Excellent match! Your CV is well-optimized for this role.'
                : cv.atsScore >= 70
                  ? 'Good match — you\'re close! A few tweaks can push you above 80.'
                  : cv.atsScore >= 60
                    ? 'Moderate match. A few missing keywords may reduce visibility.'
                    : 'Low match. Consider addressing missing keywords below.'}
            </p>
            {cv.atsScore < 80 && cv.improvementTips && cv.improvementTips.length > 0 && (
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs font-semibold text-amber-800 mb-1.5">Tips to reach 80+</p>
                <ul className="space-y-1.5">
                  {cv.improvementTips.map((tip, i) => (
                    <li key={i} className="text-xs text-amber-700 flex gap-1.5">
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Keywords Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-green-700 mb-2">
              Keywords Added ({cv.keywordsAdded.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {cv.keywordsAdded.map((kw, i) => (
                <span key={i} className="ats-badge bg-green-100 text-green-800 border border-green-200">
                  {kw}
                </span>
              ))}
              {cv.keywordsAdded.length === 0 && (
                <span className="text-xs text-gray-400">None</span>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-red-700 mb-2">
              Keywords Missing ({cv.keywordsMissing.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {cv.keywordsMissing.map((kw, i) => (
                <span
                  key={i}
                  title="Consider adding these if applicable"
                  className="ats-badge bg-red-100 text-red-800 border border-red-200 cursor-help"
                >
                  {kw}
                </span>
              ))}
              {cv.keywordsMissing.length === 0 && (
                <span className="text-xs text-gray-400">None — great job!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CV Preview */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 space-y-5">
        <h3 className="text-lg font-bold text-gray-800">CV Preview</h3>

        {/* Header */}
        <div className="text-center border-b border-gray-300 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">{cv.contact.name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {[cv.contact.email, cv.contact.phone, cv.contact.location, cv.contact.linkedin, cv.contact.website]
              .filter(Boolean)
              .join(' | ')}
          </p>
        </div>

        {/* Summary */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Professional Summary</h4>
          <p className="text-sm text-gray-700">{cv.summary}</p>
        </div>

        {/* Experience */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Experience</h4>
          <div className="space-y-3">
            {cv.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <span className="text-sm font-semibold text-gray-800">{exp.title}</span>
                  <span className="text-xs text-gray-500">{exp.dates}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">
                  {[exp.company, exp.location].filter(Boolean).join(' — ')}
                </p>
                <ul className="list-disc list-inside space-y-0.5">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="text-xs text-gray-700">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Skills</h4>
          <p className="text-sm text-gray-700">{cv.skills.join(' • ')}</p>
        </div>

        {/* Education */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Education</h4>
          {cv.education.map((edu, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <span className="text-sm font-semibold text-gray-800">{edu.degree}</span>
                <span className="text-xs text-gray-500">{edu.dates}</span>
              </div>
              <p className="text-xs text-gray-500">
                {[edu.institution, edu.location].filter(Boolean).join(' — ')}
              </p>
              {edu.details && <p className="text-xs text-gray-600 mt-0.5">{edu.details}</p>}
            </div>
          ))}
        </div>

        {/* Certifications */}
        {cv.certifications && cv.certifications.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Certifications</h4>
            {cv.certifications.map((cert, i) => (
              <p key={i} className="text-sm text-gray-700">
                <span className="font-semibold">{cert.name}</span>
                {(cert.issuer || cert.date) && (
                  <span className="text-gray-500">
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
  )
})

export default ResultPreview
