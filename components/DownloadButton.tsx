'use client'

import { useState, memo } from 'react'
import toast from 'react-hot-toast'

interface Props {
  docxBase64: string
  candidateName: string
  disabled?: boolean
}

/**
 * Button that decodes a base64-encoded DOCX and triggers a browser download.
 * Decoding is done entirely client-side — no API round-trip required.
 */
const DownloadButton = memo(function DownloadButton({ docxBase64, candidateName, disabled }: Props) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = () => {
    if (isDownloading) return
    setIsDownloading(true)

    const filename = `${candidateName.replace(/\s+/g, '_')}_CV_Tailored.docx`

    try {
      const binaryString = atob(docxBase64)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      const blob = new Blob([bytes], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })
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

  const isDisabled = disabled || isDownloading

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isDisabled}
      className={`
        w-full py-4 px-8 rounded-2xl font-bold text-base min-h-[44px] transition-all duration-350 ease-spring sm:w-auto
        ${isDisabled
          ? 'text-ink-tertiary cursor-not-allowed'
          : 'text-white shadow-card hover:shadow-float hover:-translate-y-1 active:translate-y-0 active:shadow-card'
        }
      `}
      style={
        isDisabled
          ? { background: 'rgba(100,116,139,0.20)' }
          : { background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }
      }
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
        <span className="flex items-center gap-2 justify-center">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
          </svg>
          Download ATS-Optimized CV (.docx)
        </span>
      )}
    </button>
  )
})

export default DownloadButton
