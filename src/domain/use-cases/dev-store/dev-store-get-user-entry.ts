import { DevStoreEntry, Result } from '@/domain/model'
import { DevStoreRepository } from '@/domain/repository'

export interface DevStoreGetUserEntryUseCase {
  execute(key: string): Promise<Result<DevStoreEntry>>
}

export class DevStoreGetUserEntry implements DevStoreGetUserEntryUseCase {
  constructor(private readonly repository: DevStoreRepository) {}

  async execute(key: string): Promise<Result<DevStoreEntry>> {
    return await this.repository.getUserEntry(key)
  }
}
