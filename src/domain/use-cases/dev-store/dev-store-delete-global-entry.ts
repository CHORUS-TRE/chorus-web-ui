import { Result } from '@/domain/model'
import { DevStoreRepository } from '@/domain/repository'

export interface DevStoreDeleteGlobalEntryUseCase {
  execute(key: string): Promise<Result<void>>
}

export class DevStoreDeleteGlobalEntry
  implements DevStoreDeleteGlobalEntryUseCase
{
  constructor(private readonly repository: DevStoreRepository) {}

  async execute(key: string): Promise<Result<void>> {
    return await this.repository.deleteGlobalEntry(key)
  }
}
