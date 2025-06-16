import {
  WorkbenchCreateType,
  WorkbenchUpdateType
} from '@/domain/model/workbench'
import { ChorusWorkbench } from '~/internal/client'

export const toChorusWorkbench = (
  workbench: WorkbenchCreateType
): ChorusWorkbench => {
  return {
    ...workbench
  }
}

export const toChorusWorkbenchUpdate = (
  workbench: WorkbenchUpdateType
): ChorusWorkbench => {
  return {
    ...workbench
  }
}
