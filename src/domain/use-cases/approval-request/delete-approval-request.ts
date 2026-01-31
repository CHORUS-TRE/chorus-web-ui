import { Result } from '@/domain/model'
import { ApprovalRequestRepository } from '@/domain/repository'

export class DeleteApprovalRequest {
  constructor(private readonly repository: ApprovalRequestRepository) {}

  async execute(id: string): Promise<Result<void>> {
    return this.repository.delete(id)
  }
}
