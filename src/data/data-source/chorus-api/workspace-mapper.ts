import {
  WorkspaceCreateType,
  WorkspaceUpdatetype
} from '@/domain/model/workspace'
import { ChorusWorkspace } from '~/internal/client'

export const toChorusWorkspace = (
  workspace: WorkspaceCreateType
): ChorusWorkspace => {
  return {
    ...workspace
  }
}

export const toChorusWorkspaceUpdate = (
  workspace: WorkspaceUpdatetype
): ChorusWorkspace => {
  return {
    ...workspace
  }
}
