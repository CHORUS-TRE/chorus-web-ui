/**
 * @jest-environment jsdom
 */

import { AppRepository } from '../../src/domain/repository'
import { AppCreate } from '../../src/domain/use-cases/app/app-create'
import { AppGet } from '../../src/domain/use-cases/app/app-get'
import { createMockRepository } from '../../src/utils/test-utils'

// Mock the app repository for testing
const mockAppGetResponse = {
  data: {
    id: '1',
    tenantId: 'tenant-1',
    userId: 'owner-1',
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
  }
}

// Using type assertion to bypass the type checks since types are exported as types
const mockAppCreateRequest = {
  tenantId: 'tenant-1',
  userId: 'owner-1',
  name: 'New App',
  prettyName: 'Newly Created App',
  description: 'A newly created application',
  dockerImageName: 'new-image',
  dockerImageTag: 'latest',
  type: 'app'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any // Type assertion to avoid type errors

const mockAppCreateResponse = {
  data: {
    id: '2',
    ...mockAppCreateRequest,
    status: 'created',
    url: 'https://example.com/new-app',
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

describe('App Workflow Integration', () => {
  let appRepository: AppRepository
  let appGetUseCase: AppGet
  let appCreateUseCase: AppCreate

  beforeEach(() => {
    // Setup repository and use cases
    appRepository = createMockRepository<AppRepository>({
      get: jest.fn().mockResolvedValue(mockAppGetResponse),
      create: jest.fn().mockResolvedValue(mockAppCreateResponse)
    })

    appGetUseCase = new AppGet(appRepository)
    appCreateUseCase = new AppCreate(appRepository)
  })

  it('can retrieve an app and display its details', async () => {
    // Get app details
    const appResult = await appGetUseCase.execute('1')

    // Verify app data
    expect(appResult).toEqual(mockAppGetResponse)
    expect(appResult.data?.name).toBe('Test App')
    expect(appResult.data?.description).toBe('A test application')
    expect(appRepository.get).toHaveBeenCalledWith('1')
  })

  it('can create a new app and retrieve it', async () => {
    // Create a new app
    const createResult = await appCreateUseCase.execute(mockAppCreateRequest)

    // Verify creation result
    expect(createResult).toEqual(mockAppCreateResponse)
    expect(createResult.data?.id).toBe('2')
    expect(appRepository.create).toHaveBeenCalledWith(mockAppCreateRequest)

    // Setup mock for getting the newly created app
    appRepository.get = jest.fn().mockResolvedValue(mockAppCreateResponse)

    // Get the newly created app
    const getResult = await appGetUseCase.execute('2')

    // Verify get result
    expect(getResult).toEqual(mockAppCreateResponse)
    expect(getResult.data?.name).toBe('New App')
    expect(appRepository.get).toHaveBeenCalledWith('2')
  })

  it('handles errors during app creation', async () => {
    // Setup mock to simulate an error
    const errorResponse = { error: 'Failed to create app' }
    appRepository.create = jest.fn().mockResolvedValue(errorResponse)

    // Attempt to create an app
    const result = await appCreateUseCase.execute(mockAppCreateRequest)

    // Verify error is returned
    expect(result).toEqual(errorResponse)
    expect(result.error).toBe('Failed to create app')
  })

  it('handles network errors during app creation', async () => {
    // Setup mock to simulate a network error
    const networkError = new Error('Network failure')
    appRepository.create = jest.fn().mockRejectedValue(networkError)

    // Attempt to create an app and expect it to throw
    await expect(
      appCreateUseCase.execute(mockAppCreateRequest)
    ).rejects.toThrow('Network failure')
  })
})
