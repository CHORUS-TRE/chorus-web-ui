import { Result } from '@/domain/model'
import {
  ApprovalRequest,
  CreateDataExtractionRequest
} from '@/domain/model/approval-request'
import { ApprovalRequestRepository } from '@/domain/repository'

export class CreateDataExtractionRequestUseCase {
  constructor(private readonly repository: ApprovalRequestRepository) {}

  async execute(
    request: CreateDataExtractionRequest
  ): Promise<Result<ApprovalRequest>> {
    return this.repository.createDataExtraction(request)
  }
}
