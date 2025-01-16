import {
  AppCreateSchema,
  AppSchema,
  AppState,
  AppType
} from '@/domain/model/app'

describe('App Model', () => {
  describe('AppCreateSchema', () => {
    it('should validate with required fields only', () => {
      const validApp = {
        tenantId: 'tenant-1',
        ownerId: 'owner-1',
        dockerImageRegistry: 'docker.io',
        dockerImageName: 'nginx',
        dockerImageTag: 'latest',
        type: AppType.APP
      }

      const result = AppCreateSchema.safeParse(validApp)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.dockerImageRegistry).toBe('docker.io') // Verify default value
      }
    })

    it('should validate with custom dockerImageRegistry', () => {
      const validApp = {
        tenantId: 'tenant-1',
        ownerId: 'owner-1',
        dockerImageRegistry: 'ghcr.io',
        dockerImageName: 'nginx',
        dockerImageTag: 'latest',
        type: AppType.APP
      }

      const result = AppCreateSchema.safeParse(validApp)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.dockerImageRegistry).toBe('ghcr.io')
      }
    })

    it('should validate with all optional fields', () => {
      const validApp = {
        tenantId: 'tenant-1',
        ownerId: 'owner-1',
        name: 'Test App',
        prettyName: 'Test App Pretty',
        description: 'Test Description',
        dockerImageRegistry: 'ghcr.io',
        dockerImageName: 'nginx',
        dockerImageTag: 'latest',
        type: AppType.APP,
        url: 'http://test.com'
      }

      const result = AppCreateSchema.safeParse(validApp)
      expect(result.success).toBe(true)
    })
  })

  describe('AppSchema', () => {
    it('should validate a complete app with dockerImageRegistry', () => {
      const validApp = {
        id: 'app-1',
        tenantId: 'tenant-1',
        ownerId: 'owner-1',
        name: 'Test App',
        prettyName: 'Test App Pretty',
        description: 'Test Description',
        dockerImageRegistry: 'ghcr.io',
        dockerImageName: 'nginx',
        dockerImageTag: 'latest',
        type: AppType.APP,
        url: 'http://test.com',
        status: AppState.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const result = AppSchema.safeParse(validApp)
      expect(result.success).toBe(true)
    })
  })
})
