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

  async getLogo(id: string): Promise<ApiHttpBody> {
    // The backend returns the logo as raw image bytes with a Content-Type
    // header (not a JSON envelope), so the generated JSON-parsing wrapper
    // (organizationServiceGetOrganizationLogo) can't be used here - it calls
    // response.json() on a binary body and throws. Read the raw response
    // instead and base64-encode it ourselves.
    const response =
      await this.service.organizationServiceGetOrganizationLogoRaw({ id })
    const blob = await response.raw.blob()
    if (blob.size === 0) return {}

    return {
      contentType: response.raw.headers.get('content-type') || blob.type,
      data: await blobToBase64(blob)
    }
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      resolve(result.slice(result.indexOf(',') + 1))
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

export { OrganizationDataSourceImpl }
