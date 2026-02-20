import { AuditEntry, Result } from '@/domain/model'
import { AuditRepository } from '@/domain/repository'

export interface AuditListWorkspaceUseCase {
  execute(workspaceId: string): Promise<Result<AuditEntry[]>>
}

export class AuditListWorkspace implements AuditListWorkspaceUseCase {
  private repository: AuditRepository

  constructor(repository: AuditRepository) {
    this.repository = repository
  }

  async execute(workspaceId: string): Promise<Result<AuditEntry[]>> {
    return await this.repository.listWorkspace(workspaceId)
  }
}
