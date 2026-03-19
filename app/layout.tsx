import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  title: 'CV Tailor — ATS-Optimized CV Rewriter',
  description: 'Rewrite your CV to match any job description using AI. Get an ATS-optimized DOCX in seconds.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              fontSize: '14px',
              background: 'rgba(255,255,255,0.90)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.45)',
              color: '#0f172a',
              boxShadow: '0 8px 32px rgba(15,23,42,0.12), 0 2px 8px rgba(15,23,42,0.06)',
            },
          }}
        />
      </body>
    </html>
  )
}
