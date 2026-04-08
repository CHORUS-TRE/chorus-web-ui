import { z } from 'zod'

import { Result } from '@/domain/model'
import {
  ApprovalRequest,
  ApprovalRequestCount,
  ApprovalRequestSchema,
  ApproveApprovalRequestAction,
  CreateDataExtractionRequest,
  CreateDataTransferRequest
} from '@/domain/model/approval-request'
import {
  ApprovalRequestRepository,
  DownloadFileResult
} from '@/domain/repository/approval-request-repository'
import { ApprovalRequestServiceListApprovalRequestsRequest } from '@/internal/client'

import { ApprovalRequestDataSource } from '../data-source'

export class ApprovalRequestRepositoryImpl
  implements ApprovalRequestRepository
{
  private dataSource: ApprovalRequestDataSource

  constructor(dataSource: ApprovalRequestDataSource) {
    this.dataSource = dataSource
  }

  async approve(action: ApproveApprovalRequestAction): Promise<Result<void>> {
    try {
      await this.dataSource.approve({
        id: action.id,
        body: {
          approve: action.approved,
          comment: action.reason
        }
      })
      return { data: undefined }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async countMine(): Promise<Result<ApprovalRequestCount>> {
    try {
      const response = await this.dataSource.countMine()
      const result = response.result
      if (!result) {
        return { error: 'API response validation failed' }
      }
      return {
        data: {
          total: Number(result.total || '0'),
          totalApprover: Number(result.totalApprover || '0'),
          totalRequester: Number(result.totalRequester || '0'),
          countByStatus: result.countByStatus
            ? Object.fromEntries(
                Object.entries(result.countByStatus).map(([k, v]) => [
                  k,
                  Number(v)
                ])
              )
            : undefined,
          countByType: result.countByType
            ? Object.fromEntries(
                Object.entries(result.countByType).map(([k, v]) => [
                  k,
                  Number(v)
                ])
              )
            : undefined
        }
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async createDataExtraction(
    request: CreateDataExtractionRequest
  ): Promise<Result<ApprovalRequest>> {
    try {
      const response = await this.dataSource.createDataExtraction({
        body: {
          title: request.title,
          description: request.description,
          sourceWorkspaceId: request.sourceWorkspaceId,
          filePaths: request.fileIds
        }
      })

      const approvalRequestResult = ApprovalRequestSchema.safeParse(
        response.result?.approvalRequest
      )
      if (!approvalRequestResult.success) {
        return {
          error: 'API response validation failed',
          issues: approvalRequestResult.error.issues
        }
      }

      return { data: approvalRequestResult.data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async createDataTransfer(
    request: CreateDataTransferRequest
  ): Promise<Result<ApprovalRequest>> {
    try {
      const response = await this.dataSource.createDataTransfer({
        body: {
          title: request.title,
          description: request.description,
          sourceWorkspaceId: request.sourceWorkspaceId,
          destinationWorkspaceId: request.destinationWorkspaceId,
          filePaths: request.fileIds
        }
      })

      const approvalRequestResult = ApprovalRequestSchema.safeParse(
        response.result?.approvalRequest
      )
      if (!approvalRequestResult.success) {
        return {
          error: 'API response validation failed',
          issues: approvalRequestResult.error.issues
        }
      }

      return { data: approvalRequestResult.data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async delete(id: string): Promise<Result<void>> {
    try {
      await this.dataSource.delete({ id })
      return { data: undefined }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async get(id: string): Promise<Result<ApprovalRequest>> {
    try {
      const response = await this.dataSource.get({ id })
      const approvalRequestResult = ApprovalRequestSchema.safeParse(
        response.result?.approvalRequest
      )

      if (!approvalRequestResult.success) {
        return {
          error: 'API response validation failed',
          issues: approvalRequestResult.error.issues
        }
      }

      return { data: approvalRequestResult.data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async list(
    params: ApprovalRequestServiceListApprovalRequestsRequest = {}
  ): Promise<Result<ApprovalRequest[]>> {
    try {
      const response = await this.dataSource.list(params)
      const approvalRequestsResult = z
        .array(ApprovalRequestSchema)
        .safeParse(response.result?.approvalRequests)

      if (!approvalRequestsResult.success) {
        return {
          error: 'API response validation failed',
          issues: approvalRequestsResult.error.issues
        }
      }

      return { data: approvalRequestsResult.data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }

  async downloadFile(
    requestId: string,
    filePath: string
  ): Promise<Result<DownloadFileResult>> {
    try {
      const response = await this.dataSource.downloadFile({
        id: requestId,
        path: filePath
      })

      const result = response.result
      if (!result?.content) {
        return { error: 'No file content returned from API' }
      }

      return {
        data: {
          content: result.content,
          fileName: result.file?.sourcePath?.split('/').pop()
        }
      }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : String(error)
      }
    }
  }
}
