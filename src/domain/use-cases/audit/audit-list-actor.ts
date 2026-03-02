import { AuditEntry, Result } from '@/domain/model'
import { AuditRepository } from '@/domain/repository'

export interface AuditListActorUseCase {
  execute(actorId: string): Promise<Result<AuditEntry[]>>
}

export class AuditListActor implements AuditListActorUseCase {
  private repository: AuditRepository

  constructor(repository: AuditRepository) {
    this.repository = repository
  }

  async execute(actorId: string): Promise<Result<AuditEntry[]>> {
    return await this.repository.listActor(actorId)
  }
}
