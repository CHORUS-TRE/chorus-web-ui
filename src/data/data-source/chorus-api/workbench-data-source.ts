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
import { BaseAPI } from '~/internal/client/runtime'

import { toChorusWorkbench, toChorusWorkbenchUpdate } from './workbench-mapper'

interface WorkbenchDataSource {
  streamProbe: (id: string) => Promise<Response>
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

  streamProbe(id: string): Promise<Response> {
    const computedUrl = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_SUFFIX}/workbenchs/${id}/stream/`

    const api = new BaseAPI(
      new Configuration({
        basePath: computedUrl,
        credentials: 'include'
      })
    )
    const response = api.request({
      path: '',
      method: 'GET',
      headers: {
        accept: '*/*'
      }
    })

    return response
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
