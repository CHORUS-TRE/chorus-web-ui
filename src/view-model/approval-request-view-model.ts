'use client'
import { env } from 'next-runtime-env'

import { ApprovalRequestApiDataSourceImpl } from '@/data/data-source'
import { ApprovalRequestRepositoryImpl } from '@/data/repository'
import { Result } from '@/domain/model'
import {
  ApprovalRequest,
  ApproveApprovalRequestAction,
  CreateDataExtractionRequest,
  CreateDataTransferRequest
} from '@/domain/model/approval-request'
import { ApproveApprovalRequest } from '@/domain/use-cases/approval-request/approve-approval-request'
import { CreateDataExtractionRequestUseCase } from '@/domain/use-cases/approval-request/create-data-extraction-request'
import { CreateDataTransferRequestUseCase } from '@/domain/use-cases/approval-request/create-data-transfer-request'
import { DeleteApprovalRequest } from '@/domain/use-cases/approval-request/delete-approval-request'
import { GetApprovalRequest } from '@/domain/use-cases/approval-request/get-approval-request'
import { ListApprovalRequests } from '@/domain/use-cases/approval-request/list-approval-requests'
import { ApprovalRequestServiceListApprovalRequestsRequest } from '@/internal/client'

const getRepository = async () => {
  const dataSource = new ApprovalRequestApiDataSourceImpl(
    env('NEXT_PUBLIC_API_URL') || ''
  )
  return new ApprovalRequestRepositoryImpl(dataSource)
}

export async function approveApprovalRequest(
  action: ApproveApprovalRequestAction
): Promise<Result<void>> {
  const repository = await getRepository()
  const useCase = new ApproveApprovalRequest(repository)
  return await useCase.execute(action)
}

export async function createDataExtractionRequest(
  request: CreateDataExtractionRequest
): Promise<Result<ApprovalRequest>> {
  const repository = await getRepository()
  const useCase = new CreateDataExtractionRequestUseCase(repository)
  return await useCase.execute(request)
}

export async function createDataTransferRequest(
  request: CreateDataTransferRequest
): Promise<Result<ApprovalRequest>> {
  const repository = await getRepository()
  const useCase = new CreateDataTransferRequestUseCase(repository)
  return await useCase.execute(request)
}

export async function deleteApprovalRequest(id: string): Promise<Result<void>> {
  const repository = await getRepository()
  const useCase = new DeleteApprovalRequest(repository)
  return await useCase.execute(id)
}

export async function getApprovalRequest(
  id: string
): Promise<Result<ApprovalRequest>> {
  const repository = await getRepository()
  const useCase = new GetApprovalRequest(repository)
  return await useCase.execute(id)
}

export async function listApprovalRequests(
  params?: ApprovalRequestServiceListApprovalRequestsRequest
): Promise<Result<ApprovalRequest[]>> {
  const repository = await getRepository()
  const useCase = new ListApprovalRequests(repository)
  return await useCase.execute(params)
}
