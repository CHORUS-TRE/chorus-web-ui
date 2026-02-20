import { AuditEntry, Result } from '@/domain/model'
import { WorkspaceRepository } from '@/domain/repository'

export interface AuditListWorkspaceUseCase {
  execute(workspaceId: string): Promise<Result<AuditEntry[]>>
}

export class AuditListWorkspace implements AuditListWorkspaceUseCase {
  private repository: WorkspaceRepository

  constructor(repository: WorkspaceRepository) {
    this.repository = repository
  }

  async execute(workspaceId: string): Promise<Result<AuditEntry[]>> {
    return await this.repository.listAudit(workspaceId)
  }
}
