import { DevStoreEntry } from '~/domain/model'
import {
  ChorusDeleteEntryReply,
  ChorusGetEntryReply,
  ChorusListEntriesReply,
  ChorusPutEntryReply,
  Configuration,
  DevstoreServiceApi
} from '~/internal/client'

import {
  toChorusPutEntryRequest,
  toDevstoreServicePutWorkspaceEntryBody
} from './dev-store-mapper'

interface DevStoreDataSource {
  // Global
  deleteGlobalEntry(key: string): Promise<ChorusDeleteEntryReply>
  getGlobalEntry(key: string): Promise<ChorusGetEntryReply>
  listGlobalEntries(): Promise<ChorusListEntriesReply>
  putGlobalEntry(entry: DevStoreEntry): Promise<ChorusPutEntryReply>

  // User
  deleteUserEntry(key: string): Promise<ChorusDeleteEntryReply>
  getUserEntry(key: string): Promise<ChorusGetEntryReply>
  listUserEntries(): Promise<ChorusListEntriesReply>
  putUserEntry(entry: DevStoreEntry): Promise<ChorusPutEntryReply>

  // Workspace
  deleteWorkspaceEntry(
    workspaceId: string,
    key: string
  ): Promise<ChorusDeleteEntryReply>
  getWorkspaceEntry(
    workspaceId: string,
    key: string
  ): Promise<ChorusGetEntryReply>
  listWorkspaceEntries(workspaceId: string): Promise<ChorusListEntriesReply>
  putWorkspaceEntry(
    workspaceId: string,
    entry: DevStoreEntry
  ): Promise<ChorusPutEntryReply>
}

export class DevStoreDataSourceImpl implements DevStoreDataSource {
  private service: DevstoreServiceApi

  constructor(basePath: string) {
    const configuration = new Configuration({
      basePath,
      credentials: 'include'
    })
    this.service = new DevstoreServiceApi(configuration) as DevstoreServiceApi
  }

  // Global
  deleteGlobalEntry(key: string): Promise<ChorusDeleteEntryReply> {
    return this.service.devstoreServiceDeleteGlobalEntry({ key })
  }
  getGlobalEntry(key: string): Promise<ChorusGetEntryReply> {
    return this.service.devstoreServiceGetGlobalEntry({ key })
  }
  listGlobalEntries(): Promise<ChorusListEntriesReply> {
    return this.service.devstoreServiceListGlobalEntries()
  }
  putGlobalEntry(entry: DevStoreEntry): Promise<ChorusPutEntryReply> {
    return this.service.devstoreServicePutGlobalEntry({
      body: toChorusPutEntryRequest(entry)
    })
  }

  // User
  deleteUserEntry(key: string): Promise<ChorusDeleteEntryReply> {
    return this.service.devstoreServiceDeleteUserEntry({ key })
  }
  getUserEntry(key: string): Promise<ChorusGetEntryReply> {
    return this.service.devstoreServiceGetUserEntry({ key })
  }
  listUserEntries(): Promise<ChorusListEntriesReply> {
    return this.service.devstoreServiceListUserEntries()
  }
  putUserEntry(entry: DevStoreEntry): Promise<ChorusPutEntryReply> {
    return this.service.devstoreServicePutUserEntry({
      body: toChorusPutEntryRequest(entry)
    })
  }

  // Workspace
  deleteWorkspaceEntry(
    workspaceId: string,
    key: string
  ): Promise<ChorusDeleteEntryReply> {
    return this.service.devstoreServiceDeleteWorkspaceEntry({
      id: workspaceId,
      key
    })
  }
  getWorkspaceEntry(
    workspaceId: string,
    key: string
  ): Promise<ChorusGetEntryReply> {
    return this.service.devstoreServiceGetWorkspaceEntry({
      id: workspaceId,
      key
    })
  }
  listWorkspaceEntries(workspaceId: string): Promise<ChorusListEntriesReply> {
    return this.service.devstoreServiceListWorkspaceEntries({ id: workspaceId })
  }
  putWorkspaceEntry(
    workspaceId: string,
    entry: DevStoreEntry
  ): Promise<ChorusPutEntryReply> {
    return this.service.devstoreServicePutWorkspaceEntry({
      id: workspaceId,
      body: toDevstoreServicePutWorkspaceEntryBody(entry)
    })
  }
}

export type { DevStoreDataSource }
