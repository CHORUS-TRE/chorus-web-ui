import {
  ChorusCreateWorkspaceServiceInstanceReply,
  ChorusDeleteWorkspaceServiceInstanceReply,
  ChorusGetWorkspaceServiceInstanceReply,
  ChorusListWorkspaceServiceInstancesReply,
  ChorusUpdateWorkspaceServiceInstanceReply,
  ChorusWorkspaceServiceInstance,
  Configuration,
  WorkspaceServiceInstanceServiceApi
} from '@/internal/client'

interface WorkspaceServiceInstanceDataSource {
  get: (id: string) => Promise<ChorusGetWorkspaceServiceInstanceReply>
  list: (
    workspaceId?: string
  ) => Promise<ChorusListWorkspaceServiceInstancesReply>
  create: (
    instance: ChorusWorkspaceServiceInstance
  ) => Promise<ChorusCreateWorkspaceServiceInstanceReply>
  update: (
    instance: ChorusWorkspaceServiceInstance
  ) => Promise<ChorusUpdateWorkspaceServiceInstanceReply>
  delete: (id: string) => Promise<ChorusDeleteWorkspaceServiceInstanceReply>
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

  get(id: string): Promise<ChorusGetWorkspaceServiceInstanceReply> {
    return this.service.workspaceServiceInstanceServiceGetWorkspaceServiceInstance(
      { id }
    )
  }

  list(
    workspaceId?: string
  ): Promise<ChorusListWorkspaceServiceInstancesReply> {
    return this.service.workspaceServiceInstanceServiceListWorkspaceServiceInstances(
      {
        filterWorkspaceIdsIn: workspaceId ? [workspaceId] : undefined
      }
    )
  }

  create(
    instance: ChorusWorkspaceServiceInstance
  ): Promise<ChorusCreateWorkspaceServiceInstanceReply> {
    return this.service.workspaceServiceInstanceServiceCreateWorkspaceServiceInstance(
      { body: instance }
    )
  }

  update(
    instance: ChorusWorkspaceServiceInstance
  ): Promise<ChorusUpdateWorkspaceServiceInstanceReply> {
    return this.service.workspaceServiceInstanceServiceUpdateWorkspaceServiceInstance(
      { body: instance }
    )
  }

  delete(id: string): Promise<ChorusDeleteWorkspaceServiceInstanceReply> {
    return this.service.workspaceServiceInstanceServiceDeleteWorkspaceServiceInstance(
      { id }
    )
  }
}

export { WorkspaceServiceInstanceDataSourceImpl }
