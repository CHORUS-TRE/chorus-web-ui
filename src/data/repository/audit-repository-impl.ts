import { AuditDataSource } from '~/data/data-source'
import {
  AuditEntry,
  AuditEntrySchema,
  AuditListPlatformParams,
  Result
} from '~/domain/model'
import { AuditRepository } from '~/domain/repository'
import { ChorusListAuditReply } from '~/internal/client'

export class AuditRepositoryImpl implements AuditRepository {
  private dataSource: AuditDataSource

  constructor(dataSource: AuditDataSource) {
    this.dataSource = dataSource
  }

  private parseEntries(response: ChorusListAuditReply): Result<AuditEntry[]> {
    if (!response.result?.entries) {
      return { data: [] }
    }
    const entries = response.result.entries.map((e) =>
      AuditEntrySchema.parse(e)
    )
    return { data: entries }
  }

  async listPlatform(
    params?: AuditListPlatformParams
  ): Promise<Result<AuditEntry[]>> {
    try {
      const response = await this.dataSource.listPlatform({ ...params })
      return this.parseEntries(response)
    } catch (error) {
      console.error('Error listing platform audit', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async listWorkspace(workspaceId: string): Promise<Result<AuditEntry[]>> {
    try {
      const response = await this.dataSource.listWorkspace({ id: workspaceId })
      return this.parseEntries(response)
    } catch (error) {
      console.error('Error listing workspace audit', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async listWorkbench(workbenchId: string): Promise<Result<AuditEntry[]>> {
    try {
      const response = await this.dataSource.listWorkbench({ id: workbenchId })
      return this.parseEntries(response)
    } catch (error) {
      console.error('Error listing workbench audit', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  async listUser(userId: string): Promise<Result<AuditEntry[]>> {
    try {
      const response = await this.dataSource.listUser({ id: userId })
      return this.parseEntries(response)
    } catch (error) {
      console.error('Error listing user audit', error)
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
}
