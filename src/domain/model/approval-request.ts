import { z } from 'zod'

export enum ApprovalRequestStatus {
  UNSPECIFIED = 'APPROVAL_REQUEST_STATUS_UNSPECIFIED',
  PENDING = 'APPROVAL_REQUEST_STATUS_PENDING',
  APPROVED = 'APPROVAL_REQUEST_STATUS_APPROVED',
  REJECTED = 'APPROVAL_REQUEST_STATUS_REJECTED',
  CANCELLED = 'APPROVAL_REQUEST_STATUS_CANCELLED'
}

export enum ApprovalRequestType {
  UNSPECIFIED = 'APPROVAL_REQUEST_TYPE_UNSPECIFIED',
  DATA_EXTRACTION = 'APPROVAL_REQUEST_TYPE_DATA_EXTRACTION',
  DATA_TRANSFER = 'APPROVAL_REQUEST_TYPE_DATA_TRANSFER'
}

export const ApprovalRequestFileSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  size: z.string().optional(),
  mimeType: z.string().optional()
})

export const DataExtractionDetailsSchema = z.object({
  sourceWorkspaceId: z.string().optional(),
  files: z.array(ApprovalRequestFileSchema).optional()
})

export const DataTransferDetailsSchema = z.object({
  sourceWorkspaceId: z.string().optional(),
  destinationWorkspaceId: z.string().optional(),
  files: z.array(ApprovalRequestFileSchema).optional()
})

export const ApprovalRequestSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().optional(),
  requesterId: z.string().optional(),
  type: z.nativeEnum(ApprovalRequestType).optional(),
  status: z.nativeEnum(ApprovalRequestStatus).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  dataExtraction: DataExtractionDetailsSchema.optional(),
  dataTransfer: DataTransferDetailsSchema.optional(),
  approverIds: z.array(z.string()).optional(),
  approvedById: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  approvedAt: z.date().optional()
})

export const CreateDataExtractionRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  sourceWorkspaceId: z.string(),
  fileIds: z.array(z.string())
})

export const CreateDataTransferRequestSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  sourceWorkspaceId: z.string(),
  destinationWorkspaceId: z.string(),
  fileIds: z.array(z.string())
})

export const ApproveApprovalRequestSchema = z.object({
  id: z.string(),
  approved: z.boolean(),
  reason: z.string().optional()
})

export type ApprovalRequest = z.infer<typeof ApprovalRequestSchema>
export type ApprovalRequestFile = z.infer<typeof ApprovalRequestFileSchema>
export type DataExtractionDetails = z.infer<typeof DataExtractionDetailsSchema>
export type DataTransferDetails = z.infer<typeof DataTransferDetailsSchema>
export type CreateDataExtractionRequest = z.infer<
  typeof CreateDataExtractionRequestSchema
>
export type CreateDataTransferRequest = z.infer<
  typeof CreateDataTransferRequestSchema
>
export type ApproveApprovalRequestAction = z.infer<
  typeof ApproveApprovalRequestSchema
>
