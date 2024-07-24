import WorkspaceDataSource from '../workspace-data-source'
import { WorkspaceServiceApi } from '~/internal/client'
import { ChorusWorkspace } from '@/internal/client/models/ChorusWorkspace'
import { Configuration } from '~/internal/client'

class WorkspaceRepositoryImpl implements WorkspaceDataSource {
  private configuration: Configuration

  constructor() {
    this.configuration = new Configuration({
      apiKey: `Bearer ${localStorage.getItem('token')}`
    })
  }

  async create(workspace: ChorusWorkspace): Promise<any> {
    throw new Error('Method not implemented.')
  }

  async get(id: number): Promise<ChorusWorkspace> {
    throw new Error('Method not implemented.')
  }
}

export default WorkspaceRepositoryImpl
