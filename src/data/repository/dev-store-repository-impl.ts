import { DevStoreDataSource } from '~/data/data-source'
import {
  DevStoreEntries,
  devStoreEntriesSchema,
  DevStoreEntry,
  devStoreEntrySchema,
  Result
} from '~/domain/model'
import { DevStoreRepository } from '~/domain/repository'

export class DevStoreRepositoryImpl implements DevStoreRepository {
  private dataSource: DevStoreDataSource

  constructor(dataSource: DevStoreDataSource) {
    this.dataSource = dataSource
  }

  // Global
  async getGlobalEntry(key: string): Promise<Result<DevStoreEntry>> {
    try {
      const response = await this.dataSource.getGlobalEntry(key)
      if (!response.result) {
        return { error: 'Not found' }
      }
      const validatedData = devStoreEntrySchema.parse(response.result)
      return { data: validatedData }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
  async listGlobalEntries(): Promise<Result<DevStoreEntries>> {
    try {
      const response = await this.dataSource.listGlobalEntries()
      if (!response.result?.entries) {
        return { data: {} }
      }
      const validatedData = devStoreEntriesSchema.parse(response.result.entries)
      return { data: validatedData }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
  async putGlobalEntry(entry: DevStoreEntry): Promise<Result<DevStoreEntry>> {
    try {
      const response = await this.dataSource.putGlobalEntry(entry)
      if (!response.result) {
        return { error: 'Error putting entry' }
      }
      const validatedData = devStoreEntrySchema.parse(response.result)
      return { data: validatedData }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
  async deleteGlobalEntry(key: string): Promise<Result<void>> {
    try {
      await this.dataSource.deleteGlobalEntry(key)
      return { data: undefined }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  // User
  async getUserEntry(key: string): Promise<Result<DevStoreEntry>> {
    try {
      const response = await this.dataSource.getUserEntry(key)
      if (!response.result) {
        return { error: 'Not found' }
      }
      const validatedData = devStoreEntrySchema.parse(response.result)
      return { data: validatedData }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
  async listUserEntries(): Promise<Result<DevStoreEntries>> {
    try {
      const response = await this.dataSource.listUserEntries()
      if (!response.result?.entries) {
        return { data: {} }
      }
      const validatedData = devStoreEntriesSchema.parse(response.result.entries)
      return { data: validatedData }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
  async putUserEntry(entry: DevStoreEntry): Promise<Result<DevStoreEntry>> {
    try {
      const response = await this.dataSource.putUserEntry(entry)
      if (!response.result) {
        return { error: 'Error putting entry' }
      }
      const validatedData = devStoreEntrySchema.parse(response.result)
      return { data: validatedData }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
  async deleteUserEntry(key: string): Promise<Result<void>> {
    try {
      await this.dataSource.deleteUserEntry(key)
      return { data: undefined }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }

  // Workspace
  async getWorkspaceEntry(
    workspaceId: string,
    key: string
  ): Promise<Result<DevStoreEntry>> {
    try {
      const response = await this.dataSource.getWorkspaceEntry(workspaceId, key)
      if (!response.result) {
        return { error: 'Not found' }
      }
      const validatedData = devStoreEntrySchema.parse(response.result)
      return { data: validatedData }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
  async listWorkspaceEntries(
    workspaceId: string
  ): Promise<Result<DevStoreEntries>> {
    try {
      const response = await this.dataSource.listWorkspaceEntries(workspaceId)
      if (!response.result?.entries) {
        return { data: {} }
      }
      const validatedData = devStoreEntriesSchema.parse(response.result.entries)
      return { data: validatedData }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
  async putWorkspaceEntry(
    workspaceId: string,
    entry: DevStoreEntry
  ): Promise<Result<DevStoreEntry>> {
    try {
      const response = await this.dataSource.putWorkspaceEntry(
        workspaceId,
        entry
      )
      if (!response.result) {
        return { error: 'Error putting entry' }
      }
      const validatedData = devStoreEntrySchema.parse(response.result)
      return { data: validatedData }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
  async deleteWorkspaceEntry(
    workspaceId: string,
    key: string
  ): Promise<Result<void>> {
    try {
      await this.dataSource.deleteWorkspaceEntry(workspaceId, key)
      return { data: undefined }
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
}
