import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { UploadComplianceDialog } from '../upload-compliance-dialog'

describe('UploadComplianceDialog', () => {
  it('requires every acknowledgment before confirming', async () => {
    const user = userEvent.setup()
    const onConfirm = jest.fn()

    render(
      <UploadComplianceDialog
        open
        fileNames={['research.csv']}
        onCancel={jest.fn()}
        onConfirm={onConfirm}
      />
    )

    const confirm = screen.getByRole('button', { name: 'Confirm upload' })
    expect(confirm).toBeDisabled()

    for (const checkbox of screen.getAllByRole('checkbox')) {
      await user.click(checkbox)
    }

    expect(confirm).toBeEnabled()
    await user.click(confirm)
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('has no implicit close action and ignores escape', async () => {
    const user = userEvent.setup()
    const onCancel = jest.fn()

    render(
      <UploadComplianceDialog
        open
        fileNames={['research.csv']}
        onCancel={onCancel}
        onConfirm={jest.fn()}
      />
    )

    expect(
      screen.queryByRole('button', { name: 'Close' })
    ).not.toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('truncates large batches and can reveal every file', async () => {
    const user = userEvent.setup()
    const fileNames = Array.from(
      { length: 22 },
      (_, index) => `file-${index}.csv`
    )

    render(
      <UploadComplianceDialog
        open
        fileNames={fileNames}
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />
    )

    expect(screen.getByText('… and 2 more')).toBeInTheDocument()
    expect(screen.queryByText('file-21.csv')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show all' }))

    expect(screen.getByText('file-21.csv')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
  })
})
