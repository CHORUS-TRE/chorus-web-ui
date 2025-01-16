import { AppDataSourceImpl } from '@/data/data-source/chorus-api/app-api-data-source-impl'
import { AppState, AppType } from '@/domain/model/app'

import { ChorusApp } from '~/internal/client'

describe('AppDataSourceImpl', () => {
  describe('mapping', () => {
    it('should map custom dockerImageRegistry', async () => {
      const apiApp: ChorusApp = {
        id: 'app-1',
        tenantId: 'tenant-1',
        userId: 'user-1',
        name: 'Test App',
        description: 'Test Description',
        dockerImageRegistry: 'ghcr.io',
        dockerImageName: 'nginx',
        dockerImageTag: 'latest',
        status: AppState.ACTIVE.toLowerCase(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const dataSource = new AppDataSourceImpl('test-session')
      // Mock the API call
      jest.spyOn(dataSource['client'], 'appServiceGetApp').mockResolvedValue({
        result: { app: apiApp }
      })

      const domainApp = await dataSource.get('app-1')
      expect(domainApp.dockerImageRegistry).toBe('ghcr.io')
    })
  })
})
