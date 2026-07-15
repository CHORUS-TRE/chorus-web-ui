'use client'

import { env } from 'next-runtime-env'

import { OrganizationDataSourceImpl } from '@/data/data-source'
import { OrganizationRepositoryImpl } from '@/data/repository'
import { toChorusError } from '@/data/repository/chorus-error-mapper'
import {
  Organization,
  OrganizationCreateType,
  OrganizationLogo,
  OrganizationUpdateType,
  Result
} from '@/domain/model'
import {
  OrganizationCreateSchema,
  OrganizationUpdateSchema
} from '@/domain/model/organization'
import { OrganizationCreate } from '@/domain/use-cases/organization/organization-create'
import { OrganizationDelete } from '@/domain/use-cases/organization/organization-delete'
import { OrganizationGet } from '@/domain/use-cases/organization/organization-get'
import { OrganizationLogoGet } from '@/domain/use-cases/organization/organization-logo-get'
import { OrganizationUpdate } from '@/domain/use-cases/organization/organization-update'
import { OrganizationsList } from '@/domain/use-cases/organization/organizations-list'

const getRepository = async () => {
  const dataSource = new OrganizationDataSourceImpl(
    env('NEXT_PUBLIC_API_URL') || ''
  )
  return new OrganizationRepositoryImpl(dataSource)
}

export async function organizationList(): Promise<Result<Organization[]>> {
  const repository = await getRepository()
  const useCase = new OrganizationsList(repository)
  return await useCase.execute()
}

export async function organizationGet(
  id: string
): Promise<Result<Organization>> {
  try {
    const repository = await getRepository()
    const useCase = new OrganizationGet(repository)
    return await useCase.execute(id)
  } catch (error) {
    console.error('Error getting organization', error)
    return { error: toChorusError(error) }
  }
}

export async function organizationCreate(
  prevState: Result<Organization>,
  formData: FormData
): Promise<Result<Organization>> {
  try {
    const repository = await getRepository()
    const useCase = new OrganizationCreate(repository)

    const formValues = Object.fromEntries(formData.entries())
    const logoRaw = formData.get('logo')
    const organization = {
      ...formValues,
      logo: logoRaw ? JSON.parse(logoRaw as string) : undefined
    } as unknown as OrganizationCreateType

    const validation = OrganizationCreateSchema.safeParse(organization)
    if (!validation.success) {
      return { issues: validation.error.issues }
    }

    return await useCase.execute(validation.data)
  } catch (error) {
    console.error('Error creating organization', error)
    return { error: toChorusError(error) }
  }
}

export async function organizationUpdate(
  prevState: Result<Organization>,
  formData: FormData
): Promise<Result<Organization>> {
  try {
    const repository = await getRepository()
    const useCase = new OrganizationUpdate(repository)

    const formValues = Object.fromEntries(formData.entries())
    const logoRaw = formData.get('logo')
    const organization = {
      ...formValues,
      logo: logoRaw ? JSON.parse(logoRaw as string) : undefined
    } as unknown as OrganizationUpdateType

    const validation = OrganizationUpdateSchema.safeParse(organization)
    if (!validation.success) {
      return { issues: validation.error.issues }
    }

    return await useCase.execute(validation.data)
  } catch (error) {
    console.error('Error updating organization', error)
    return { error: toChorusError(error) }
  }
}

export async function organizationDelete(id: string): Promise<Result<string>> {
  try {
    if (!id) throw new Error('Invalid organization id')
    const repository = await getRepository()
    const useCase = new OrganizationDelete(repository)
    return await useCase.execute(id)
  } catch (error) {
    console.error('Error deleting organization', error)
    return { error: toChorusError(error) }
  }
}

export async function organizationLogoGet(
  id: string
): Promise<Result<OrganizationLogo>> {
  try {
    const repository = await getRepository()
    const useCase = new OrganizationLogoGet(repository)
    return await useCase.execute(id)
  } catch (error) {
    console.error('Error getting organization logo', error)
    return { error: toChorusError(error) }
  }
}

// Builds a data URI suitable for an <img src>. Returns undefined if the
// logo has no image bytes (e.g. the organization has no logo set).
export function organizationLogoDataUrl(
  logo?: OrganizationLogo
): string | undefined {
  if (!logo?.data) return undefined
  return `data:${logo.contentType || 'image/png'};base64,${logo.data}`
}
