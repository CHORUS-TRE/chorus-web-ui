import {
  Organization,
  OrganizationCreateType,
  OrganizationLogo,
  OrganizationUpdateType,
  Result
} from '../model'

export interface OrganizationRepository {
  list: () => Promise<Result<Organization[]>>
  create: (
    organization: OrganizationCreateType
  ) => Promise<Result<Organization>>
  update: (
    organization: OrganizationUpdateType
  ) => Promise<Result<Organization>>
  delete: (id: string) => Promise<Result<string>>
  get: (id: string) => Promise<Result<Organization>>
  getLogo: (id: string) => Promise<Result<OrganizationLogo>>
}
