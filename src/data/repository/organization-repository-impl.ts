import { OrganizationDataSource } from '@/data/data-source'
import {
  Organization,
  OrganizationCreateType,
  OrganizationLogo,
  OrganizationUpdateType,
  Result
} from '@/domain/model'
import {
  OrganizationLogoSchema,
  OrganizationSchema
} from '@/domain/model/organization'
import { OrganizationRepository } from '@/domain/repository'

import { conversionError, toChorusError } from './chorus-error-mapper'

export class OrganizationRepositoryImpl implements OrganizationRepository {
  private dataSource: OrganizationDataSource

  constructor(dataSource: OrganizationDataSource) {
    this.dataSource = dataSource
  }

  async create(
    organization: OrganizationCreateType
  ): Promise<Result<Organization>> {
    try {
      const response = await this.dataSource.create(organization)
      if (!response.result?.organization) {
        return { error: conversionError('Error creating organization') }
      }

      const organizationResult = OrganizationSchema.safeParse(
        response.result.organization
      )
      if (!organizationResult.success) {
        return {
          error: conversionError('API response validation failed'),
          issues: organizationResult.error.issues
        }
      }

      return { data: organizationResult.data }
    } catch (error) {
      console.error('Error creating organization', error)
      return { error: toChorusError(error) }
    }
  }

  async get(id: string): Promise<Result<Organization>> {
    try {
      const response = await this.dataSource.get(id)
      if (!response.result?.organization) {
        return { error: conversionError('Not found') }
      }
      const validatedData = OrganizationSchema.parse(
        response.result.organization
      )
      return { data: validatedData }
    } catch (error) {
      console.error('Error getting organization', error)
      return { error: toChorusError(error) }
    }
  }

  async delete(id: string): Promise<Result<string>> {
    try {
      await this.dataSource.delete(id)
      return { data: id }
    } catch (error) {
      console.error('Error deleting organization', error)
      return { error: toChorusError(error) }
    }
  }

  async list(): Promise<Result<Organization[]>> {
    try {
      const response = await this.dataSource.list()
      if (!response.result?.organizations) {
        return { data: [] }
      }
      const validatedData = response.result.organizations.map((o) =>
        OrganizationSchema.parse(o)
      )
      return { data: validatedData }
    } catch (error) {
      console.error('Error listing organizations', error)
      return { error: toChorusError(error) }
    }
  }

  async update(
    organization: OrganizationUpdateType
  ): Promise<Result<Organization>> {
    try {
      await this.dataSource.update(organization)
      return this.get(organization.id)
    } catch (error) {
      console.error('Error updating organization', error)
      return { error: toChorusError(error) }
    }
  }

  async getLogo(id: string): Promise<Result<OrganizationLogo>> {
    try {
      const response = await this.dataSource.getLogo(id)
      if (!response.data) {
        return { error: conversionError('Not found') }
      }
      const validatedData = OrganizationLogoSchema.parse(response)
      return { data: validatedData }
    } catch (error) {
      console.error('Error getting organization logo', error)
      return { error: toChorusError(error) }
    }
  }
}
