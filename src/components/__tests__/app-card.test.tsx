/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'

import { AppCard } from '../../components/app-card'
import { AppState, AppType } from '../../domain/model/app'

// Mock the app-state-context
jest.mock('../../components/store/app-state-context', () => ({
  useAppState: jest.fn().mockReturnValue({
    setNotification: jest.fn()
  })
}))

// Mock the app-view-model
jest.mock('../../components/actions/app-view-model', () => ({
  appDelete: jest.fn().mockResolvedValue({ data: { id: '1' } })
}))

// Mock the app-edit-dialog component
jest.mock(
  '../../components/app-edit-dialog',
  () => ({
    AppEditDialog: ({
      open,
      onOpenChange
    }: {
      open: boolean
      onOpenChange: (open: boolean) => void
      app: unknown
      onUpdate: () => void
    }) =>
      open ? (
        <div data-testid="edit-dialog">
          <h2>Edit App Details</h2>
          <button onClick={() => onOpenChange(false)}>Close</button>
        </div>
      ) : null
  }),
  { virtual: true }
)

// Mock the delete-dialog component
jest.mock(
  '../../components/delete-dialog',
  () => ({
    DeleteDialog: ({
      open,
      onOpenChange,
      title,
      description,
      onConfirm
    }: {
      open: boolean
      onOpenChange: (open: boolean) => void
      title: string
      description: string
      onConfirm: () => void
    }) =>
      open ? (
        <div data-testid="delete-dialog">
          <h2>{title}</h2>
          <p>{description}</p>
          <button onClick={() => onConfirm()}>Delete</button>
          <button onClick={() => onOpenChange(false)}>Cancel</button>
        </div>
      ) : null
  }),
  { virtual: true }
)

// Since the App type is exported as a type, we need to mock the app with our own data
const mockApp = {
  id: '1',
  tenantId: 'tenant-1',
  userId: 'owner-1',
  name: 'Test App',
  prettyName: 'Test Application',
  description: 'A test application',
  dockerImageName: 'test-image',
  dockerImageTag: 'latest',
  type: AppType.APP,
  status: AppState.ACTIVE,
  url: 'https://example.com/app',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-02')
}

describe('AppCard Component', () => {
  const onUpdateMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the app card with correct information', () => {
    render(<AppCard app={mockApp} onUpdate={onUpdateMock} />)

    // Check basic elements are rendered
    expect(screen.getByText('Test App')).toBeInTheDocument()
    expect(screen.getByText('A test application')).toBeInTheDocument()
    expect(screen.getByText('test-image:latest')).toBeInTheDocument()
  })
})
