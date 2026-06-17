import {
  WorkspaceCreateType,
  WorkspaceUpdatetype
} from '@/domain/model/workspace'
import { ChorusWorkspace } from '@/internal/client'

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

export const toPublicWorkspace = (chorus: Record<string, unknown>) => ({
  ...chorus,
  createdAt: chorus.createdAt
    ? new Date(chorus.createdAt as string)
    : undefined,
  updatedAt: chorus.updatedAt ? new Date(chorus.updatedAt as string) : undefined
})
