import {
  WorkbenchCreateType,
  WorkbenchUpdateType
} from '~/domain/model/workbench'
import {
  ChorusCreateWorkbenchReply,
  ChorusDeleteWorkbenchReply,
  ChorusGetWorkbenchReply,
  ChorusListWorkbenchsReply,
  ChorusUpdateWorkbenchReply,
  Configuration,
  WorkbenchServiceApi
} from '~/internal/client'

import { toChorusWorkbench, toChorusWorkbenchUpdate } from './workbench-mapper'

interface WorkbenchDataSource {
  create: (
    workbench: WorkbenchCreateType
  ) => Promise<ChorusCreateWorkbenchReply>
  get: (id: string) => Promise<ChorusGetWorkbenchReply>
  delete: (id: string) => Promise<ChorusDeleteWorkbenchReply>
  list: () => Promise<ChorusListWorkbenchsReply>
  update: (
    workbench: WorkbenchUpdateType
  ) => Promise<ChorusUpdateWorkbenchReply>
}

export type { WorkbenchDataSource }

class WorkbenchDataSourceImpl implements WorkbenchDataSource {
  private service: WorkbenchServiceApi

  constructor(basePath: string) {
    const configuration = new Configuration({
      basePath,
      credentials: 'include'
    })
    this.service = new WorkbenchServiceApi(configuration)
  }

  create(workbench: WorkbenchCreateType): Promise<ChorusCreateWorkbenchReply> {
    const chorusWorkbench = toChorusWorkbench(workbench)
    return this.service.workbenchServiceCreateWorkbench({
      body: chorusWorkbench
    })
  }

  get(id: string): Promise<ChorusGetWorkbenchReply> {
    return this.service.workbenchServiceGetWorkbench({ id })
  }

  delete(id: string): Promise<ChorusDeleteWorkbenchReply> {
    return this.service.workbenchServiceDeleteWorkbench({ id })
  }

  list(): Promise<ChorusListWorkbenchsReply> {
    return this.service.workbenchServiceListWorkbenchs()
  }

  update(workbench: WorkbenchUpdateType): Promise<ChorusUpdateWorkbenchReply> {
    const chorusWorkbench = toChorusWorkbenchUpdate(workbench)
    return this.service.workbenchServiceUpdateWorkbench({
      body: chorusWorkbench
    })
  }
}

export { WorkbenchDataSourceImpl }
