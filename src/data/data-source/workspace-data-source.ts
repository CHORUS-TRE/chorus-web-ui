import {
  ChorusWorkspace,
  ChorusCreateWorkspaceReply,
  ChorusGetWorkspaceReply
} from '~/internal/client'

interface WorkspaceDataSource {
  create: (workspace: ChorusWorkspace) => Promise<ChorusCreateWorkspaceReply>
  get: (id: string) => Promise<ChorusGetWorkspaceReply>
}

export type { WorkspaceDataSource }
