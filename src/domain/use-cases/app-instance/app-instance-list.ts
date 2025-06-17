import { AppInstance, Result } from '~/domain/model'
import { AppInstanceRepository } from '~/domain/repository'

export class AppInstanceList {
  constructor(private readonly repository: AppInstanceRepository) {}

  async execute(): Promise<Result<AppInstance[]>> {
    return this.repository.list()
  }
}
