import { AuditEntry, AuditListPlatformParams, Result } from '@/domain/model'
import { AuditRepository } from '@/domain/repository'

export interface AuditListPlatformUseCase {
  execute(params?: AuditListPlatformParams): Promise<Result<AuditEntry[]>>
}

export class AuditListPlatform implements AuditListPlatformUseCase {
  private repository: AuditRepository

  constructor(repository: AuditRepository) {
    this.repository = repository
  }

  async execute(
    params?: AuditListPlatformParams
  ): Promise<Result<AuditEntry[]>> {
    return await this.repository.listPlatform(params)
  }
}
