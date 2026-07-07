import { ApprovalRequestDataSource } from '@/data/data-source'
import { ApprovalRequestRepositoryImpl } from '@/data/repository'

const notImplemented = () => Promise.reject(new Error('not implemented'))

const makeDataSource = (
  overrides: Partial<ApprovalRequestDataSource> = {}
): ApprovalRequestDataSource => ({
  approve: notImplemented,
  countMine: notImplemented,
  createDataExtraction: notImplemented,
  createDataTransfer: notImplemented,
  delete: notImplemented,
  get: notImplemented,
  list: async () => ({ result: { approvalRequests: [] } }),
  downloadFile: notImplemented,
  ...overrides
})

describe('ApprovalRequestRepositoryImpl.list', () => {
  it('surfaces totalItems from pagination.total alongside the parsed requests', async () => {
    const ds = makeDataSource({
      list: async () => ({
        result: { approvalRequests: [{ id: '1', title: 'Extract data' }] },
        pagination: { total: 57, offset: 0, limit: 20 }
      })
    })
    const repo = new ApprovalRequestRepositoryImpl(ds)

    const result = await repo.list({ paginationLimit: 20 })

    expect(result.error).toBeUndefined()
    expect(result.data).toHaveLength(1)
    expect(result.totalItems).toBe(57)
  })

  it('leaves totalItems undefined when the reply omits pagination', async () => {
    const ds = makeDataSource({
      list: async () => ({ result: { approvalRequests: [] } })
    })
    const repo = new ApprovalRequestRepositoryImpl(ds)

    const result = await repo.list()

    expect(result.error).toBeUndefined()
    expect(result.totalItems).toBeUndefined()
  })
})
