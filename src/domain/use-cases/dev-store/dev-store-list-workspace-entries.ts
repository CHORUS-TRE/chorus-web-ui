import { DevStoreEntries, Result } from '@/domain/model'
import { DevStoreRepository } from '@/domain/repository'

export interface DevStoreListWorkspaceEntriesUseCase {
  execute(workspaceId: string): Promise<Result<DevStoreEntries>>
}

export class DevStoreListWorkspaceEntries
  implements DevStoreListWorkspaceEntriesUseCase
{
  constructor(private readonly repository: DevStoreRepository) {}

  async execute(workspaceId: string): Promise<Result<DevStoreEntries>> {
    return await this.repository.listWorkspaceEntries(workspaceId)
  }
}
