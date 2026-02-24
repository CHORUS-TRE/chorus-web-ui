import { AuditEntry, AuditListPlatformParams, Result } from '@/domain/model'

interface AuditRepository {
  listPlatform: (
    params?: AuditListPlatformParams
  ) => Promise<Result<AuditEntry[]>>
  listWorkspace: (workspaceId: string) => Promise<Result<AuditEntry[]>>
  listWorkbench: (workbenchId: string) => Promise<Result<AuditEntry[]>>
  listUser: (userId: string) => Promise<Result<AuditEntry[]>>
}

export type { AuditRepository }
