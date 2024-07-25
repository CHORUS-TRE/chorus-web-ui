import { WorkspaceDataSource } from '@/data/data-source/'
import {
  ChorusCreateWorkspaceReply,
  ChorusGetWorkspaceReply,
  WorkspaceServiceApi
} from '~/internal/client'
import { ChorusWorkspace } from '@/internal/client/models/ChorusWorkspace'
import { Configuration } from '~/internal/client'

class WorkspaceRepositoryImpl implements WorkspaceDataSource {
  private configuration: Configuration
  private service: WorkspaceServiceApi

  constructor() {
    this.configuration = new Configuration({
      apiKey: `Bearer ${localStorage.getItem('token')}`
    })
    this.service = new WorkspaceServiceApi(this.configuration)
  }

  async create(
    workspace: ChorusWorkspace
  ): Promise<ChorusCreateWorkspaceReply> {
    try {
      return await this.service.workspaceServiceCreateWorkspace({
        body: workspace
      })
    } catch (error) {
      throw error
    }
  }

  async get(id: string): Promise<ChorusGetWorkspaceReply> {
    try {
      return await this.service.workspaceServiceGetWorkspace({ id })
    } catch (error) {
      throw error
    }
  }
}

export default WorkspaceRepositoryImpl
