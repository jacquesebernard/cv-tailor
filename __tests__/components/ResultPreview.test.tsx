import { render, screen } from '@testing-library/react'
import ResultPreview from '../../components/ResultPreview'
import { RewrittenCV } from '../../types/cv'

const mockCV: RewrittenCV = {
  contact: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '555-0100',
    location: 'San Francisco, CA',
  },
  summary: 'Experienced software engineer with 8 years building scalable systems.',
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'Acme Corp',
      dates: '2020–Present',
      location: 'San Francisco, CA',
      bullets: ['Led migration to microservices', 'Reduced API latency by 40%'],
    },
  ],
  skills: ['TypeScript', 'React', 'Node.js', 'AWS'],
  education: [
    {
      degree: 'BSc Computer Science',
      institution: 'State University',
      dates: '2016–2020',
    },
  ],
  atsScore: 82,
  keywordsAdded: ['TypeScript', 'microservices'],
  keywordsMissing: ['Kubernetes'],
  improvementTips: [],
}

describe('ResultPreview', () => {
  it('renders the ATS score', () => {
    render(<ResultPreview cv={mockCV} />)
    expect(screen.getByText('82')).toBeInTheDocument()
  })

  it('renders the candidate name', () => {
    render(<ResultPreview cv={mockCV} />)
    expect(screen.getByText('Jane Doe')).toBeInTheDocument()
  })

  it('renders the professional summary', () => {
    render(<ResultPreview cv={mockCV} />)
    expect(screen.getByText(/Experienced software engineer/i)).toBeInTheDocument()
  })

  it('renders keywords added', () => {
    render(<ResultPreview cv={mockCV} />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('microservices')).toBeInTheDocument()
  })

  it('renders keywords missing', () => {
    render(<ResultPreview cv={mockCV} />)
    expect(screen.getByText('Kubernetes')).toBeInTheDocument()
  })

  it('renders experience entries', () => {
    render(<ResultPreview cv={mockCV} />)
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument()
    expect(screen.getByText(/Acme Corp/i)).toBeInTheDocument()
  })

  it('renders education entries', () => {
    render(<ResultPreview cv={mockCV} />)
    expect(screen.getByText('BSc Computer Science')).toBeInTheDocument()
  })

  it('renders skills section', () => {
    render(<ResultPreview cv={mockCV} />)
    // Skills are rendered inline as "TypeScript • React • Node.js • AWS"
    expect(screen.getByText(/TypeScript • React/)).toBeInTheDocument()
  })
})
