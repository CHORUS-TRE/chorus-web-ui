import { DevStoreEntry, Result } from '@/domain/model'
import { DevStoreRepository } from '@/domain/repository'

export interface DevStorePutWorkspaceEntryUseCase {
  execute(
    workspaceId: string,
    entry: DevStoreEntry
  ): Promise<Result<DevStoreEntry>>
}

export class DevStorePutWorkspaceEntry
  implements DevStorePutWorkspaceEntryUseCase
{
  constructor(private readonly repository: DevStoreRepository) {}

  async execute(
    workspaceId: string,
    entry: DevStoreEntry
  ): Promise<Result<DevStoreEntry>> {
    return await this.repository.putWorkspaceEntry(workspaceId, entry)
  }
}
