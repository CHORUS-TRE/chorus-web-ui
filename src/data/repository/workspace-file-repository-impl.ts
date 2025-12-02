import { WorkspaceFileDataSource } from '~/data/data-source/chorus-api/workspace-file-data-source'
import {
  fromChorusWorkspaceFile,
  fromChorusWorkspaceFilePart
} from '~/data/data-source/chorus-api/workspace-file-mapper'
import { Result } from '~/domain/model'
import {
  WorkspaceFile,
  WorkspaceFileCreateType,
  WorkspaceFilePart,
  WorkspaceFileUpdateType
} from '~/domain/model/workspace-file'
import { WorkspaceFileRepository } from '~/domain/repository/workspace-file-repository'

export class WorkspaceFileRepositoryImpl implements WorkspaceFileRepository {
  private dataSource: WorkspaceFileDataSource

  constructor(dataSource: WorkspaceFileDataSource) {
    this.dataSource = dataSource
  }

  async create(
    workspaceId: string,
    file: WorkspaceFileCreateType
  ): Promise<Result<WorkspaceFile>> {
    try {
      const response = await this.dataSource.create(workspaceId, file)

      if (response.result?.file) {
        const workspaceFile = fromChorusWorkspaceFile(response.result.file)
        return { data: workspaceFile }
      }

      return { error: 'Failed to create workspace file' }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async get(workspaceId: string, path: string): Promise<Result<WorkspaceFile>> {
    try {
      const response = await this.dataSource.get(workspaceId, path)

      if (response.result?.file) {
        const workspaceFile = fromChorusWorkspaceFile(response.result.file)
        return { data: workspaceFile }
      }

      return { error: 'Workspace file not found' }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async update(
    workspaceId: string,
    oldPath: string,
    file: WorkspaceFileUpdateType
  ): Promise<Result<WorkspaceFile>> {
    try {
      const response = await this.dataSource.update(workspaceId, oldPath, file)

      if (response.result?.file) {
        const workspaceFile = fromChorusWorkspaceFile(response.result.file)
        return { data: workspaceFile }
      }

      return { error: 'Failed to update workspace file' }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async delete(workspaceId: string, path: string): Promise<Result<string>> {
    try {
      await this.dataSource.delete(workspaceId, path)
      return { data: 'Workspace file deleted successfully' }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async list(
    workspaceId: string,
    path: string
  ): Promise<Result<WorkspaceFile[]>> {
    try {
      const response = await this.dataSource.list(workspaceId, path)

      if (response.result?.files) {
        const workspaceFiles = response.result.files.map((file) =>
          fromChorusWorkspaceFile(file)
        )
        return { data: workspaceFiles }
      }

      return { data: [] }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async initUpload(
    workspaceId: string,
    path: string,
    file: WorkspaceFileCreateType
  ): Promise<
    Result<{ uploadId: string; partSize: number; totalParts: number }>
  > {
    try {
      const response = await this.dataSource.initUpload(workspaceId, path, file)

      if (response.result) {
        const { uploadId, partSize, totalParts } = response.result

        if (uploadId && partSize !== undefined && totalParts !== undefined) {
          return {
            data: {
              uploadId,
              partSize: Number(partSize),
              totalParts: Number(totalParts)
            }
          }
        }
      }

      return { error: 'Failed to initiate upload' }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async uploadPart(
    workspaceId: string,
    path: string,
    uploadId: string,
    part: WorkspaceFilePart
  ): Promise<Result<WorkspaceFilePart>> {
    try {
      const response = await this.dataSource.uploadPart(
        workspaceId,
        path,
        uploadId,
        part
      )

      if (response.result?.part) {
        const uploadedPart = fromChorusWorkspaceFilePart(response.result.part)
        return { data: uploadedPart }
      }

      return { error: 'Failed to upload part' }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async completeUpload(
    workspaceId: string,
    path: string,
    uploadId: string,
    parts: WorkspaceFilePart[]
  ): Promise<Result<WorkspaceFile>> {
    try {
      const response = await this.dataSource.completeUpload(
        workspaceId,
        path,
        uploadId,
        parts
      )

      if (response.result?.file) {
        const workspaceFile = fromChorusWorkspaceFile(response.result.file)
        return { data: workspaceFile }
      }

      return { error: 'Failed to complete upload' }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async abortUpload(
    workspaceId: string,
    path: string,
    uploadId: string
  ): Promise<Result<string>> {
    try {
      await this.dataSource.abortUpload(workspaceId, path, uploadId)
      return { data: 'Upload aborted successfully' }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
}
