import { AuditEntry, Result } from '@/domain/model'
import { AuditRepository } from '@/domain/repository'

export interface AuditListUserUseCase {
  execute(userId: string): Promise<Result<AuditEntry[]>>
}

export class AuditListUser implements AuditListUserUseCase {
  private repository: AuditRepository

  constructor(repository: AuditRepository) {
    this.repository = repository
  }

  async execute(userId: string): Promise<Result<AuditEntry[]>> {
    return await this.repository.listUser(userId)
  }
}
