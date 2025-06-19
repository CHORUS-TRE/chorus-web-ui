import { Result } from '~/domain/model'
import { AppInstanceRepository } from '~/domain/repository'

export class AppInstanceDelete {
  constructor(private readonly repository: AppInstanceRepository) {}

  async execute(id: string): Promise<Result<string>> {
    return this.repository.delete(id)
  }
}
