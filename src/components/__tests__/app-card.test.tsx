/**
 * @jest-environment jsdom
 */
import React from 'react'

import { AppCard } from '../../components/app-card'
import { render, screen } from '../../utils/test-utils'

// Mock the app-state-context
jest.mock('../../components/store/app-state-context', () => ({
  useAppState: jest.fn().mockReturnValue({
    setNotification: jest.fn()
  })
}))

// Mock the app-icon utility
jest.mock('../../utils/app-icon', () => ({
  getAppIcon: jest.fn().mockReturnValue('TestIcon')
}))

// Mock the app-view-model
jest.mock('../../components/actions/app-view-model', () => ({
  appDelete: jest.fn().mockResolvedValue({ data: { id: '1' } })
}))

// Since the App type is exported as a type, we need to mock the app with our own data
// Using type assertion to bypass TypeScript's type checking
const mockApp = Object.assign({
  id: '1',
  tenantId: 'tenant-1',
  ownerId: 'owner-1',
  name: 'Test App',
  prettyName: 'Test Application',
  description: 'A test application',
  dockerImageName: 'test-image',
  dockerImageTag: 'latest',
  type: 'app',
  status: 'active',
  url: 'https://example.com/app',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-02')
}) // Using Object.assign instead of 'as any' type assertion

describe('AppCard Component', () => {
  const onUpdateMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the app card with correct information', () => {
    render(<AppCard app={mockApp} onUpdate={onUpdateMock} />)

    // Check basic elements are rendered
    expect(screen.getByText('Test Application')).toBeInTheDocument()
    expect(screen.getByText('A test application')).toBeInTheDocument()
  })

  it('shows the dropdown menu when clicking the menu button', async () => {
    const { user } = render(<AppCard app={mockApp} onUpdate={onUpdateMock} />)

    // Find the dropdown trigger button
    const menuButton =
      screen.getByRole('button', { name: /More options/i }) ||
      screen.getByLabelText(/More options/i) ||
      screen.getByTestId('dropdown-menu-trigger')

    // Click the menu button
    await user.click(menuButton)

    // Check dropdown items are visible
    expect(screen.getByText('Edit App')).toBeInTheDocument()
    expect(screen.getByText('Delete App')).toBeInTheDocument()
  })

  it('opens the edit dialog when clicking edit button', async () => {
    const { user } = render(<AppCard app={mockApp} onUpdate={onUpdateMock} />)

    // Open dropdown menu
    const menuButton =
      screen.getByRole('button', { name: /More options/i }) ||
      screen.getByLabelText(/More options/i) ||
      screen.getByTestId('dropdown-menu-trigger')
    await user.click(menuButton)

    // Click edit button
    const editButton = screen.getByText('Edit App')
    await user.click(editButton)

    // Check if edit dialog is shown
    expect(screen.getByText('Edit App Details')).toBeInTheDocument()
  })

  it('opens the delete confirmation dialog when clicking delete button', async () => {
    const { user } = render(<AppCard app={mockApp} onUpdate={onUpdateMock} />)

    // Open dropdown menu
    const menuButton =
      screen.getByRole('button', { name: /More options/i }) ||
      screen.getByLabelText(/More options/i) ||
      screen.getByTestId('dropdown-menu-trigger')
    await user.click(menuButton)

    // Click delete button
    const deleteButton = screen.getByText('Delete App')
    await user.click(deleteButton)

    // Check if delete dialog is shown
    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument()
    expect(
      screen.getByText(/Are you sure you want to delete/i)
    ).toBeInTheDocument()
  })
})
