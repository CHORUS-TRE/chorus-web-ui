import {
  WorkspaceServiceInstanceCreateType,
  WorkspaceServiceInstanceUpdateType
} from '@/domain/model'
import { ChorusWorkspaceServiceInstance } from '@/internal/client'

export const toChorusWorkspaceServiceInstance = (
  instance: WorkspaceServiceInstanceCreateType
): ChorusWorkspaceServiceInstance => {
  return {
    ...instance
  }
}

export const toChorusWorkspaceServiceInstanceUpdate = (
  instance: WorkspaceServiceInstanceUpdateType
): ChorusWorkspaceServiceInstance => {
  return {
    ...instance
  }
}
