import { fireEvent, render, screen } from '@testing-library/react'

import { WorkbenchUpdateForm } from '@/components/forms/workbench-update-form'
import { Workbench, WorkbenchStatus } from '@/domain/model'
import { readSessionSettings } from '@/lib/session-settings'

jest.mock('../../../view-model/workbench-view-model', () => ({
  workbenchUpdate: jest.fn(async () => ({ data: { id: '42', name: 'S' } }))
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
