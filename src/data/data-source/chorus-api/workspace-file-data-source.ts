import {
  WorkspaceFileCreateType,
  WorkspaceFilePart,
  WorkspaceFileUpdateType
} from '~/domain/model'
import {
  ChorusAbortWorkspaceFileUploadReply,
  ChorusCompleteWorkspaceFileUploadReply,
  ChorusCreateWorkspaceFileReply,
  ChorusDeleteWorkspaceFileReply,
  ChorusGetWorkspaceFileReply,
  ChorusInitiateWorkspaceFileUploadReply,
  ChorusListWorkspaceFilesReply,
  ChorusUpdateWorkspaceFileReply,
  ChorusUploadWorkspaceFilePartReply,
  Configuration,
  WorkspaceFileServiceApi
} from '~/internal/client'

import {
  toChorusWorkspaceFile,
  toChorusWorkspaceFilePart
} from './workspace-file-mapper'

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
  initUpload: (
    workspaceId: string,
    path: string,
    file: WorkspaceFileCreateType
  ) => Promise<ChorusInitiateWorkspaceFileUploadReply>
  uploadPart: (
    workspaceId: string,
    path: string,
    uploadId: string,
    part: WorkspaceFilePart
  ) => Promise<ChorusUploadWorkspaceFilePartReply>
  completeUpload: (
    workspaceId: string,
    path: string,
    uploadId: string,
    parts: WorkspaceFilePart[]
  ) => Promise<ChorusCompleteWorkspaceFileUploadReply>
  abortUpload: (
    workspaceId: string,
    path: string,
    uploadId: string
  ) => Promise<ChorusAbortWorkspaceFileUploadReply>
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

  initUpload(
    workspaceId: string,
    path: string,
    file: WorkspaceFileCreateType
  ): Promise<ChorusInitiateWorkspaceFileUploadReply> {
    return this.service.workspaceFileServiceInitiateWorkspaceFileUpload({
      workspaceId,
      path,
      file
    })
  }

  uploadPart(
    workspaceId: string,
    path: string,
    uploadId: string,
    part: WorkspaceFilePart
  ): Promise<ChorusUploadWorkspaceFilePartReply> {
    const chorusPart = toChorusWorkspaceFilePart(part)
    return this.service.workspaceFileServiceUploadWorkspaceFilePart({
      workspaceId,
      path,
      uploadId,
      part: chorusPart
    })
  }

  completeUpload(
    workspaceId: string,
    path: string,
    uploadId: string,
    parts: WorkspaceFilePart[]
  ): Promise<ChorusCompleteWorkspaceFileUploadReply> {
    return this.service.workspaceFileServiceCompleteWorkspaceFileUpload({
      workspaceId,
      path,
      uploadId,
      parts: parts.map(toChorusWorkspaceFilePart)
    })
  }

  abortUpload(
    workspaceId: string,
    path: string,
    uploadId: string
  ): Promise<ChorusAbortWorkspaceFileUploadReply> {
    return this.service.workspaceFileServiceAbortWorkspaceFileUpload({
      workspaceId,
      path,
      uploadId
    })
  }
}

export { WorkspaceFileDataSourceImpl }
