import { Result } from '@/domain/model'
import {
  ApprovalRequest,
  CreateDataTransferRequest
} from '@/domain/model/approval-request'
import { ApprovalRequestRepository } from '@/domain/repository'

export class CreateDataTransferRequestUseCase {
  constructor(private readonly repository: ApprovalRequestRepository) {}

  async execute(
    request: CreateDataTransferRequest
  ): Promise<Result<ApprovalRequest>> {
    return this.repository.createDataTransfer(request)
  }
}
