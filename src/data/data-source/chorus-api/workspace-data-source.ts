import { WorkspaceCreateType, WorkspaceUpdatetype } from '~/domain/model'
import {
  ChorusCreateWorkspaceReply,
  ChorusDeleteWorkspaceReply,
  ChorusGetWorkspaceReply,
  ChorusListWorkspacesReply,
  ChorusManageUserRoleInWorkspaceReply,
  ChorusUpdateWorkspaceReply,
  Configuration,
  WorkspaceServiceApi,
  WorkspaceServiceManageUserRoleInWorkspaceBody
} from '~/internal/client'

import { toChorusWorkspace, toChorusWorkspaceUpdate } from './workspace-mapper'

interface WorkspaceDataSource {
  create: (
    workspace: WorkspaceCreateType
  ) => Promise<ChorusCreateWorkspaceReply>
  get: (id: string) => Promise<ChorusGetWorkspaceReply>
  delete: (id: string) => Promise<ChorusDeleteWorkspaceReply>
  list: () => Promise<ChorusListWorkspacesReply>
  update: (
    workspace: WorkspaceUpdatetype
  ) => Promise<ChorusUpdateWorkspaceReply>
  manageUserRole: (
    workspaceId: string,
    userId: string,
    body: WorkspaceServiceManageUserRoleInWorkspaceBody
  ) => Promise<ChorusManageUserRoleInWorkspaceReply>
}

export type { WorkspaceDataSource }

class WorkspaceDataSourceImpl implements WorkspaceDataSource {
  private service: WorkspaceServiceApi

  constructor(basePath: string) {
    const configuration = new Configuration({
      basePath,
      credentials: 'include'
    })
    this.service = new WorkspaceServiceApi(configuration)
  }

  create(workspace: WorkspaceCreateType): Promise<ChorusCreateWorkspaceReply> {
    const chorusWorkspace = toChorusWorkspace(workspace)
    return this.service.workspaceServiceCreateWorkspace({
      body: chorusWorkspace
    })
  }

  get(id: string): Promise<ChorusGetWorkspaceReply> {
    return this.service.workspaceServiceGetWorkspace({ id })
  }

  delete(id: string): Promise<ChorusDeleteWorkspaceReply> {
    return this.service.workspaceServiceDeleteWorkspace({ id })
  }

  list(): Promise<ChorusListWorkspacesReply> {
    return this.service.workspaceServiceListWorkspaces()
  }

  update(workspace: WorkspaceUpdatetype): Promise<ChorusUpdateWorkspaceReply> {
    const chorusWorkspace = toChorusWorkspaceUpdate(workspace)
    return this.service.workspaceServiceUpdateWorkspace({
      body: chorusWorkspace
    })
  }

  manageUserRole(
    workspaceId: string,
    userId: string,
    body: WorkspaceServiceManageUserRoleInWorkspaceBody
  ): Promise<ChorusManageUserRoleInWorkspaceReply> {
    return this.service.workspaceServiceManageUserRoleInWorkspace({
      id: workspaceId,
      userId,
      body
    })
  }
}

export { WorkspaceDataSourceImpl }
