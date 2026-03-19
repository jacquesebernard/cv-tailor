'use client'

import { useState, useCallback, memo } from 'react'
import { useDropzone } from 'react-dropzone'
import { MAX_FILE_SIZE } from '../lib/constants'

interface Props {
  onFileAccepted: (file: File) => void
  onTextFallback: (text: string) => void
}

const DropzoneUpload = memo(function DropzoneUpload({ onFileAccepted, onTextFallback }: Props) {
  const [acceptedFileName, setAcceptedFileName] = useState<string | null>(null)
  const [showTextarea, setShowTextarea] = useState(false)
  const [pastedText, setPastedText] = useState('')

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setAcceptedFileName(file.name)
        onFileAccepted(file)
        setShowTextarea(false)
        setPastedText('')
      }
    },
    [onFileAccepted]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  })

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setPastedText(text)
    onTextFallback(text)
    if (text.length > 0) {
      setAcceptedFileName(null)
    }
  }

  const toggleTextarea = () => {
    setShowTextarea(prev => !prev)
    if (!showTextarea) {
      setAcceptedFileName(null)
    }
  }

  const dropzoneClass = [
    'border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-350 ease-spring',
    isDragActive
      ? 'border-brand-400 bg-brand-50/40 shadow-glow scale-[1.015]'
      : acceptedFileName
        ? 'border-success-600/60 bg-success-50/40 shadow-glow-success'
        : 'border-ink-tertiary/25 bg-surface-inset hover:border-brand-400/60 hover:bg-brand-50/20 hover:shadow-card hover:scale-[1.005]',
  ].join(' ')

  return (
    <div className="space-y-3">
      <label htmlFor="cv-upload" className="block text-sm font-semibold text-ink-secondary">Your CV</label>

      {!showTextarea ? (
        <div
          {...getRootProps()}
          id="cv-upload"
          role="button"
          aria-label="Upload CV file — drag and drop or click to browse"
          tabIndex={0}
          className={dropzoneClass}
        >
          <input {...getInputProps()} />
          {acceptedFileName ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-success-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-success-700">{acceptedFileName}</p>
              <p className="text-xs text-success-600">File ready for processing</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-100/60 flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-ink-secondary">
                {isDragActive ? 'Drop your CV here...' : 'Drop your CV here or click to browse'}
              </p>
              <p className="text-xs text-ink-tertiary">Supports PDF, DOCX, TXT — max 5MB</p>
            </div>
          )}
        </div>
      ) : (
        <textarea
          value={pastedText}
          onChange={handleTextChange}
          rows={6}
          placeholder="Paste your CV text here..."
          className="input-glass w-full p-3.5 text-sm resize-y min-h-[120px]"
        />
      )}

      {fileRejections.length > 0 && (
        <p className="text-xs text-danger-600 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
          </svg>
          {fileRejections[0].errors[0].code === 'file-too-large'
            ? 'File is too large. Maximum size is 5MB.'
            : 'Unsupported file type. Please use PDF, DOCX, or TXT.'}
        </p>
      )}

      <button
        type="button"
        onClick={toggleTextarea}
        className="text-xs text-brand-500 hover:text-brand-600 font-medium underline decoration-brand-400/40 underline-offset-2 transition-colors duration-200 min-h-[44px]"
      >
        {showTextarea ? 'Upload a file instead' : 'Or paste your CV text instead'}
      </button>
    </div>
  )
})

export default DropzoneUpload
