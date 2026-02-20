'use client'

import { env } from 'next-runtime-env'

import { AuditDataSourceImpl } from '~/data/data-source'
import { AuditRepositoryImpl } from '~/data/repository/audit-repository-impl'
import { AuditEntry, Result } from '~/domain/model'
import { AuditListPlatform } from '~/domain/use-cases/audit/audit-list-platform'

const getRepository = async () => {
  const dataSource = new AuditDataSourceImpl(env('NEXT_PUBLIC_API_URL') || '')
  return new AuditRepositoryImpl(dataSource)
}

export async function listAudit(): Promise<Result<AuditEntry[]>> {
  const repository = await getRepository()
  const useCase = new AuditListPlatform(repository)
  return await useCase.execute()
}
