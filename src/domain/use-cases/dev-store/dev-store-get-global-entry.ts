import { DevStoreEntry, Result } from '@/domain/model'
import { DevStoreRepository } from '@/domain/repository'

export interface DevStoreGetGlobalEntryUseCase {
  execute(key: string): Promise<Result<DevStoreEntry>>
}

export class DevStoreGetGlobalEntry implements DevStoreGetGlobalEntryUseCase {
  constructor(private readonly repository: DevStoreRepository) {}

  async execute(key: string): Promise<Result<DevStoreEntry>> {
    return await this.repository.getGlobalEntry(key)
  }
}
