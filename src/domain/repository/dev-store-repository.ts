import { Result } from '../model'
import { DevStoreEntries, DevStoreEntry } from '../model/dev-store'

export interface DevStoreRepository {
  // Global Scope
  getGlobalEntry(key: string): Promise<Result<DevStoreEntry>>
  listGlobalEntries(): Promise<Result<DevStoreEntries>>
  putGlobalEntry(entry: DevStoreEntry): Promise<Result<DevStoreEntry>>
  deleteGlobalEntry(key: string): Promise<Result<void>>

  // User Scope
  getUserEntry(key: string): Promise<Result<DevStoreEntry>>
  listUserEntries(): Promise<Result<DevStoreEntries>>
  putUserEntry(entry: DevStoreEntry): Promise<Result<DevStoreEntry>>
  deleteUserEntry(key: string): Promise<Result<void>>

  // Workspace Scope
  getWorkspaceEntry(
    workspaceId: string,
    key: string
  ): Promise<Result<DevStoreEntry>>
  listWorkspaceEntries(workspaceId: string): Promise<Result<DevStoreEntries>>
  putWorkspaceEntry(
    workspaceId: string,
    entry: DevStoreEntry
  ): Promise<Result<DevStoreEntry>>
  deleteWorkspaceEntry(workspaceId: string, key: string): Promise<Result<void>>
}
