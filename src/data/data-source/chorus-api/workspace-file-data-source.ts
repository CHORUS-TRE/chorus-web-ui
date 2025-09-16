import {
  WorkspaceFileCreateType,
  WorkspaceFileUpdateType
} from '~/domain/model'
import {
  ChorusCreateWorkspaceFileReply,
  ChorusDeleteWorkspaceFileReply,
  ChorusGetWorkspaceFileReply,
  ChorusUpdateWorkspaceFileReply,
  Configuration,
  WorkspaceServiceApi
} from '~/internal/client'

import { toChorusWorkspaceFile } from './workspace-file-mapper'

interface WorkspaceFileDataSource {
  create: (
    workspaceId: string,
    file: WorkspaceFileCreateType
  ) => Promise<ChorusCreateWorkspaceFileReply>
  get: (
    workspaceId: string,
    path: string
  ) => Promise<ChorusGetWorkspaceFileReply>
  update: (
    workspaceId: string,
    oldPath: string,
    file: WorkspaceFileUpdateType
  ) => Promise<ChorusUpdateWorkspaceFileReply>
  delete: (
    workspaceId: string,
    path: string
  ) => Promise<ChorusDeleteWorkspaceFileReply>
}

export type { WorkspaceFileDataSource }

class WorkspaceFileDataSourceImpl implements WorkspaceFileDataSource {
  private service: WorkspaceServiceApi

  constructor(basePath: string) {
    const configuration = new Configuration({
      basePath,
      credentials: 'include'
    })
    this.service = new WorkspaceServiceApi(configuration)
  }

  create(
    workspaceId: string,
    file: WorkspaceFileCreateType
  ): Promise<ChorusCreateWorkspaceFileReply> {
    const chorusFile = toChorusWorkspaceFile(file)
    return this.service.workspaceServiceCreateWorkspaceFile({
      workspaceId,
      file: chorusFile
    })
  }

  get(workspaceId: string, path: string): Promise<ChorusGetWorkspaceFileReply> {
    return this.service.workspaceServiceGetWorkspaceFile({
      workspaceId,
      path
    })
  }

  update(
    workspaceId: string,
    oldPath: string,
    file: WorkspaceFileUpdateType
  ): Promise<ChorusUpdateWorkspaceFileReply> {
    const chorusFile = toChorusWorkspaceFile(file)
    return this.service.workspaceServiceUpdateWorkspaceFile({
      workspaceId,
      oldPath,
      file: chorusFile
    })
  }

  delete(
    workspaceId: string,
    path: string
  ): Promise<ChorusDeleteWorkspaceFileReply> {
    return this.service.workspaceServiceDeleteWorkspaceFile({
      workspaceId,
      path
    })
  }
}

export { WorkspaceFileDataSourceImpl }
