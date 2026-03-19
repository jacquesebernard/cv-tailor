'use client'

import { useState } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
}

type TabType = 'paste' | 'url'

export default function JobInput({ value, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('paste')

  const handleTabSwitch = (tab: TabType) => {
    setActiveTab(tab)
    onChange('')
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-ink-secondary">Job Description</label>

      {/* Pill tab switcher */}
      <div
        className="flex p-1 rounded-2xl gap-1"
        style={{ background: 'rgba(15,23,42,0.06)' }}
      >
        {(['paste', 'url'] as const).map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => handleTabSwitch(tab)}
            className={`
              flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-250 ease-spring min-h-[40px]
              ${activeTab === tab
                ? 'bg-white text-ink-primary shadow-soft'
                : 'text-ink-tertiary hover:text-ink-secondary'
              }
            `}
          >
            {tab === 'paste' ? 'Paste Text' : 'Job URL'}
          </button>
        ))}
      </div>

      {activeTab === 'paste' ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={8}
          placeholder="Paste the full job description here..."
          className="input-glass w-full p-3.5 text-sm resize-y"
        />
      ) : (
        <div className="space-y-1.5">
          <input
            type="url"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="https://jobs.example.com/position/..."
            className="input-glass w-full p-3.5 text-sm"
          />
          <p className="text-xs text-ink-tertiary">We&apos;ll extract the job description from the page</p>
        </div>
      )}
    </div>
  )
}
