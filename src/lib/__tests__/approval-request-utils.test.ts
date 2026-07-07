import {
  ApprovalRequest,
  ApprovalRequestType
} from '@/domain/model/approval-request'
import { canApproveRequest } from '@/lib/approval-request-utils'

const extractionRequest = (
  overrides: Partial<ApprovalRequest> = {}
): ApprovalRequest => ({
  id: 'req-1',
  type: ApprovalRequestType.DATA_EXTRACTION,
  requesterId: 'requester-1',
  approverIdsByStep: { download: { ids: ['approver-1'] } },
  stepDecisions: {},
  ...overrides
})

describe('canApproveRequest', () => {
  it('is true for a listed approver on a still-pending step', () => {
    expect(canApproveRequest('approver-1', extractionRequest())).toBe(true)
  })

  it('is false for a user not listed as an approver on any required step', () => {
    expect(canApproveRequest('someone-else', extractionRequest())).toBe(false)
  })

  it('is false once the only required step has already been decided', () => {
    const request = extractionRequest({
      stepDecisions: {
        download: {
          approverId: 'approver-1',
          approvedAt: new Date('2026-07-01T00:00:00Z'),
          approve: true
        }
      }
    })
    expect(canApproveRequest('approver-1', request)).toBe(false)
  })

  it('is false for undefined userId', () => {
    expect(canApproveRequest(undefined, extractionRequest())).toBe(false)
  })

  it('is true for a transfer approver on either required step', () => {
    const transferRequest: ApprovalRequest = {
      id: 'req-2',
      type: ApprovalRequestType.DATA_TRANSFER,
      requesterId: 'requester-1',
      approverIdsByStep: {
        download: { ids: ['source-approver'] },
        upload: { ids: ['destination-approver'] }
      },
      stepDecisions: {}
    }
    expect(canApproveRequest('destination-approver', transferRequest)).toBe(
      true
    )
  })
})
