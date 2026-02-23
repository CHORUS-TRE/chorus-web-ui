import { ApprovalRequestServiceListApprovalRequestsRequest } from '@/internal/client'

import { Result } from '../model'
import {
  ApprovalRequest,
  ApproveApprovalRequestAction,
  CreateDataExtractionRequest,
  CreateDataTransferRequest
} from '../model/approval-request'

export interface ApprovalRequestRepository {
  approve(action: ApproveApprovalRequestAction): Promise<Result<void>>
  createDataExtraction(
    request: CreateDataExtractionRequest
  ): Promise<Result<ApprovalRequest>>
  createDataTransfer(
    request: CreateDataTransferRequest
  ): Promise<Result<ApprovalRequest>>
  delete(id: string): Promise<Result<void>>
  get(id: string): Promise<Result<ApprovalRequest>>
  list(
    params?: ApprovalRequestServiceListApprovalRequestsRequest
  ): Promise<Result<ApprovalRequest[]>>
}
