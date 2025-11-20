import { Result } from '@/domain/model'
import { DevStoreRepository } from '@/domain/repository'

export interface DevStoreDeleteUserEntryUseCase {
  execute(key: string): Promise<Result<void>>
}

export class DevStoreDeleteUserEntry implements DevStoreDeleteUserEntryUseCase {
  constructor(private readonly repository: DevStoreRepository) {}

  async execute(key: string): Promise<Result<void>> {
    return await this.repository.deleteUserEntry(key)
  }
}
