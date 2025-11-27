import {
  WorkspaceFileCreateType,
  WorkspaceFileUpdateType
} from '~/domain/model'
import {
  ChorusCreateWorkspaceFileReply,
  ChorusDeleteWorkspaceFileReply,
  ChorusGetWorkspaceFileReply,
  ChorusListWorkspaceFilesReply,
  ChorusUpdateWorkspaceFileReply,
  Configuration,
  WorkspaceFileServiceApi
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
  list: (
    workspaceId: string,
    path: string
  ) => Promise<ChorusListWorkspaceFilesReply>
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
  private service: WorkspaceFileServiceApi

  constructor(basePath: string) {
    const configuration = new Configuration({
      basePath,
      credentials: 'include'
    })
    this.service = new WorkspaceFileServiceApi(configuration)
  }

  create(
    workspaceId: string,
    file: WorkspaceFileCreateType
  ): Promise<ChorusCreateWorkspaceFileReply> {
    const chorusFile = toChorusWorkspaceFile(file)
    return this.service.workspaceFileServiceCreateWorkspaceFile({
      workspaceId,
      file: chorusFile
    })
  }

  get(workspaceId: string, path: string): Promise<ChorusGetWorkspaceFileReply> {
    return this.service.workspaceFileServiceGetWorkspaceFile({
      workspaceId,
      path
    })
  }

  list(
    workspaceId: string,
    path: string
  ): Promise<ChorusListWorkspaceFilesReply> {
    return this.service.workspaceFileServiceListWorkspaceFiles({
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
    return this.service.workspaceFileServiceUpdateWorkspaceFile({
      workspaceId,
      oldPath,
      file: chorusFile
    })
  }

  delete(
    workspaceId: string,
    path: string
  ): Promise<ChorusDeleteWorkspaceFileReply> {
    return this.service.workspaceFileServiceDeleteWorkspaceFile({
      workspaceId,
      path
    })
  }
}

export { WorkspaceFileDataSourceImpl }
