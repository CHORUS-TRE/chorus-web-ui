import { Result } from '@/domain/model'
import { ApprovalRequest } from '@/domain/model/approval-request'
import { ApprovalRequestRepository } from '@/domain/repository'

export class GetApprovalRequest {
  constructor(private readonly repository: ApprovalRequestRepository) {}

  async execute(id: string): Promise<Result<ApprovalRequest>> {
    return this.repository.get(id)
  }
}
