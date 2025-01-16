import { AppDataSourceImpl } from '@/data/data-source/chorus-api/app-api-data-source-impl'
import { AppRepositoryImpl } from '@/data/repository/app-repository-impl'
import { AppCreate } from '@/domain/model'
import { AppState, AppType } from '@/domain/model/app'
import { AppRepository } from '@/domain/repository/app-repository'
import { AppCreate as AppCreateUseCase } from '@/domain/use-cases/app/app-create'
import { AppUpdate as AppUpdateUseCase } from '@/domain/use-cases/app/app-update'

import { AppServiceApi, Configuration } from '../../../src/internal/client'

// Create mock API instance
const mockApiMethods = {
  appServiceCreateApp: jest.fn(),
  appServiceGetApp: jest.fn(),
  appServiceUpdateApp: jest.fn(),
  appServiceListApps: jest.fn(),
  appServiceDeleteApp: jest.fn()
}

// Mock the entire client module
jest.mock('../../../src/internal/client', () => ({
  Configuration: jest.fn().mockImplementation(() => ({})),
  AppServiceApi: jest.fn().mockImplementation(() => mockApiMethods)
}))

describe('App Docker Registry Integration', () => {
  let repository: AppRepository
  let createUseCase: AppCreateUseCase
  let updateUseCase: AppUpdateUseCase

  beforeEach(() => {
    jest.clearAllMocks()

    // Set up default mock responses
    mockApiMethods.appServiceCreateApp.mockResolvedValue({
      result: { id: 'app-1' }
    })
    mockApiMethods.appServiceGetApp.mockResolvedValue({
      result: {
        app: {
          id: 'app-1',
          status: AppState.ACTIVE.toLowerCase(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    })
    mockApiMethods.appServiceUpdateApp.mockResolvedValue({})

    const dataSource = new AppDataSourceImpl('test-session')
    repository = new AppRepositoryImpl(dataSource)
    createUseCase = new AppCreateUseCase(repository)
    updateUseCase = new AppUpdateUseCase(repository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should handle complete flow with dockerImageRegistry', async () => {
    const createApp: AppCreate = {
      tenantId: 'tenant-1',
      ownerId: 'owner-1',
      name: 'Integration Test App',
      dockerImageRegistry: 'docker.io',
      dockerImageName: 'nginx',
      dockerImageTag: 'latest',
      type: AppType.APP
    }

    // Mock specific responses for this test
    mockApiMethods.appServiceGetApp
      .mockResolvedValueOnce({
        result: {
          app: {
            ...createApp,
            id: 'app-1',
            status: AppState.ACTIVE.toLowerCase(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      })
      .mockResolvedValueOnce({
        result: {
          app: {
            ...createApp,
            id: 'app-1',
            dockerImageRegistry: 'ghcr.io',
            status: AppState.ACTIVE.toLowerCase(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      })

    // Create app and verify default registry
    const createResult = await createUseCase.execute(createApp)
    expect(createResult.data?.dockerImageRegistry).toBe('docker.io')

    // Update app with custom registry
    const updateApp = {
      ...createApp,
      id: createResult.data!.id,
      dockerImageRegistry: 'ghcr.io'
    }

    // Update app and verify custom registry
    const updateResult = await updateUseCase.execute(updateApp)
    expect(updateResult.data?.dockerImageRegistry).toBe('ghcr.io')

    // Verify error handling for invalid registry
    const invalidApp = {
      ...createApp,
      id: 'app-2',
      dockerImageRegistry: 'invalid://registry'
    }

    try {
      await createUseCase.execute(invalidApp)
      fail('Should have thrown validation error')
    } catch (error) {
      expect(error).toBeDefined()
    }
  })
})
