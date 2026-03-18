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
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">Job Description</label>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => handleTabSwitch('paste')}
          className={`px-4 py-2 text-sm font-medium transition-colors min-h-[44px] ${
            activeTab === 'paste'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Paste Text
        </button>
        <button
          type="button"
          onClick={() => handleTabSwitch('url')}
          className={`px-4 py-2 text-sm font-medium transition-colors min-h-[44px] ${
            activeTab === 'url'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Job URL
        </button>
      </div>

      {activeTab === 'paste' ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={8}
          placeholder="Paste the full job description here..."
          className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
        />
      ) : (
        <div className="space-y-1">
          <input
            type="url"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="https://jobs.example.com/position/..."
            className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-xs text-gray-500">We&apos;ll extract the job description from the page</p>
        </div>
      )}
    </div>
  )
}
