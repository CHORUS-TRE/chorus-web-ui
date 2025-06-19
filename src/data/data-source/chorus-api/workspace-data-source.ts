import { env } from 'next-runtime-env'

import { WorkspaceCreateType, WorkspaceUpdatetype } from '~/domain/model'
import {
  ChorusCreateWorkspaceReply,
  ChorusDeleteWorkspaceReply,
  ChorusGetWorkspaceReply,
  ChorusListWorkspacesReply,
  ChorusUpdateWorkspaceReply,
  Configuration,
  WorkspaceServiceApi
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
}

export type { WorkspaceDataSource }

class WorkspaceDataSourceImpl implements WorkspaceDataSource {
  private service: WorkspaceServiceApi

  constructor(token: string) {
    const configuration = new Configuration({
      apiKey: `Bearer ${token}`,
      basePath: env('NEXT_PUBLIC_DATA_SOURCE_API_URL')
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
      body: {
        workspace: chorusWorkspace
      }
    })
  }
}

export { WorkspaceDataSourceImpl }
