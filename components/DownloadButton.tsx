'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

interface Props {
  docxBase64: string
  candidateName: string
  disabled?: boolean
}

export default function DownloadButton({ docxBase64, candidateName, disabled }: Props) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (isDownloading) return
    setIsDownloading(true)

    const filename = `${candidateName.replace(/\s+/g, '_')}_CV_Tailored.docx`

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docxBase64, filename }),
      })

      if (!response.ok) {
        throw new Error('Download request failed')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('CV downloaded successfully!')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Download failed'
      toast.error(message)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={disabled || isDownloading}
      className={`
        w-full py-3 px-6 rounded-xl font-semibold text-white text-sm transition-all duration-200
        ${disabled || isDownloading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700 active:scale-[0.99] shadow-md hover:shadow-lg'
        }
        sm:w-auto
      `}
    >
      {isDownloading ? (
        <span className="flex items-center gap-2 justify-center">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Preparing download...
        </span>
      ) : (
        'Download ATS-Optimized CV (.docx)'
      )}
    </button>
  )
}
