'use client'

import { env } from 'next-runtime-env'

import { DevStoreDataSourceImpl } from '~/data/data-source'
import { DevStoreRepositoryImpl } from '~/data/repository'
import { DevStoreEntries, DevStoreEntry, Result } from '~/domain/model'
import { DevStoreDeleteGlobalEntry } from '~/domain/use-cases/dev-store/dev-store-delete-global-entry'
import { DevStoreDeleteUserEntry } from '~/domain/use-cases/dev-store/dev-store-delete-user-entry'
import { DevStoreDeleteWorkspaceEntry } from '~/domain/use-cases/dev-store/dev-store-delete-workspace-entry'
import { DevStoreGetGlobalEntry } from '~/domain/use-cases/dev-store/dev-store-get-global-entry'
import { DevStoreGetUserEntry } from '~/domain/use-cases/dev-store/dev-store-get-user-entry'
import { DevStoreGetWorkspaceEntry } from '~/domain/use-cases/dev-store/dev-store-get-workspace-entry'
import { DevStoreListGlobalEntries } from '~/domain/use-cases/dev-store/dev-store-list-global-entries'
import { DevStoreListUserEntries } from '~/domain/use-cases/dev-store/dev-store-list-user-entries'
import { DevStoreListWorkspaceEntries } from '~/domain/use-cases/dev-store/dev-store-list-workspace-entries'
import { DevStorePutGlobalEntry } from '~/domain/use-cases/dev-store/dev-store-put-global-entry'
import { DevStorePutUserEntry } from '~/domain/use-cases/dev-store/dev-store-put-user-entry'
import { DevStorePutWorkspaceEntry } from '~/domain/use-cases/dev-store/dev-store-put-workspace-entry'

const getRepository = async () => {
  const dataSource = new DevStoreDataSourceImpl(
    env('NEXT_PUBLIC_API_URL') || ''
  )
  return new DevStoreRepositoryImpl(dataSource)
}

// Global Scope
export async function getGlobalEntry(
  key: string
): Promise<Result<DevStoreEntry>> {
  try {
    const repository = await getRepository()
    const useCase = new DevStoreGetGlobalEntry(repository)
    return await useCase.execute(key)
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function listGlobalEntries(): Promise<Result<DevStoreEntries>> {
  try {
    const repository = await getRepository()
    const useCase = new DevStoreListGlobalEntries(repository)
    return await useCase.execute()
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function putGlobalEntry(
  entry: DevStoreEntry
): Promise<Result<DevStoreEntry>> {
  try {
    const repository = await getRepository()
    const useCase = new DevStorePutGlobalEntry(repository)
    return await useCase.execute(entry)
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function deleteGlobalEntry(key: string): Promise<Result<void>> {
  try {
    const repository = await getRepository()
    const useCase = new DevStoreDeleteGlobalEntry(repository)
    return await useCase.execute(key)
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

// User Scope
export async function getUserEntry(
  key: string
): Promise<Result<DevStoreEntry>> {
  try {
    const repository = await getRepository()
    const useCase = new DevStoreGetUserEntry(repository)
    return await useCase.execute(key)
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function listUserEntries(): Promise<Result<DevStoreEntries>> {
  try {
    const repository = await getRepository()
    const useCase = new DevStoreListUserEntries(repository)
    return await useCase.execute()
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function putUserEntry(
  entry: DevStoreEntry
): Promise<Result<DevStoreEntry>> {
  try {
    const repository = await getRepository()
    const useCase = new DevStorePutUserEntry(repository)
    return await useCase.execute(entry)
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function deleteUserEntry(key: string): Promise<Result<void>> {
  try {
    const repository = await getRepository()
    const useCase = new DevStoreDeleteUserEntry(repository)
    return await useCase.execute(key)
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

// Workspace Scope
export async function getWorkspaceEntry(
  workspaceId: string,
  key: string
): Promise<Result<DevStoreEntry>> {
  try {
    const repository = await getRepository()
    const useCase = new DevStoreGetWorkspaceEntry(repository)
    return await useCase.execute(workspaceId, key)
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function listWorkspaceEntries(
  workspaceId: string
): Promise<Result<DevStoreEntries>> {
  try {
    const repository = await getRepository()
    const useCase = new DevStoreListWorkspaceEntries(repository)
    return await useCase.execute(workspaceId)
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function putWorkspaceEntry(
  workspaceId: string,
  entry: DevStoreEntry
): Promise<Result<DevStoreEntry>> {
  try {
    const repository = await getRepository()
    const useCase = new DevStorePutWorkspaceEntry(repository)
    return await useCase.execute(workspaceId, entry)
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

export async function deleteWorkspaceEntry(
  workspaceId: string,
  key: string
): Promise<Result<void>> {
  try {
    const repository = await getRepository()
    const useCase = new DevStoreDeleteWorkspaceEntry(repository)
    return await useCase.execute(workspaceId, key)
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
