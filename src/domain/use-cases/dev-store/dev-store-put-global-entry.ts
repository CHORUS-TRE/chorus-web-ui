import { DevStoreEntry, Result } from '@/domain/model'
import { DevStoreRepository } from '@/domain/repository'

export interface DevStorePutGlobalEntryUseCase {
  execute(entry: DevStoreEntry): Promise<Result<DevStoreEntry>>
}

export class DevStorePutGlobalEntry implements DevStorePutGlobalEntryUseCase {
  constructor(private readonly repository: DevStoreRepository) {}

  async execute(entry: DevStoreEntry): Promise<Result<DevStoreEntry>> {
    return await this.repository.putGlobalEntry(entry)
  }
}
