import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DownloadButton from '../../components/DownloadButton'

// Mock react-hot-toast to avoid rendering issues
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}))

// Minimal valid base64-encoded DOCX (just enough bytes to pass atob)
const FAKE_BASE64 = btoa('fake-docx-content')

describe('DownloadButton', () => {
  it('renders the download button', () => {
    render(<DownloadButton docxBase64={FAKE_BASE64} candidateName="Jane Doe" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText(/Download ATS-Optimized CV/i)).toBeInTheDocument()
  })

  it('is disabled when the disabled prop is set', () => {
    render(<DownloadButton docxBase64={FAKE_BASE64} candidateName="Jane Doe" disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('triggers a download when clicked', async () => {
    // Mock URL APIs used in the download flow
    const createObjectURL = jest.fn(() => 'blob:fake-url')
    const revokeObjectURL = jest.fn()
    global.URL.createObjectURL = createObjectURL
    global.URL.revokeObjectURL = revokeObjectURL

    // Render first so document.body.appendChild is used by React's render
    render(<DownloadButton docxBase64={FAKE_BASE64} candidateName="Jane Doe" />)

    // Now spy on appendChild/removeChild for the download anchor
    const click = jest.fn()
    const appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(node => {
      ;(node as HTMLAnchorElement).click = click
      return node
    })
    const removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(node => node)

    await userEvent.click(screen.getByRole('button'))

    expect(createObjectURL).toHaveBeenCalled()
    expect(click).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:fake-url')

    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })
})
