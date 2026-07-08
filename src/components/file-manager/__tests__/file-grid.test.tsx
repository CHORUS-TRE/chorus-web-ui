import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'

import type { FileSystemItem } from '@/types/file-system'

import { FileGrid } from '../file-grid'

// Radix DropdownMenu needs these two DOM APIs, which jsdom doesn't implement.
beforeAll(() => {
  Element.prototype.hasPointerCapture = jest.fn()
  Element.prototype.scrollIntoView = jest.fn()
})

const baseItem: FileSystemItem = {
  id: 'file-1',
  name: 'report.pdf',
  type: 'file',
  parentId: 'root',
  path: '/report.pdf',
  size: 1024,
  modifiedAt: new Date('2026-01-01T00:00:00Z'),
  owner: 'user-1'
}

const noop = () => undefined

function renderGrid(overrides: Partial<ComponentProps<typeof FileGrid>> = {}) {
  return render(
    <FileGrid
      items={[baseItem]}
      selectedItems={[]}
      viewMode="list"
      onSelectItem={noop}
      onSelectRange={noop}
      onSelectAll={noop}
      onClearSelection={noop}
      onNavigateToFolder={noop}
      onMoveItem={noop}
      onDownload={noop}
      onTransfer={noop}
      onDelete={noop}
      onRename={noop}
      downloadQueueItems={[]}
      transferQueueItems={[]}
      {...overrides}
    />
  )
}

describe('FileGrid list view row actions', () => {
  it('calls onDownload when the Download button is clicked', () => {
    const onDownload = jest.fn()
    renderGrid({ onDownload })

    fireEvent.click(screen.getByRole('button', { name: /download/i }))

    expect(onDownload).toHaveBeenCalledWith('file-1')
  })

  it('calls onTransfer when the Transfer button is clicked', () => {
    const onTransfer = jest.fn()
    renderGrid({ onTransfer })

    fireEvent.click(screen.getByRole('button', { name: /transfer/i }))

    expect(onTransfer).toHaveBeenCalledWith('file-1')
  })

  it('shows Rename and Delete inside the overflow menu', async () => {
    const user = userEvent.setup()
    renderGrid()

    await user.click(screen.getByRole('button', { name: /more actions/i }))

    expect(await screen.findByText('Rename')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('calls onRename when Rename is chosen from the overflow menu', async () => {
    const user = userEvent.setup()
    const onRename = jest.fn()
    renderGrid({ onRename })

    await user.click(screen.getByRole('button', { name: /more actions/i }))
    await user.click(await screen.findByText('Rename'))

    expect(onRename).toHaveBeenCalledWith('file-1')
  })

  it('calls onDelete when Delete is chosen from the overflow menu', async () => {
    const user = userEvent.setup()
    const onDelete = jest.fn()
    renderGrid({ onDelete })

    await user.click(screen.getByRole('button', { name: /more actions/i }))
    await user.click(await screen.findByText('Delete'))

    expect(onDelete).toHaveBeenCalledWith('file-1')
  })

  it('does not show Download/Transfer buttons for folders', () => {
    const folder: FileSystemItem = {
      ...baseItem,
      id: 'folder-1',
      type: 'folder'
    }
    renderGrid({ items: [folder] })

    expect(
      screen.queryByRole('button', { name: /^download$/i })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /^transfer$/i })
    ).not.toBeInTheDocument()
  })
})
