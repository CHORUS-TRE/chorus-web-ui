import { fireEvent, render, screen } from '@testing-library/react'

import type { FileSystemItem } from '@/types/file-system'

import { RequestQueue } from '../request-queue'

jest.mock('next/navigation', () => ({
  useParams: () => ({ workspaceId: 'ws-1' })
}))

jest.mock('../../../stores/app-state-store', () => ({
  useAppState: () => ({
    workspaces: [{ id: 'ws-2', name: 'Project Alpha' }]
  })
}))

const downloadItem: FileSystemItem = {
  id: 'file-1',
  name: 'report.pdf',
  type: 'file',
  parentId: 'root',
  path: '/report.pdf',
  size: 2048,
  modifiedAt: new Date('2026-01-01T00:00:00Z'),
  owner: 'user-1'
}

const transferItem: FileSystemItem = {
  id: 'file-2',
  name: 'logo.png',
  type: 'file',
  parentId: 'root',
  path: '/logo.png',
  size: 4096,
  modifiedAt: new Date('2026-01-01T00:00:00Z'),
  owner: 'user-1'
}

const noop = () => undefined

function renderRequestQueue(
  overrides: Partial<React.ComponentProps<typeof RequestQueue>> = {}
) {
  return render(
    <RequestQueue
      downloadItems={[]}
      transferItems={[]}
      onRemoveDownloadItem={noop}
      onRemoveTransferItem={noop}
      onClearDownload={noop}
      onClearTransfer={noop}
      onSubmitDownload={noop}
      onSubmitTransfer={noop}
      {...overrides}
    />
  )
}

describe('RequestQueue', () => {
  it('shows the empty state when both queues are empty', () => {
    renderRequestQueue()

    expect(screen.getByText('No files added yet')).toBeInTheDocument()
  })

  it('groups items into Download and Transfer sections with a combined badge count', () => {
    renderRequestQueue({
      downloadItems: [downloadItem],
      transferItems: [transferItem]
    })

    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Download')).toBeInTheDocument()
    expect(screen.getByText('Transfer')).toBeInTheDocument()
    expect(screen.getByText('report.pdf')).toBeInTheDocument()
    expect(screen.getByText('logo.png')).toBeInTheDocument()
  })

  it('calls onRemoveDownloadItem when a download item is removed', () => {
    const onRemoveDownloadItem = jest.fn()
    renderRequestQueue({
      downloadItems: [downloadItem],
      onRemoveDownloadItem
    })

    fireEvent.click(screen.getByRole('button', { name: 'Remove report.pdf' }))

    expect(onRemoveDownloadItem).toHaveBeenCalledWith('file-1')
  })

  it('calls onClearDownload when Cancel is clicked in the download queue list', () => {
    const onClearDownload = jest.fn()
    renderRequestQueue({
      downloadItems: [downloadItem],
      onClearDownload
    })

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onClearDownload).toHaveBeenCalled()
  })

  it('opens the download queue form and calls onSubmitDownload after entering justification', () => {
    const onSubmitDownload = jest.fn()
    renderRequestQueue({
      downloadItems: [downloadItem],
      onSubmitDownload
    })

    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }))

    fireEvent.change(screen.getByLabelText(/justification/i), {
      target: { value: 'Needed for analysis' }
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }))

    expect(onSubmitDownload).toHaveBeenCalledWith(
      [downloadItem],
      'Needed for analysis'
    )
  })

  it('cancelling the download form returns to the list without submitting', () => {
    const onSubmitDownload = jest.fn()
    renderRequestQueue({
      downloadItems: [downloadItem],
      onSubmitDownload
    })

    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }))
    expect(screen.getByLabelText(/justification/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByLabelText(/justification/i)).not.toBeInTheDocument()
    expect(onSubmitDownload).not.toHaveBeenCalled()
  })

  it('disables the transfer form submit until a target workspace is chosen', () => {
    renderRequestQueue({
      transferItems: [transferItem]
    })

    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }))

    fireEvent.change(screen.getByLabelText(/justification/i), {
      target: { value: 'Needed for collaboration' }
    })

    expect(
      screen.getByRole('button', { name: 'Submit request' })
    ).toBeDisabled()
  })

  it('download and transfer queues submit independently', () => {
    const onSubmitDownload = jest.fn()
    const onSubmitTransfer = jest.fn()
    renderRequestQueue({
      downloadItems: [downloadItem],
      transferItems: [transferItem],
      onSubmitDownload,
      onSubmitTransfer
    })

    const submitButtons = screen.getAllByRole('button', {
      name: 'Submit request'
    })
    fireEvent.click(submitButtons[0])

    fireEvent.change(screen.getByLabelText(/justification/i), {
      target: { value: 'Needed for analysis' }
    })
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Submit request' })[0]
    )

    expect(onSubmitDownload).toHaveBeenCalledWith(
      [downloadItem],
      'Needed for analysis'
    )
    expect(onSubmitTransfer).not.toHaveBeenCalled()
  })
})
