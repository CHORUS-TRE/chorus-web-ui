import { OrganizationCreateType, OrganizationUpdateType } from '@/domain/model'
import {
  ApiHttpBody,
  ChorusCreateOrganizationReply,
  ChorusDeleteOrganizationReply,
  ChorusGetOrganizationReply,
  ChorusListOrganizationsReply,
  ChorusUpdateOrganizationReply,
  Configuration,
  OrganizationServiceApi
} from '@/internal/client'

import {
  toChorusOrganization,
  toChorusOrganizationUpdate
} from './organization-mapper'

interface OrganizationDataSource {
  create: (
    organization: OrganizationCreateType
  ) => Promise<ChorusCreateOrganizationReply>
  get: (id: string) => Promise<ChorusGetOrganizationReply>
  delete: (id: string) => Promise<ChorusDeleteOrganizationReply>
  list: () => Promise<ChorusListOrganizationsReply>
  update: (
    organization: OrganizationUpdateType
  ) => Promise<ChorusUpdateOrganizationReply>
  getLogo: (id: string) => Promise<ApiHttpBody>
}

export type { OrganizationDataSource }

class OrganizationDataSourceImpl implements OrganizationDataSource {
  private service: OrganizationServiceApi

  constructor(basePath: string) {
    const configuration = new Configuration({
      basePath,
      credentials: 'include'
    })
    this.service = new OrganizationServiceApi(configuration)
  }

  create(
    organization: OrganizationCreateType
  ): Promise<ChorusCreateOrganizationReply> {
    const chorusOrganization = toChorusOrganization(organization)
    return this.service.organizationServiceCreateOrganization({
      body: chorusOrganization
    })
  }

  get(id: string): Promise<ChorusGetOrganizationReply> {
    return this.service.organizationServiceGetOrganization({ id })
  }

  delete(id: string): Promise<ChorusDeleteOrganizationReply> {
    return this.service.organizationServiceDeleteOrganization({ id })
  }

  list(): Promise<ChorusListOrganizationsReply> {
    return this.service.organizationServiceListOrganizations()
  }

  update(
    organization: OrganizationUpdateType
  ): Promise<ChorusUpdateOrganizationReply> {
    const body = toChorusOrganizationUpdate(organization)
    return this.service.organizationServiceUpdateOrganization({
      id: organization.id,
      body
    })
  }

  getLogo(id: string): Promise<ApiHttpBody> {
    return this.service.organizationServiceGetOrganizationLogo({ id })
  }
}

export { OrganizationDataSourceImpl }
