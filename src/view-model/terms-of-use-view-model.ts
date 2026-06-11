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

const getRepository = () =>
  new TermsOfUseRepositoryImpl(
    new TermsOfUseApiDataSourceImpl(env('NEXT_PUBLIC_API_URL') || '')
  )

export const getMyTermsOfUseStatus = (): Promise<Result<boolean>> =>
  new GetMyStatus(getRepository()).execute()

export const getCurrentTermsOfUseVersion = (): Promise<
  Result<TermsOfUseVersion | null>
> => new GetCurrentVersion(getRepository()).execute()

export const acceptTermsOfUse = (): Promise<Result<TermsOfUseAcceptance>> =>
  new Accept(getRepository()).execute()

export const listTermsOfUseVersions = (): Promise<
  Result<TermsOfUseVersion[]>
> => new ListVersions(getRepository()).execute()

export const getTermsOfUseVersion = (
  id: string
): Promise<Result<TermsOfUseVersion>> =>
  new GetVersion(getRepository()).execute(id)

export const createTermsOfUseVersion = (
  content: string
): Promise<Result<TermsOfUseVersion>> =>
  new CreateVersion(getRepository()).execute(content)

export const updateTermsOfUseVersion = (
  id: string,
  content: string
): Promise<Result<TermsOfUseVersion>> =>
  new UpdateVersion(getRepository()).execute(id, content)

export const publishTermsOfUseVersion = (
  id: string
): Promise<Result<TermsOfUseVersion>> =>
  new PublishVersion(getRepository()).execute(id)

export const listTermsOfUseAcceptances = (): Promise<
  Result<TermsOfUseAcceptance[]>
> => new ListAcceptances(getRepository()).execute()
