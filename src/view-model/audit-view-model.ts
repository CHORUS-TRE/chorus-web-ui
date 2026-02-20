'use client'

import { env } from 'next-runtime-env'

import { AuditDataSourceImpl } from '~/data/data-source'
import { AuditRepositoryImpl } from '~/data/repository/audit-repository-impl'
import { AuditEntry, Result } from '~/domain/model'
import { AuditListPlatform } from '~/domain/use-cases/audit/audit-list-platform'
import { AuditListUser } from '~/domain/use-cases/audit/audit-list-user'
import { AuditListWorkbench } from '~/domain/use-cases/audit/audit-list-workbench'
import { AuditListWorkspace } from '~/domain/use-cases/audit/audit-list-workspace'

const getRepository = async () => {
  const dataSource = new AuditDataSourceImpl(env('NEXT_PUBLIC_API_URL') || '')
  return new AuditRepositoryImpl(dataSource)
}

export async function listPlatform(): Promise<Result<AuditEntry[]>> {
  const repository = await getRepository()
  const useCase = new AuditListPlatform(repository)
  return await useCase.execute()
}

export async function listWorkspace(
  workspaceId: string
): Promise<Result<AuditEntry[]>> {
  const repository = await getRepository()
  const useCase = new AuditListWorkspace(repository)
  return await useCase.execute(workspaceId)
}

export async function listWorkbench(
  workbenchId: string
): Promise<Result<AuditEntry[]>> {
  const repository = await getRepository()
  const useCase = new AuditListWorkbench(repository)
  return await useCase.execute(workbenchId)
}

export async function listUser(userId: string): Promise<Result<AuditEntry[]>> {
  const repository = await getRepository()
  const useCase = new AuditListUser(repository)
  return await useCase.execute(userId)
}
