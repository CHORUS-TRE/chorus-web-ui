import { act, fireEvent, render, screen } from '@testing-library/react'

import { WorkbenchUpdateForm } from '@/components/forms/workbench-update-form'
import { Workbench, WorkbenchStatus } from '@/domain/model'
import { readSessionSettings } from '@/lib/session-settings'
import {
  downloadXpraFile,
  getXpraSessionInfo,
  hasXpraBridge,
  reconnectXpraSession,
  setXpraAudio,
  uploadXpraFile
} from '@/lib/xpra-session-registry'

jest.mock('../../../view-model/workbench-view-model', () => ({
  workbenchUpdate: jest.fn(async () => ({ data: { id: '42', name: 'S' } }))
}))

jest.mock('../../../lib/xpra-session-registry', () => ({
  ...jest.requireActual('../../../lib/xpra-session-registry'),
  setXpraKeyboard: jest.fn(),
  setXpraAudio: jest.fn(),
  hasXpraBridge: jest.fn(() => true),
  uploadXpraFile: jest.fn(),
  downloadXpraFile: jest.fn(),
  getXpraSessionInfo: jest.fn(),
  reconnectXpraSession: jest.fn()
}))

const workbench: Workbench = {
  id: '42',
  name: 'My session',
  description: 'notes',
  status: WorkbenchStatus.ACTIVE,
  workspaceId: '7'
}

function renderForm() {
  return render(
    <WorkbenchUpdateForm state={[true, jest.fn()]} workbench={workbench} />
  )
}

describe('WorkbenchUpdateForm', () => {
  beforeEach(() => localStorage.clear())

  it('shows the settings tabs', () => {
    renderForm()

    expect(screen.getByRole('tab', { name: 'Session' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Display' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Transfer' })).toBeInTheDocument()
  })

  it('opens on the Session tab with the existing fields', () => {
    renderForm()

    expect(screen.getByLabelText('Name')).toHaveValue('My session')
    expect(screen.getByLabelText('Description')).toHaveValue('notes')
  })
})

describe('Display tab', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('persists the encoding', () => {
    renderForm()
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Display' }))

    fireEvent.change(screen.getByLabelText('Encoding'), {
      target: { value: 'jpeg' }
    })

    expect(readSessionSettings('42').encoding).toBe('jpeg')
  })

  it('persists the bandwidth limit as a number', () => {
    renderForm()
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Display' }))

    fireEvent.change(screen.getByLabelText('Bandwidth limit'), {
      target: { value: '10000000' }
    })

    expect(readSessionSettings('42').bandwidthLimit).toBe(10_000_000)
  })

  it('persists offscreen decoding', () => {
    renderForm()
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Display' }))

    fireEvent.click(screen.getByLabelText('Offscreen decoding'))

    expect(readSessionSettings('42').offscreen).toBe(false)
  })
})

describe('Transfer tab', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('applies audio live and persists it', () => {
    renderForm()
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Transfer' }))

    fireEvent.click(screen.getByLabelText('Audio forwarding'))

    expect(setXpraAudio).toHaveBeenCalledWith('42', false)
    expect(readSessionSettings('42').audio).toBe(false)
  })

  it('persists file transfers without touching the bridge', () => {
    renderForm()
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Transfer' }))

    fireEvent.click(screen.getByLabelText('File transfers'))

    expect(readSessionSettings('42').fileTransfer).toBe(false)
    expect(setXpraAudio).not.toHaveBeenCalled()
  })

  it('persists printing', () => {
    renderForm()
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Transfer' }))

    fireEvent.click(screen.getByLabelText('Printing'))

    expect(readSessionSettings('42').printing).toBe(false)
  })
})

describe('session actions', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    ;(hasXpraBridge as jest.Mock).mockReturnValue(true)
  })

  it('uploads through the bridge', () => {
    renderForm()
    fireEvent.click(screen.getByRole('button', { name: 'Upload file' }))
    expect(uploadXpraFile).toHaveBeenCalledWith('42')
  })

  it('downloads through the bridge', () => {
    renderForm()
    fireEvent.click(screen.getByRole('button', { name: 'Download file' }))
    expect(downloadXpraFile).toHaveBeenCalledWith('42')
  })

  it('reconnects through the bridge', () => {
    renderForm()
    fireEvent.click(screen.getByRole('button', { name: 'Reconnect' }))
    expect(reconnectXpraSession).toHaveBeenCalledWith('42')
  })

  it('shows the session info the bridge reports', () => {
    ;(getXpraSessionInfo as jest.Mock).mockReturnValue({
      endpoint: 'backend.example.com',
      display: ':100',
      platform: 'linux',
      connectedSince: '1700000000'
    })

    renderForm()
    fireEvent.click(screen.getByRole('button', { name: 'Session info' }))

    expect(screen.getByText('backend.example.com')).toBeInTheDocument()
    expect(screen.getByText(':100')).toBeInTheDocument()
  })

  it('disables every action when no bridge is available', () => {
    ;(hasXpraBridge as jest.Mock).mockReturnValue(false)

    renderForm()

    expect(screen.getByRole('button', { name: 'Upload file' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Download file' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Reconnect' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Session info' })).toBeDisabled()
  })

  it('re-enables the actions once the bridge appears', () => {
    jest.useFakeTimers()
    try {
      ;(hasXpraBridge as jest.Mock).mockReturnValue(false)

      renderForm()

      expect(screen.getByRole('button', { name: 'Upload file' })).toBeDisabled()
      ;(hasXpraBridge as jest.Mock).mockReturnValue(true)

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(
        screen.getByRole('button', { name: 'Upload file' })
      ).not.toBeDisabled()
    } finally {
      jest.useRealTimers()
    }
  })

  it('shows a fallback when the bridge has no session info yet', () => {
    ;(getXpraSessionInfo as jest.Mock).mockReturnValue(undefined)

    renderForm()

    expect(
      screen.queryByText(/session information is not available/i)
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Session info' }))

    expect(
      screen.getByText('Session information is not available yet.')
    ).toBeInTheDocument()
  })
})

describe('reconnect warning', () => {
  const WARNING = /reconnects the session/i

  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('is hidden when nothing has changed', () => {
    renderForm()
    expect(screen.queryByText(WARNING)).not.toBeInTheDocument()
  })

  it('appears when an init setting changes', () => {
    renderForm()
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Display' }))
    fireEvent.change(screen.getByLabelText('Encoding'), {
      target: { value: 'jpeg' }
    })

    expect(screen.getByText(WARNING)).toBeInTheDocument()
  })

  it('stays hidden when only a live setting changes', () => {
    renderForm()
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Transfer' }))
    fireEvent.click(screen.getByLabelText('Audio forwarding'))

    expect(screen.queryByText(WARNING)).not.toBeInTheDocument()
  })

  it('resets the baseline on a genuine reopen of the same instance', () => {
    // A real close/reopen, not an unmount/remount: the dialog is controlled
    // (open is a prop), so the component instance persists and any local
    // state must be re-derived from `open` flipping, not reset by React
    // discarding and recreating the component.
    const { rerender } = render(
      <WorkbenchUpdateForm state={[true, jest.fn()]} workbench={workbench} />
    )

    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Display' }))
    fireEvent.change(screen.getByLabelText('Encoding'), {
      target: { value: 'jpeg' }
    })
    expect(screen.getByText(WARNING)).toBeInTheDocument()

    // Cancel: closes without reverting the setting, which persisted to
    // localStorage the moment it was changed.
    rerender(
      <WorkbenchUpdateForm state={[false, jest.fn()]} workbench={workbench} />
    )

    // Reopen. The baseline must reset to the now-current settings on this
    // very first render of the reopen — not one tick later — so the
    // warning must already be gone here, with no further act()/flush.
    rerender(
      <WorkbenchUpdateForm state={[true, jest.fn()]} workbench={workbench} />
    )

    expect(screen.queryByText(WARNING)).not.toBeInTheDocument()
  })
})
