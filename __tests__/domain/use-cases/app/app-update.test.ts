import { AppCreate } from '@/domain/model'
import { AppState, AppType } from '@/domain/model/app'
import { AppRepository } from '@/domain/repository/app-repository'
import { AppUpdate as AppUpdateUseCase } from '@/domain/use-cases/app/app-update'

describe('AppUpdate Use Case', () => {
  const mockRepository: jest.Mocked<AppRepository> = {
    create: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    get: jest.fn()
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should update app keeping default dockerImageRegistry', async () => {
    const mockApp: AppCreate & { id: string } = {
      id: 'app-1',
      tenantId: 'tenant-1',
      ownerId: 'owner-1',
      name: 'Test App Updated',
      dockerImageRegistry: 'docker.io',
      dockerImageName: 'nginx',
      dockerImageTag: 'latest',
      type: AppType.APP
    }

    const mockResponse = {
      data: {
        ...mockApp,
        status: AppState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }

    mockRepository.update.mockResolvedValue(mockResponse)

    const useCase = new AppUpdateUseCase(mockRepository)
    const result = await useCase.execute(mockApp)

    expect(result.data?.dockerImageRegistry).toBe('docker.io')
    expect(mockRepository.update).toHaveBeenCalledWith(mockApp)
  })

  it('should update app with custom dockerImageRegistry', async () => {
    const mockApp: AppCreate & { id: string } = {
      id: 'app-1',
      tenantId: 'tenant-1',
      ownerId: 'owner-1',
      name: 'Test App Updated',
      dockerImageRegistry: 'ghcr.io',
      dockerImageName: 'nginx',
      dockerImageTag: 'latest',
      type: AppType.APP
    }

    const mockResponse = {
      data: {
        ...mockApp,
        status: AppState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }

    mockRepository.update.mockResolvedValue(mockResponse)

    const useCase = new AppUpdateUseCase(mockRepository)
    const result = await useCase.execute(mockApp)

    expect(result.data?.dockerImageRegistry).toBe('ghcr.io')
    expect(mockRepository.update).toHaveBeenCalledWith(mockApp)
  })
})
