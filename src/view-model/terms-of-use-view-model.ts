'use client'

import { env } from 'next-runtime-env'

import { TermsOfUseApiDataSourceImpl } from '@/data/data-source'
import { TermsOfUseRepositoryImpl } from '@/data/repository'
import { Result } from '@/domain/model'
import {
  TermsOfUseAcceptance,
  TermsOfUseVersion
} from '@/domain/model/terms-of-use'
import { Accept } from '@/domain/use-cases/terms-of-use/accept'
import { CreateVersion } from '@/domain/use-cases/terms-of-use/create-version'
import { GetCurrentVersion } from '@/domain/use-cases/terms-of-use/get-current-version'
import { GetMyStatus } from '@/domain/use-cases/terms-of-use/get-my-status'
import { GetVersion } from '@/domain/use-cases/terms-of-use/get-version'
import { ListAcceptances } from '@/domain/use-cases/terms-of-use/list-acceptances'
import { ListVersions } from '@/domain/use-cases/terms-of-use/list-versions'
import { PublishVersion } from '@/domain/use-cases/terms-of-use/publish-version'
import { UpdateVersion } from '@/domain/use-cases/terms-of-use/update-version'

const getRepository = async () => {
  const dataSource = new TermsOfUseApiDataSourceImpl(
    env('NEXT_PUBLIC_API_URL') || ''
  )
  return new TermsOfUseRepositoryImpl(dataSource)
}

export async function getMyTermsOfUseStatus(): Promise<Result<boolean>> {
  const repository = await getRepository()
  const useCase = new GetMyStatus(repository)
  return await useCase.execute()
}

export async function getCurrentTermsOfUseVersion(): Promise<
  Result<TermsOfUseVersion | null>
> {
  const repository = await getRepository()
  const useCase = new GetCurrentVersion(repository)
  return await useCase.execute()
}

export async function acceptTermsOfUse(): Promise<Result<TermsOfUseAcceptance>> {
  const repository = await getRepository()
  const useCase = new Accept(repository)
  return await useCase.execute()
}

export async function listTermsOfUseVersions(): Promise<
  Result<TermsOfUseVersion[]>
> {
  const repository = await getRepository()
  const useCase = new ListVersions(repository)
  return await useCase.execute()
}

export async function getTermsOfUseVersion(
  id: string
): Promise<Result<TermsOfUseVersion>> {
  const repository = await getRepository()
  const useCase = new GetVersion(repository)
  return await useCase.execute(id)
}

export async function createTermsOfUseVersion(
  content: string
): Promise<Result<TermsOfUseVersion>> {
  const repository = await getRepository()
  const useCase = new CreateVersion(repository)
  return await useCase.execute(content)
}

export async function updateTermsOfUseVersion(
  id: string,
  content: string
): Promise<Result<TermsOfUseVersion>> {
  const repository = await getRepository()
  const useCase = new UpdateVersion(repository)
  return await useCase.execute(id, content)
}

export async function publishTermsOfUseVersion(
  id: string
): Promise<Result<TermsOfUseVersion>> {
  const repository = await getRepository()
  const useCase = new PublishVersion(repository)
  return await useCase.execute(id)
}

export async function listTermsOfUseAcceptances(): Promise<
  Result<TermsOfUseAcceptance[]>
> {
  const repository = await getRepository()
  const useCase = new ListAcceptances(repository)
  return await useCase.execute()
}
