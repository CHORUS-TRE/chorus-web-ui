import {
  ApprovalRequestServiceApi,
  ApprovalRequestServiceApproveApprovalRequestRequest,
  ApprovalRequestServiceCreateDataExtractionRequestRequest,
  ApprovalRequestServiceCreateDataTransferRequestRequest,
  ApprovalRequestServiceDeleteApprovalRequestRequest,
  ApprovalRequestServiceDownloadApprovalRequestFileRequest,
  ApprovalRequestServiceGetApprovalRequestRequest,
  ApprovalRequestServiceListApprovalRequestsRequest,
  ChorusApproveApprovalRequestReply,
  ChorusCreateDataExtractionRequestReply,
  ChorusCreateDataTransferRequestReply,
  ChorusDeleteApprovalRequestReply,
  ChorusDownloadApprovalRequestFileReply,
  ChorusGetApprovalRequestReply,
  ChorusListApprovalRequestsReply,
  Configuration
} from '@/internal/client'

export interface ApprovalRequestDataSource {
  approve(
    params: ApprovalRequestServiceApproveApprovalRequestRequest
  ): Promise<ChorusApproveApprovalRequestReply>
  createDataExtraction(
    params: ApprovalRequestServiceCreateDataExtractionRequestRequest
  ): Promise<ChorusCreateDataExtractionRequestReply>
  createDataTransfer(
    params: ApprovalRequestServiceCreateDataTransferRequestRequest
  ): Promise<ChorusCreateDataTransferRequestReply>
  delete(
    params: ApprovalRequestServiceDeleteApprovalRequestRequest
  ): Promise<ChorusDeleteApprovalRequestReply>
  get(
    params: ApprovalRequestServiceGetApprovalRequestRequest
  ): Promise<ChorusGetApprovalRequestReply>
  list(
    params: ApprovalRequestServiceListApprovalRequestsRequest
  ): Promise<ChorusListApprovalRequestsReply>
  downloadFile(
    params: ApprovalRequestServiceDownloadApprovalRequestFileRequest
  ): Promise<ChorusDownloadApprovalRequestFileReply>
}

export class ApprovalRequestApiDataSourceImpl
  implements ApprovalRequestDataSource
{
  private service: ApprovalRequestServiceApi

  constructor(basePath: string) {
    const configuration = new Configuration({
      basePath,
      credentials: 'include'
    })
    this.service = new ApprovalRequestServiceApi(configuration)
  }

  approve(
    params: ApprovalRequestServiceApproveApprovalRequestRequest
  ): Promise<ChorusApproveApprovalRequestReply> {
    return this.service.approvalRequestServiceApproveApprovalRequest(params)
  }

  createDataExtraction(
    params: ApprovalRequestServiceCreateDataExtractionRequestRequest
  ): Promise<ChorusCreateDataExtractionRequestReply> {
    return this.service.approvalRequestServiceCreateDataExtractionRequest(
      params
    )
  }

  createDataTransfer(
    params: ApprovalRequestServiceCreateDataTransferRequestRequest
  ): Promise<ChorusCreateDataTransferRequestReply> {
    return this.service.approvalRequestServiceCreateDataTransferRequest(params)
  }

  delete(
    params: ApprovalRequestServiceDeleteApprovalRequestRequest
  ): Promise<ChorusDeleteApprovalRequestReply> {
    return this.service.approvalRequestServiceDeleteApprovalRequest(params)
  }

  get(
    params: ApprovalRequestServiceGetApprovalRequestRequest
  ): Promise<ChorusGetApprovalRequestReply> {
    return this.service.approvalRequestServiceGetApprovalRequest(params)
  }

  list(
    params: ApprovalRequestServiceListApprovalRequestsRequest
  ): Promise<ChorusListApprovalRequestsReply> {
    return this.service.approvalRequestServiceListApprovalRequests(params)
  }

  downloadFile(
    params: ApprovalRequestServiceDownloadApprovalRequestFileRequest
  ): Promise<ChorusDownloadApprovalRequestFileReply> {
    return this.service.approvalRequestServiceDownloadApprovalRequestFile(
      params
    )
  }
}
