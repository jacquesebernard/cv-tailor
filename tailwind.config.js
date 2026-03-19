/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  'var(--color-brand-50,  #eff6ff)',
          100: 'var(--color-brand-100, #dbeafe)',
          200: 'var(--color-brand-200, #bfdbfe)',
          400: 'var(--color-brand-400, #60a5fa)',
          500: 'var(--color-brand-500, #2165bf)',
          600: 'var(--color-brand-600, #1d4ed8)',
          700: 'var(--color-brand-700, #1e3a5f)',
          900: 'var(--color-brand-900, #0d1b2e)',
        },
        surface: {
          base:  'var(--color-surface-base,  #f0f4fa)',
          card:  'var(--color-surface-card,  rgba(255,255,255,0.80))',
          glass: 'var(--color-surface-glass, rgba(255,255,255,0.70))',
          inset: 'var(--color-surface-inset, rgba(15,23,42,0.04))',
          dark:  'var(--color-surface-dark,  rgba(8,15,26,0.96))',
        },
        ink: {
          primary:   'var(--color-ink-primary,   #0f172a)',
          secondary: 'var(--color-ink-secondary,  #334155)',
          tertiary:  'var(--color-ink-tertiary,   #64748b)',
          inverse:   'var(--color-ink-inverse,    #f8fafc)',
          'on-dark': 'var(--color-ink-on-dark,    rgba(248,250,252,0.90))',
        },
        success: {
          50:  'var(--color-success-50,  #f0fdf4)',
          200: 'var(--color-success-200, #bbf7d0)',
          600: 'var(--color-success-600, #16a34a)',
          700: 'var(--color-success-700, #15803d)',
          900: 'var(--color-success-900, #14532d)',
        },
        warning: {
          50:  'var(--color-warning-50,  #fffbeb)',
          200: 'var(--color-warning-200, #fde68a)',
          600: 'var(--color-warning-600, #d97706)',
          800: 'var(--color-warning-800, #92400e)',
        },
        danger: {
          50:  'var(--color-danger-50,  #fef2f2)',
          200: 'var(--color-danger-200, #fecaca)',
          600: 'var(--color-danger-600, #dc2626)',
          700: 'var(--color-danger-700, #b91c1c)',
        },
      },
      boxShadow: {
        soft:          '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
        card:          '0 4px 16px -2px rgba(15,23,42,0.10), 0 2px 6px -1px rgba(15,23,42,0.06)',
        float:         '0 12px 40px -6px rgba(15,23,42,0.18), 0 4px 12px -2px rgba(15,23,42,0.10)',
        glow:          '0 0 0 3px rgba(33,101,191,0.20), 0 4px 16px -2px rgba(33,101,191,0.20)',
        'glow-success':'0 0 0 3px rgba(22,163,74,0.20),  0 4px 16px -2px rgba(22,163,74,0.15)',
        glass:         '0 8px 32px rgba(15,23,42,0.08), 0 2px 8px rgba(15,23,42,0.04), inset 0 1px 0 rgba(255,255,255,0.60)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        out:    'cubic-bezier(0, 0, 0.2, 1)',
      },
      transitionDuration: {
        250: '250ms',
        350: '350ms',
        450: '450ms',
      },
      animation: {
        'fade-up':    'fade-up 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
        'scale-in':   'scale-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
        'slide-in':   'slide-in 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-ring': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
