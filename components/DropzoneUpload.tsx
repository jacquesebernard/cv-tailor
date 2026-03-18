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

  return (
    <div className="space-y-3">
      <label htmlFor="cv-upload" className="block text-sm font-semibold text-gray-700">Your CV</label>

      {!showTextarea ? (
        <div
          {...getRootProps()}
          id="cv-upload"
          role="button"
          aria-label="Upload CV file — drag and drop or click to browse"
          tabIndex={0}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
            ${isDragActive
              ? 'border-blue-400 bg-blue-50'
              : acceptedFileName
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
            }
          `}
        >
          <input {...getInputProps()} />
          {acceptedFileName ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">✅</span>
              <p className="text-sm font-medium text-green-700">{acceptedFileName}</p>
              <p className="text-xs text-green-600">File ready for processing</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">📄</span>
              <p className="text-sm font-medium text-gray-700">
                {isDragActive ? 'Drop your CV here...' : 'Drop your CV here or click to browse'}
              </p>
              <p className="text-xs text-gray-500">Supports PDF, DOCX, TXT — max 5MB</p>
            </div>
          )}
        </div>
      ) : (
        <textarea
          value={pastedText}
          onChange={handleTextChange}
          rows={6}
          placeholder="Paste your CV text here..."
          className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
        />
      )}

      {fileRejections.length > 0 && (
        <p className="text-xs text-red-500">
          {fileRejections[0].errors[0].code === 'file-too-large'
            ? 'File is too large. Maximum size is 5MB.'
            : 'Unsupported file type. Please use PDF, DOCX, or TXT.'}
        </p>
      )}

      <button
        type="button"
        onClick={toggleTextarea}
        className="text-xs text-blue-600 hover:text-blue-800 underline min-h-[44px]"
      >
        {showTextarea ? 'Upload a file instead' : 'Or paste your CV text instead'}
      </button>
    </div>
  )
})

export default DropzoneUpload
