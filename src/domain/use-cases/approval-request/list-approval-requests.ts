import { Result } from '@/domain/model'
import { ApprovalRequest } from '@/domain/model/approval-request'
import { ApprovalRequestRepository } from '@/domain/repository'
import { ApprovalRequestServiceListApprovalRequestsRequest } from '@/internal/client'

export class ListApprovalRequests {
  constructor(private readonly repository: ApprovalRequestRepository) {}

  async execute(
    params?: ApprovalRequestServiceListApprovalRequestsRequest
  ): Promise<Result<ApprovalRequest[]>> {
    return this.repository.list(params)
  }
}
