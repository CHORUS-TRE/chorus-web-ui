import { AuditDataSource } from '~/data/data-source'
import { AuditEntry, AuditEntrySchema, Result } from '~/domain/model'
import { AuditRepository } from '~/domain/repository'

export class AuditRepositoryImpl implements AuditRepository {
  private dataSource: AuditDataSource

  constructor(dataSource: AuditDataSource) {
    this.dataSource = dataSource
  }

  async list(): Promise<Result<AuditEntry[]>> {
    try {
      const response = await this.dataSource.list({})
      if (!response.result?.entries) {
        return { data: [] }
      }
      const entries = response.result.entries.map((e) =>
        AuditEntrySchema.parse(e)
      )
      return { data: entries }
    } catch (error) {
      console.error('Error listing platform audit', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
}
