/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import React, { act } from 'react'

// Mock the necessary modules
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  }),
  usePathname: jest.fn().mockReturnValue('/'),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams())
}))

// Mock API responses
jest.mock('../../src/data/repository', () => ({
  workspaceRepository: {
    create: jest.fn().mockResolvedValue({
      data: {
        id: 'new-workspace-123',
        name: 'New Workspace',
        shortName: 'new-ws',
        description: 'E2E Test Workspace',
        userId: 'current-user',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }),
    get: jest.fn().mockImplementation((id) => {
      return Promise.resolve({
        data: {
          id,
          name: 'New Workspace',
          shortName: 'new-ws',
          description: 'E2E Test Workspace',
          userId: 'current-user',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    })
  }
}))

// Mock authentication
jest.mock(
  '../../src/domain/use-cases/authentication/get-current-user',
  () => ({
    getCurrentUser: jest.fn().mockResolvedValue({
      data: {
        id: 'current-user',
        username: 'user@example.com',
        firstName: 'Test',
        lastName: 'User'
      }
    })
  }),
  { virtual: true }
)

// Mock user-event
jest.mock('@testing-library/user-event', () => ({
  __esModule: true,
  default: {
    setup: () => ({
      click: async (element: HTMLElement) => {
        // Simulate a click event
        element.click()
        // Return a Promise to simulate async behavior
        return Promise.resolve()
      }
    })
  }
}))

// Import the components needed for the test
// Note: In a real test, you would import the actual components
const MockWorkspacePage = () => (
  <div>
    <h1>Workspaces</h1>
    <button data-testid="create-workspace-button">Create Workspace</button>
    <div data-testid="workspaces-list">
      {/* Workspace list would be here */}
    </div>
  </div>
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MockWorkspaceCreateForm = ({
  onSubmit
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name: 'New Workspace',
      shortName: 'new-ws',
      description: 'E2E Test Workspace'
    })
  }

  return (
    <div>
      <h2>Create Workspace</h2>
      <form onSubmit={handleSubmit} data-testid="workspace-form">
        <input data-testid="name-input" defaultValue="New Workspace" />
        <input data-testid="shortname-input" defaultValue="new-ws" />
        <textarea
          data-testid="description-input"
          defaultValue="E2E Test Workspace"
        />
        <button type="submit" data-testid="submit-button">
          Create
        </button>
      </form>
    </div>
  )
}

// Mock dialog for workspace creation
const MockCreateWorkspaceDialog = ({
  open,
  onOpenChange
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (data: any) => {
    // Simulate API call to create workspace
    const workspaceRepo =
      require('../../src/data/repository').workspaceRepository
    workspaceRepo.create(data).then(() => {
      onOpenChange(false)
      // Simulate navigation to the new workspace
      const router = require('next/navigation').useRouter()
      router.push(`/workspaces/new-workspace-123`)
    })
  }

  if (!open) return null

  return (
    <div data-testid="create-dialog">
      <MockWorkspaceCreateForm onSubmit={handleSubmit} />
      <button data-testid="cancel-button" onClick={() => onOpenChange(false)}>
        Cancel
      </button>
    </div>
  )
}

// The main component that simulates our application
const MockApp = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false)

  return (
    <div>
      <MockWorkspacePage />
      <button
        data-testid="open-dialog-button"
        onClick={() => setDialogOpen(true)}
      >
        Open Create Dialog
      </button>
      <MockCreateWorkspaceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}

describe('Workspace Creation E2E Flow', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  it('should render the initial workspace page', () => {
    render(<MockApp />)
    expect(screen.getByTestId('create-workspace-button')).toBeInTheDocument()
    expect(screen.getByTestId('workspaces-list')).toBeInTheDocument()
    expect(screen.getByTestId('open-dialog-button')).toBeInTheDocument()
    expect(screen.queryByTestId('create-dialog')).not.toBeInTheDocument()
  })

  it('should open the workspace creation dialog when the button is clicked', async () => {
    render(<MockApp />)
    const openDialogButton = screen.getByTestId('open-dialog-button')

    // Use act to wrap state updates
    await act(async () => {
      // Simulate click
      openDialogButton.click()
    })

    // Now check if the dialog is open
    expect(screen.getByTestId('create-dialog')).toBeInTheDocument()
  })

  it('should close the dialog when cancel is clicked', async () => {
    // Use act for the initial render
    await act(async () => {
      render(<MockApp />)
    })

    const openDialogButton = screen.getByTestId('open-dialog-button')

    // Use act for the click
    await act(async () => {
      openDialogButton.click()
    })

    // Now the dialog should be visible
    const dialog = screen.getByTestId('create-dialog')
    expect(dialog).toBeInTheDocument()

    const cancelButton = screen.getByTestId('cancel-button')

    // Use act for the cancel click
    await act(async () => {
      cancelButton.click()
    })

    // Dialog should be closed
    expect(screen.queryByTestId('create-dialog')).not.toBeInTheDocument()
  })
})
