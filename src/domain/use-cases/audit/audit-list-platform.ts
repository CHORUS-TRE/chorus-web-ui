import { AuditEntry, Result } from '@/domain/model'
import { AuditRepository } from '@/domain/repository'

export interface AuditListPlatformUseCase {
  execute(): Promise<Result<AuditEntry[]>>
}

export class AuditListPlatform implements AuditListPlatformUseCase {
  private repository: AuditRepository

  constructor(repository: AuditRepository) {
    this.repository = repository
  }

  async execute(): Promise<Result<AuditEntry[]>> {
    return await this.repository.listPlatform()
  }
}
