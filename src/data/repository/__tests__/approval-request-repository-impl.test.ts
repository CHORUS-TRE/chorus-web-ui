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

describe('ApprovalRequestRepositoryImpl.approve', () => {
  it('returns the server-confirmed request from the approve reply', async () => {
    const ds = makeDataSource({
      approve: async () => ({
        result: {
          approvalRequest: {
            id: 'req-1',
            status: 'APPROVAL_REQUEST_STATUS_PENDING',
            stepDecisions: {
              download: {
                approverId: 'approver-1',
                approvedAt: new Date('2026-07-01T00:00:00Z'),
                approve: true
              }
            }
          }
        }
      })
    })
    const repo = new ApprovalRequestRepositoryImpl(ds)

    const result = await repo.approve({ id: 'req-1', approved: true })

    expect(result.error).toBeUndefined()
    // The transfer's second step hasn't been decided, so status stays
    // PENDING -- callers must apply this instead of assuming APPROVED.
    expect(result.data?.status).toBe('APPROVAL_REQUEST_STATUS_PENDING')
    expect(result.data?.stepDecisions?.download?.approverId).toBe('approver-1')
  })

  it('returns an error on network failure', async () => {
    const ds = makeDataSource({
      approve: () => Promise.reject(new Error('network error'))
    })
    const repo = new ApprovalRequestRepositoryImpl(ds)

    const result = await repo.approve({ id: 'req-1', approved: true })

    expect(result.error?.message).toBe('network error')
  })
})
