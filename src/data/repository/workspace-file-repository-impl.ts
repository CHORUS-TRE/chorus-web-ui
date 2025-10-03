import { WorkspaceFileDataSource } from '~/data/data-source/chorus-api/workspace-file-data-source'
import { fromChorusWorkspaceFile } from '~/data/data-source/chorus-api/workspace-file-mapper'
import { Result } from '~/domain/model'
import {
  WorkspaceFile,
  WorkspaceFileCreateType,
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
}
