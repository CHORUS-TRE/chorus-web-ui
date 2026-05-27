import {
  WorkspaceServiceInstanceCreateType,
  WorkspaceServiceInstanceListFilter,
  WorkspaceServiceInstanceUpdateType
} from '@/domain/model'
import {
  ChorusCreateWorkspaceServiceInstanceReply,
  ChorusDeleteWorkspaceServiceInstanceReply,
  ChorusGetWorkspaceServiceInstanceReply,
  ChorusListWorkspaceServiceInstancesReply,
  ChorusUpdateWorkspaceServiceInstanceReply,
  Configuration,
  WorkspaceServiceInstanceServiceApi
} from '@/internal/client'

import {
  toChorusWorkspaceServiceInstance,
  toChorusWorkspaceServiceInstanceUpdate
} from './workspace-service-instance-mapper'

interface WorkspaceServiceInstanceDataSource {
  create: (
    instance: WorkspaceServiceInstanceCreateType
  ) => Promise<ChorusCreateWorkspaceServiceInstanceReply>
  get: (id: string) => Promise<ChorusGetWorkspaceServiceInstanceReply>
  delete: (id: string) => Promise<ChorusDeleteWorkspaceServiceInstanceReply>
  list: (
    filter?: WorkspaceServiceInstanceListFilter
  ) => Promise<ChorusListWorkspaceServiceInstancesReply>
  update: (
    instance: WorkspaceServiceInstanceUpdateType
  ) => Promise<ChorusUpdateWorkspaceServiceInstanceReply>
}

export type { WorkspaceServiceInstanceDataSource }

class WorkspaceServiceInstanceDataSourceImpl
  implements WorkspaceServiceInstanceDataSource
{
  private service: WorkspaceServiceInstanceServiceApi

  constructor(basePath: string) {
    const configuration = new Configuration({
      basePath,
      credentials: 'include'
    })
    this.service = new WorkspaceServiceInstanceServiceApi(configuration)
  }

  create(
    instance: WorkspaceServiceInstanceCreateType
  ): Promise<ChorusCreateWorkspaceServiceInstanceReply> {
    const body = toChorusWorkspaceServiceInstance(instance)
    return this.service.workspaceServiceInstanceServiceCreateWorkspaceServiceInstance(
      { body }
    )
  }

  get(id: string): Promise<ChorusGetWorkspaceServiceInstanceReply> {
    return this.service.workspaceServiceInstanceServiceGetWorkspaceServiceInstance(
      { id }
    )
  }

  delete(id: string): Promise<ChorusDeleteWorkspaceServiceInstanceReply> {
    return this.service.workspaceServiceInstanceServiceDeleteWorkspaceServiceInstance(
      { id }
    )
  }

  list(
    filter?: WorkspaceServiceInstanceListFilter
  ): Promise<ChorusListWorkspaceServiceInstancesReply> {
    return this.service.workspaceServiceInstanceServiceListWorkspaceServiceInstances(
      {
        filterWorkspaceIdsIn: filter?.workspaceIds,
        paginationOffset: filter?.paginationOffset,
        paginationLimit: filter?.paginationLimit,
        paginationSortOrder: filter?.paginationSortOrder,
        paginationSortType: filter?.paginationSortType,
        paginationQuery: filter?.paginationQuery
      }
    )
  }

  update(
    instance: WorkspaceServiceInstanceUpdateType
  ): Promise<ChorusUpdateWorkspaceServiceInstanceReply> {
    const body = toChorusWorkspaceServiceInstanceUpdate(instance)
    return this.service.workspaceServiceInstanceServiceUpdateWorkspaceServiceInstance(
      { body }
    )
  }
}

export { WorkspaceServiceInstanceDataSourceImpl }
