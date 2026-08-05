import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { FeedbackProvider, useFeedback } from '../feedback-provider'

let mockPathname = '/apps'

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname
}))

jest.mock('../../../providers/authentication-provider', () => ({
  useAuthentication: () => ({
    user: {
      id: 'user-1',
      firstName: 'Ada',
      lastName: 'Lovelace',
      username: 'ada',
      workspaceId: 'workspace-1'
    }
  })
}))

jest.mock('../../../view-model/feedback-view-model', () => ({
  submitFeedback: jest.fn()
}))

function TestControls() {
  const feedback = useFeedback()
  return (
    <button data-feedback-ui type="button" onClick={feedback.toggle}>
      {feedback.active ? 'Disable' : 'Enable'}
    </button>
  )
}

describe('FeedbackProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    mockPathname = '/apps'
  })

  it('is available on admin pages', () => {
    mockPathname = '/admin/feedback'
    render(
      <FeedbackProvider>
        <TestControls />
        <main>Admin feedback</main>
      </FeedbackProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /enable/i }))

    expect(document.body).toHaveAttribute('data-feedback-mode', 'active')
    expect(
      screen.queryByPlaceholderText('What should change here?')
    ).not.toBeInTheDocument()
  })

  it('restores a pin when its target mounts after navigation', async () => {
    localStorage.setItem(
      'chorus.feedback.draft.user-1',
      JSON.stringify([
        {
          id: 'feedback-after-navigation',
          path: '/apps',
          sel: '#late-target',
          ox: 0.5,
          oy: 0.5,
          label: 'Late target',
          text: 'Persistent feedback'
        }
      ])
    )
    mockPathname = '/workspaces'
    const view = render(
      <FeedbackProvider>
        <TestControls />
        <main />
      </FeedbackProvider>
    )

    mockPathname = '/apps'
    view.rerender(
      <FeedbackProvider>
        <TestControls />
        <main />
      </FeedbackProvider>
    )
    expect(
      screen.queryByRole('button', { name: 'Edit feedback 1' })
    ).not.toBeInTheDocument()

    view.rerender(
      <FeedbackProvider>
        <TestControls />
        <main>
          <div id="late-target">Late target</div>
        </main>
      </FeedbackProvider>
    )

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Edit feedback 1' })
      ).toBeVisible()
    )
  })

  it('keeps saved pins visible when feedback mode is inactive', () => {
    render(
      <FeedbackProvider>
        <TestControls />
        <main>
          <button type="button">Target</button>
        </main>
      </FeedbackProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /enable/i }))
    expect(
      screen.queryByPlaceholderText('What should change here?')
    ).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Target' }), {
      clientX: 20,
      clientY: 20
    })
    expect(
      screen.getByRole('button', { name: /Review comments/ })
    ).toBeVisible()
    fireEvent.change(screen.getByPlaceholderText('What should change here?'), {
      target: { value: 'Improve this action' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(
      screen.getByRole('button', { name: 'Edit feedback 1' })
    ).toBeVisible()
    expect(screen.getByRole('button', { name: /enable/i })).toBeVisible()
    expect(
      screen.getByRole('button', { name: 'Edit feedback 1' })
    ).toBeVisible()
    expect(
      JSON.parse(localStorage.getItem('chorus.feedback.draft.user-1')!)[0]
    ).toMatchObject({ path: '/apps' })
  })

  it('toggles the feedback picker with Command+K', () => {
    render(
      <FeedbackProvider>
        <TestControls />
        <main>Page content</main>
      </FeedbackProvider>
    )

    const page = screen.getByText('Page content')
    jest.spyOn(page, 'getBoundingClientRect').mockReturnValue({
      bottom: 600,
      height: 500,
      left: 100,
      right: 700,
      top: 100,
      width: 600,
      x: 100,
      y: 100,
      toJSON: () => ({})
    })
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: jest.fn(() => page)
    })
    fireEvent.mouseMove(document, { clientX: 400, clientY: 300 })
    fireEvent.keyDown(document, { key: 'k', metaKey: true })

    expect(
      screen.queryByPlaceholderText('What should change here?')
    ).not.toBeInTheDocument()
    expect(document.querySelector('[data-feedback-picker-target]')).toHaveStyle(
      {
        left: '100px',
        top: '100px',
        width: '600px',
        height: '500px'
      }
    )
    expect(document.body).toHaveAttribute('data-feedback-mode', 'active')

    fireEvent.keyDown(document, { key: 'k', metaKey: true })

    expect(
      screen.queryByPlaceholderText('What should change here?')
    ).not.toBeInTheDocument()
    expect(document.body).not.toHaveAttribute('data-feedback-mode')
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: undefined
    })
  })

  it('keeps Send feedback enabled, hides selectors, and confirms Clear', () => {
    localStorage.setItem(
      'chorus.feedback.draft.user-1',
      JSON.stringify([
        {
          id: 'feedback-1',
          path: '/apps',
          sel: '#feedback-target',
          ox: 0.5,
          oy: 0.5,
          label: 'Target',
          text: 'Existing feedback'
        }
      ])
    )
    const confirm = jest.spyOn(window, 'confirm').mockReturnValue(false)

    render(
      <FeedbackProvider>
        <TestControls />
        <main id="feedback-target">Page content</main>
      </FeedbackProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /enable/i }))
    fireEvent.mouseDown(
      screen.getByRole('button', { name: 'Edit feedback 1' }),
      { clientX: 20, clientY: 20 }
    )
    fireEvent.mouseUp(document, { clientX: 20, clientY: 20 })
    const review = screen.getByRole('button', { name: /Review comments/ })
    expect(review).toBeEnabled()
    fireEvent.click(review)

    expect(screen.queryByText('#feedback-target')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Edit comment 1' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Comment 1' }), {
      target: { value: 'Updated feedback' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(screen.getByText('Updated feedback')).toBeVisible()
    expect(
      JSON.parse(localStorage.getItem('chorus.feedback.draft.user-1')!)[0]
    ).toMatchObject({ text: 'Updated feedback' })

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }))
    expect(confirm).toHaveBeenCalledWith(
      'Clear all feedback comments? This action cannot be undone.'
    )
    expect(screen.getByText('Updated feedback')).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'Delete comment 1' }))
    expect(screen.queryByText('Updated feedback')).not.toBeInTheDocument()
    expect(localStorage.getItem('chorus.feedback.draft.user-1')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Later' }))
    expect(screen.queryByText('Send feedback')).not.toBeInTheDocument()
    confirm.mockRestore()
  })

  it('reviews comments from multiple pages in one submission', () => {
    const view = render(
      <FeedbackProvider>
        <TestControls />
        <button type="button">Apps target</button>
      </FeedbackProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /enable/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Apps target' }))
    fireEvent.change(screen.getByPlaceholderText('What should change here?'), {
      target: { value: 'Apps comment' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    mockPathname = '/workspaces'
    view.rerender(
      <FeedbackProvider>
        <TestControls />
        <button type="button">Workspaces target</button>
      </FeedbackProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: /enable/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Workspaces target' }))
    fireEvent.change(screen.getByPlaceholderText('What should change here?'), {
      target: { value: 'Workspaces comment' }
    })
    fireEvent.click(screen.getByRole('button', { name: /Review comments/ }))

    expect(screen.getByText(/2 comments across 2 pages/i)).toBeVisible()
    expect(screen.getByText('/apps')).toBeVisible()
    expect(screen.getByText('/workspaces')).toBeVisible()
    expect(screen.getByText('Apps comment')).toBeVisible()
    expect(screen.getByText('Workspaces comment')).toBeVisible()
  })

  it('turns feedback mode off from the composer close button', () => {
    render(
      <FeedbackProvider>
        <TestControls />
        <button type="button">Target</button>
      </FeedbackProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /enable/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Target' }))
    fireEvent.click(screen.getByRole('button', { name: 'Close feedback mode' }))

    expect(screen.getByRole('button', { name: /enable/i })).toBeVisible()
    expect(
      screen.queryByPlaceholderText('What should change here?')
    ).not.toBeInTheDocument()
  })
})
