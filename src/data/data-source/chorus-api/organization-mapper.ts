import {
  OrganizationCreateType,
  OrganizationUpdateType
} from '@/domain/model/organization'
import {
  ChorusOrganization,
  OrganizationServiceUpdateOrganizationBody
} from '@/internal/client'

export const toChorusOrganization = (
  organization: OrganizationCreateType
): ChorusOrganization => {
  return {
    ...organization
  }
}

export const toChorusOrganizationUpdate = (
  organization: OrganizationUpdateType
): OrganizationServiceUpdateOrganizationBody => {
  return {
    ...organization
  }
}
