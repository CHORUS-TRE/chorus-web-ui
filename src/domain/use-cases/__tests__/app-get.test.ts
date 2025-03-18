/**
 * @jest-environment jsdom
 */
import { AppRepository } from '../../../domain/repository'
import { AppGet } from '../../../domain/use-cases/app/app-get'
import { createMockRepository } from '../../../utils/test-utils'

// Since the enums are exported as types, we need to recreate them
// This matches the enums in src/domain/model/app.ts
const AppType = Object.freeze({
  APP: 'app',
  SERVICE: 'service'
})

const AppState = Object.freeze({
  CREATED: 'created',
  LOADING: 'loading',
  ACTIVE: 'active',
  STOPPING: 'stopping',
  EXITED: 'exited'
})

describe('AppGet UseCase', () => {
  // Mock data
  const mockApp = {
    id: '1',
    tenantId: 'tenant-1',
    ownerId: 'owner-1',
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

  const mockResponse = {
    data: mockApp
  }

  const mockErrorResponse = {
    error: 'App not found'
  }

  let repository: AppRepository
  let useCase: AppGet

  beforeEach(() => {
    // Create a mock repository
    repository = createMockRepository<AppRepository>({
      get: jest.fn().mockResolvedValue(mockResponse)
    })

    // Initialize the use case with the mock repository
    useCase = new AppGet(repository)
  })

  test('should return app data when repository returns data', async () => {
    // Arrange - setup is done in beforeEach

    // Act
    const result = await useCase.execute('1')

    // Assert
    expect(result).toEqual(mockResponse)
    expect(repository.get).toHaveBeenCalledWith('1')
    expect(repository.get).toHaveBeenCalledTimes(1)
  })

  test('should return error when repository returns error', async () => {
    // Arrange
    repository.get = jest.fn().mockResolvedValue(mockErrorResponse)

    // Act
    const result = await useCase.execute('999')

    // Assert
    expect(result).toEqual(mockErrorResponse)
    expect(repository.get).toHaveBeenCalledWith('999')
  })

  test('should throw error when repository throws error', async () => {
    // Arrange
    const error = new Error('Network error')
    repository.get = jest.fn().mockRejectedValue(error)

    // Act & Assert
    await expect(useCase.execute('1')).rejects.toThrow('Network error')
    expect(repository.get).toHaveBeenCalledWith('1')
  })
})
