import { NotificationDataSource } from '@/data/data-source'
import { NotificationRepositoryImpl } from '@/data/repository'

const makeDataSource = (
  overrides: Partial<NotificationDataSource> = {}
): NotificationDataSource => ({
  getNotifications: async () => ({ result: [], totalItems: 0 }),
  markNotificationsAsRead: async () => {},
  ...overrides
})

describe('NotificationRepositoryImpl.list', () => {
  it('surfaces totalItems from the reply alongside the parsed notifications', async () => {
    const ds = makeDataSource({
      getNotifications: async () => ({
        result: [{ id: '1', message: 'hi' }],
        totalItems: 42
      })
    })
    const repo = new NotificationRepositoryImpl(ds)

    const result = await repo.list({ isRead: false, paginationLimit: 1 })

    expect(result.error).toBeUndefined()
    expect(result.data).toHaveLength(1)
    expect(result.totalItems).toBe(42)
  })

  it('passes totalItems through as undefined when the reply omits it', async () => {
    const ds = makeDataSource({
      getNotifications: async () => ({ result: [] })
    })
    const repo = new NotificationRepositoryImpl(ds)

    const result = await repo.list()

    expect(result.error).toBeUndefined()
    expect(result.totalItems).toBeUndefined()
  })

  it('returns an error on network failure without setting totalItems', async () => {
    const ds = makeDataSource({
      getNotifications: () => Promise.reject(new Error('network error'))
    })
    const repo = new NotificationRepositoryImpl(ds)

    const result = await repo.list()

    expect(result.error?.message).toBe('network error')
    expect(result.totalItems).toBeUndefined()
  })
})
