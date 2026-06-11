import {
  ChorusAcceptTermsOfUseReply,
  ChorusCreateTermsOfUseVersionReply,
  ChorusGetCurrentTermsOfUseVersionReply,
  ChorusGetMyTermsOfUseStatusReply,
  ChorusGetTermsOfUseVersionReply,
  ChorusListTermsOfUseAcceptancesReply,
  ChorusListTermsOfUseVersionsReply,
  ChorusPublishTermsOfUseVersionReply,
  ChorusUpdateTermsOfUseVersionReply,
  Configuration,
  TermsOfUseServiceApi
} from '@/internal/client'

export interface TermsOfUseDataSource {
  getMyStatus(): Promise<ChorusGetMyTermsOfUseStatusReply>
  getCurrentVersion(): Promise<ChorusGetCurrentTermsOfUseVersionReply>
  accept(): Promise<ChorusAcceptTermsOfUseReply>
  listVersions(): Promise<ChorusListTermsOfUseVersionsReply>
  getVersion(id: string): Promise<ChorusGetTermsOfUseVersionReply>
  createVersion(content: string): Promise<ChorusCreateTermsOfUseVersionReply>
  updateVersion(
    id: string,
    content: string
  ): Promise<ChorusUpdateTermsOfUseVersionReply>
  publishVersion(id: string): Promise<ChorusPublishTermsOfUseVersionReply>
  listAcceptances(): Promise<ChorusListTermsOfUseAcceptancesReply>
}

export class TermsOfUseApiDataSourceImpl implements TermsOfUseDataSource {
  private service: TermsOfUseServiceApi

  constructor(basePath: string) {
    this.service = new TermsOfUseServiceApi(
      new Configuration({ basePath, credentials: 'include' })
    )
  }

  getMyStatus(): Promise<ChorusGetMyTermsOfUseStatusReply> {
    return this.service.termsOfUseServiceGetMyTermsOfUseStatus()
  }

  getCurrentVersion(): Promise<ChorusGetCurrentTermsOfUseVersionReply> {
    return this.service.termsOfUseServiceGetCurrentTermsOfUseVersion()
  }

  accept(): Promise<ChorusAcceptTermsOfUseReply> {
    return this.service.termsOfUseServiceAcceptTermsOfUse({ body: {} })
  }

  listVersions(): Promise<ChorusListTermsOfUseVersionsReply> {
    return this.service.termsOfUseServiceListTermsOfUseVersions({})
  }

  getVersion(id: string): Promise<ChorusGetTermsOfUseVersionReply> {
    return this.service.termsOfUseServiceGetTermsOfUseVersion({ id })
  }

  createVersion(content: string): Promise<ChorusCreateTermsOfUseVersionReply> {
    return this.service.termsOfUseServiceCreateTermsOfUseVersion({
      body: { content }
    })
  }

  updateVersion(
    id: string,
    content: string
  ): Promise<ChorusUpdateTermsOfUseVersionReply> {
    return this.service.termsOfUseServiceUpdateTermsOfUseVersion({
      id,
      body: { content }
    })
  }

  publishVersion(id: string): Promise<ChorusPublishTermsOfUseVersionReply> {
    return this.service.termsOfUseServicePublishTermsOfUseVersion({
      id,
      body: {}
    })
  }

  listAcceptances(): Promise<ChorusListTermsOfUseAcceptancesReply> {
    return this.service.termsOfUseServiceListTermsOfUseAcceptances()
  }
}
