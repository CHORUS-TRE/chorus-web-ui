'use client'

import { env } from 'next-runtime-env'

import { AuthorizationApiDataSourceImpl } from '@/data/data-source'
import { AuthorizationRepositoryImpl } from '@/data/repository'
import { Result } from '@/domain/model'
import {
  AuthorizationPermission,
  AuthorizationRole
} from '@/domain/model/authorization'

const getRepository = async () => {
  const dataSource = new AuthorizationApiDataSourceImpl(
    env('NEXT_PUBLIC_API_URL') || ''
  )
  return new AuthorizationRepositoryImpl(dataSource)
}

export async function listRoles(): Promise<Result<AuthorizationRole[]>> {
  const repository = await getRepository()
  return repository.listRoles()
}

export async function listPermissions(): Promise<
  Result<AuthorizationPermission[]>
> {
  const repository = await getRepository()
  return repository.listPermissions()
}
