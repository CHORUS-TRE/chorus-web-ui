import { Result, WorkspaceServiceInstanceSecrets } from '@/domain/model'
import { WorkspaceServiceInstanceRepository } from '@/domain/repository'

export interface WorkspaceServiceInstanceGetSecretsUseCase {
  execute(id: string): Promise<Result<WorkspaceServiceInstanceSecrets>>
}

export class WorkspaceServiceInstanceGetSecrets
  implements WorkspaceServiceInstanceGetSecretsUseCase
{
  private repository: WorkspaceServiceInstanceRepository

  constructor(repository: WorkspaceServiceInstanceRepository) {
    this.repository = repository
  }

  async execute(id: string): Promise<Result<WorkspaceServiceInstanceSecrets>> {
    return await this.repository.getSecrets(id)
  }
}
