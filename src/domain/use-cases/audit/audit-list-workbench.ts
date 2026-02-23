import { AuditEntry, Result } from '@/domain/model'
import { AuditRepository } from '@/domain/repository'

export interface AuditListWorkbenchUseCase {
  execute(workbenchId: string): Promise<Result<AuditEntry[]>>
}

export class AuditListWorkbench implements AuditListWorkbenchUseCase {
  private repository: AuditRepository

  constructor(repository: AuditRepository) {
    this.repository = repository
  }

  async execute(workbenchId: string): Promise<Result<AuditEntry[]>> {
    return await this.repository.listWorkbench(workbenchId)
  }
}
