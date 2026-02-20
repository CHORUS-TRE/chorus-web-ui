import {
  AuditServiceApi,
  AuditServiceListPlatformAuditRequest,
  AuditServiceListUserAuditRequest,
  AuditServiceListWorkbenchAuditRequest,
  AuditServiceListWorkspaceAuditRequest,
  ChorusListAuditReply,
  Configuration
} from '~/internal/client'

interface AuditDataSource {
  listPlatform: (
    request: AuditServiceListPlatformAuditRequest
  ) => Promise<ChorusListAuditReply>
  listWorkspace: (
    request: AuditServiceListWorkspaceAuditRequest
  ) => Promise<ChorusListAuditReply>
  listWorkbench: (
    request: AuditServiceListWorkbenchAuditRequest
  ) => Promise<ChorusListAuditReply>
  listUser: (
    request: AuditServiceListUserAuditRequest
  ) => Promise<ChorusListAuditReply>
}

export type { AuditDataSource }

export class AuditDataSourceImpl implements AuditDataSource {
  private client: AuditServiceApi

  constructor(basePath: string) {
    const configuration = new Configuration({
      basePath,
      credentials: 'include'
    })
    this.client = new AuditServiceApi(configuration)
  }

  listPlatform(
    request: AuditServiceListPlatformAuditRequest
  ): Promise<ChorusListAuditReply> {
    return this.client.auditServiceListPlatformAudit(request)
  }

  listWorkspace(
    request: AuditServiceListWorkspaceAuditRequest
  ): Promise<ChorusListAuditReply> {
    return this.client.auditServiceListWorkspaceAudit(request)
  }

  listWorkbench(
    request: AuditServiceListWorkbenchAuditRequest
  ): Promise<ChorusListAuditReply> {
    return this.client.auditServiceListWorkbenchAudit(request)
  }

  listUser(
    request: AuditServiceListUserAuditRequest
  ): Promise<ChorusListAuditReply> {
    return this.client.auditServiceListUserAudit(request)
  }
}
