import { DevStoreEntries, Result } from '@/domain/model'
import { DevStoreRepository } from '@/domain/repository'

export interface DevStoreListUserEntriesUseCase {
  execute(): Promise<Result<DevStoreEntries>>
}

export class DevStoreListUserEntries implements DevStoreListUserEntriesUseCase {
  constructor(private readonly repository: DevStoreRepository) {}

  async execute(): Promise<Result<DevStoreEntries>> {
    return await this.repository.listUserEntries()
  }
}
