import { AuditEntry, Result } from '@/domain/model'

interface AuditRepository {
  list: () => Promise<Result<AuditEntry[]>>
}

export type { AuditRepository }
