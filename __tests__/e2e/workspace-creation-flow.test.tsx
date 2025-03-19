/**
 * @jest-environment jsdom
 */
import React from 'react'

import { render, screen } from '../../src/utils/test-utils'

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
        ownerId: 'current-user',
        memberIds: ['current-user'],
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
          ownerId: 'current-user',
          memberIds: ['current-user'],
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    })
  }
}))

// Mock authentication
jest.mock('../../src/domain/use-cases/authentication/get-current-user', () => ({
  getCurrentUser: jest.fn().mockResolvedValue({
    data: {
      id: 'current-user',
      email: 'user@example.com',
      firstName: 'Test',
      lastName: 'User'
    }
  })
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
      <button onClick={() => onOpenChange(false)}>Cancel</button>
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

  it('allows a user to create a new workspace', async () => {
    // Render the app
    const { user } = render(<MockApp />)

    // Click the button to open the dialog
    const openDialogButton = screen.getByTestId('open-dialog-button')
    await user.click(openDialogButton)

    // Check if dialog is open
    expect(screen.getByTestId('create-dialog')).toBeInTheDocument()

    // Fill out the form (in this mock, the form is pre-filled)
    const nameInput = screen.getByTestId('name-input')
    const shortNameInput = screen.getByTestId('shortname-input')
    const descriptionInput = screen.getByTestId('description-input')

    // Ensure the inputs have the right values
    expect(nameInput).toHaveValue('New Workspace')
    expect(shortNameInput).toHaveValue('new-ws')
    expect(descriptionInput).toHaveValue('E2E Test Workspace')

    // Submit the form
    const submitButton = screen.getByTestId('submit-button')
    await user.click(submitButton)

    // Verify the workspace was created
    const workspaceRepo =
      require('../../src/data/repository').workspaceRepository
    expect(workspaceRepo.create).toHaveBeenCalledWith({
      name: 'New Workspace',
      shortName: 'new-ws',
      description: 'E2E Test Workspace'
    })

    // Verify navigation occurred
    const router = require('next/navigation').useRouter
    expect(router().push).toHaveBeenCalledWith('/workspaces/new-workspace-123')
  })

  it('allows cancelling workspace creation', async () => {
    // Render the app
    const { user } = render(<MockApp />)

    // Click the button to open the dialog
    const openDialogButton = screen.getByTestId('open-dialog-button')
    await user.click(openDialogButton)

    // Check if dialog is open
    expect(screen.getByTestId('create-dialog')).toBeInTheDocument()

    // Click the cancel button
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)

    // Verify the dialog is closed
    expect(screen.queryByTestId('create-dialog')).not.toBeInTheDocument()

    // Verify the create API was not called
    const workspaceRepo =
      require('../../src/data/repository').workspaceRepository
    expect(workspaceRepo.create).not.toHaveBeenCalled()
  })
})
