import { DevStoreEntry, Result } from '@/domain/model'
import { DevStoreRepository } from '@/domain/repository'

export interface DevStorePutUserEntryUseCase {
  execute(entry: DevStoreEntry): Promise<Result<DevStoreEntry>>
}

export class DevStorePutUserEntry implements DevStorePutUserEntryUseCase {
  constructor(private readonly repository: DevStoreRepository) {}

  async execute(entry: DevStoreEntry): Promise<Result<DevStoreEntry>> {
    return await this.repository.putUserEntry(entry)
  }
}
