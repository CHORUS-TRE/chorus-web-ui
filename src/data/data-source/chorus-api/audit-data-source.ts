import {
  AuditServiceApi,
  AuditServiceListAuditEntriesRequest,
  ChorusListAuditEntriesReply,
  Configuration
} from '~/internal/client'

interface AuditDataSource {
  list: (
    request: AuditServiceListAuditEntriesRequest
  ) => Promise<ChorusListAuditEntriesReply>
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

  list(
    request: AuditServiceListAuditEntriesRequest
  ): Promise<ChorusListAuditEntriesReply> {
    return this.client.auditServiceListAuditEntries(request)
  }
}
