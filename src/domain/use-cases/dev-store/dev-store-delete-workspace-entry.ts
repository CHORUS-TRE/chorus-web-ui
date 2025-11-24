import { Result } from '@/domain/model'
import { DevStoreRepository } from '@/domain/repository'

export interface DevStoreDeleteWorkspaceEntryUseCase {
  execute(workspaceId: string, key: string): Promise<Result<void>>
}

export class DevStoreDeleteWorkspaceEntry
  implements DevStoreDeleteWorkspaceEntryUseCase
{
  constructor(private readonly repository: DevStoreRepository) {}

  async execute(workspaceId: string, key: string): Promise<Result<void>> {
    return await this.repository.deleteWorkspaceEntry(workspaceId, key)
  }
}
