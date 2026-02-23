import { Result } from '@/domain/model'
import { ApproveApprovalRequestAction } from '@/domain/model/approval-request'
import { ApprovalRequestRepository } from '@/domain/repository'

export class ApproveApprovalRequest {
  constructor(private readonly repository: ApprovalRequestRepository) {}

  async execute(action: ApproveApprovalRequestAction): Promise<Result<void>> {
    return this.repository.approve(action)
  }
}
