import { AppInstance, Result } from '~/domain/model'
import { AppInstanceRepository } from '~/domain/repository'

export class AppInstanceGet {
  constructor(private readonly repository: AppInstanceRepository) {}

  async execute(id: string): Promise<Result<AppInstance>> {
    return this.repository.get(id)
  }
}
