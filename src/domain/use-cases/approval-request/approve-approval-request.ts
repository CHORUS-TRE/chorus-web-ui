import { Result } from '@/domain/model'
import {
  ApprovalRequest,
  ApproveApprovalRequestAction
} from '@/domain/model/approval-request'
import { ApprovalRequestRepository } from '@/domain/repository'

export class ApproveApprovalRequest {
  constructor(private readonly repository: ApprovalRequestRepository) {}

  async execute(
    action: ApproveApprovalRequestAction
  ): Promise<Result<ApprovalRequest>> {
    return this.repository.approve(action)
  }
}
