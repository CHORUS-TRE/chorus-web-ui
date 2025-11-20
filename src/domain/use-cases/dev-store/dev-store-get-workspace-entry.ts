import { DevStoreEntry, Result } from '@/domain/model'
import { DevStoreRepository } from '@/domain/repository'

export interface DevStoreGetWorkspaceEntryUseCase {
  execute(workspaceId: string, key: string): Promise<Result<DevStoreEntry>>
}

export class DevStoreGetWorkspaceEntry
  implements DevStoreGetWorkspaceEntryUseCase
{
  constructor(private readonly repository: DevStoreRepository) {}

  async execute(
    workspaceId: string,
    key: string
  ): Promise<Result<DevStoreEntry>> {
    return await this.repository.getWorkspaceEntry(workspaceId, key)
  }
}
