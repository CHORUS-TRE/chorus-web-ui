import { AppCreate } from '@/domain/model'
import { AppState, AppType } from '@/domain/model/app'
import { AppRepository } from '@/domain/repository/app-repository'
import { AppCreate as AppCreateUseCase } from '@/domain/use-cases/app/app-create'

describe('AppCreate Use Case', () => {
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

  it('should create app with custom dockerImageRegistry', async () => {
    const mockApp: AppCreate = {
      tenantId: 'tenant-1',
      ownerId: 'owner-1',
      name: 'Test App',
      dockerImageRegistry: 'ghcr.io',
      dockerImageName: 'nginx',
      dockerImageTag: 'latest',
      type: AppType.APP
    }

    const mockResponse = {
      data: {
        ...mockApp,
        id: 'app-1',
        status: AppState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }

    mockRepository.create.mockResolvedValue(mockResponse)

    const useCase = new AppCreateUseCase(mockRepository)
    const result = await useCase.execute(mockApp)

    expect(result.data?.dockerImageRegistry).toBe('ghcr.io')
    expect(mockRepository.create).toHaveBeenCalledWith(mockApp)
  })
})
