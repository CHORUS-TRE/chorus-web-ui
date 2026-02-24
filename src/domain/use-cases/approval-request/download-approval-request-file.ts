import { Result } from '@/domain/model'
import {
  ApprovalRequestRepository,
  DownloadFileResult
} from '@/domain/repository'

export class DownloadApprovalRequestFile {
  constructor(private readonly repository: ApprovalRequestRepository) {}

  async execute(
    requestId: string,
    filePath: string
  ): Promise<Result<DownloadFileResult>> {
    return this.repository.downloadFile(requestId, filePath)
  }
}
