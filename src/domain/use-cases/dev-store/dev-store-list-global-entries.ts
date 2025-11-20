import { DevStoreEntries, Result } from '@/domain/model'
import { DevStoreRepository } from '@/domain/repository'

export interface DevStoreListGlobalEntriesUseCase {
  execute(): Promise<Result<DevStoreEntries>>
}

export class DevStoreListGlobalEntries
  implements DevStoreListGlobalEntriesUseCase
{
  constructor(private readonly repository: DevStoreRepository) {}

  async execute(): Promise<Result<DevStoreEntries>> {
    return await this.repository.listGlobalEntries()
  }
}
