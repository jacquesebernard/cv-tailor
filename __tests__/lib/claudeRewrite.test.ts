// Mock the AI provider so tests don't call the real Claude API
jest.mock('../../lib/ai', () => ({
  getAIProvider: jest.fn(),
}))

import { rewriteCvWithClaude } from '../../lib/claudeRewrite'
import { getAIProvider } from '../../lib/ai'
import { RewrittenCV } from '../../types/cv'

const mockRewrittenCV: RewrittenCV = {
  contact: { name: 'Jane Doe', email: 'jane@example.com', phone: '555-0100' },
  summary: 'Experienced software engineer.',
  experience: [
    {
      title: 'Senior Engineer',
      company: 'Acme Corp',
      dates: '2020–Present',
      bullets: ['Led platform migration', 'Reduced latency by 40%'],
    },
  ],
  skills: ['TypeScript', 'React', 'Node.js'],
  education: [{ degree: 'BSc Computer Science', institution: 'State University', dates: '2016–2020' }],
  atsScore: 85,
  keywordsAdded: ['TypeScript', 'React'],
  keywordsMissing: [],
  improvementTips: [],
}

describe('rewriteCvWithClaude', () => {
  it('delegates to the AI provider and returns the result', async () => {
    const mockRewriteCV = jest.fn().mockResolvedValue(mockRewrittenCV)
    ;(getAIProvider as jest.Mock).mockReturnValue({ rewriteCV: mockRewriteCV })

    const result = await rewriteCvWithClaude('cv text', 'job description')

    expect(mockRewriteCV).toHaveBeenCalledWith('cv text', 'job description')
    expect(result).toEqual(mockRewrittenCV)
  })

  it('propagates errors from the AI provider', async () => {
    const mockRewriteCV = jest.fn().mockRejectedValue(new Error('Unable to process AI response'))
    ;(getAIProvider as jest.Mock).mockReturnValue({ rewriteCV: mockRewriteCV })

    await expect(rewriteCvWithClaude('cv text', 'job description')).rejects.toThrow(
      'Unable to process AI response'
    )
  })
})
