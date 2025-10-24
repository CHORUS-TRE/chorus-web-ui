import { env } from 'next-runtime-env'

import {
  WorkbenchCreateType,
  WorkbenchUpdateType
} from '~/domain/model/workbench'
import {
  ChorusCreateWorkbenchReply,
  ChorusDeleteWorkbenchReply,
  ChorusGetWorkbenchReply,
  ChorusListWorkbenchsReply,
  ChorusManageUserRoleInWorkbenchReply,
  ChorusUpdateWorkbenchReply,
  Configuration,
  WorkbenchServiceApi,
  WorkbenchServiceManageUserRoleInWorkbenchBody
} from '~/internal/client'
import { BaseAPI } from '~/internal/client/runtime'

import { toChorusWorkbench, toChorusWorkbenchUpdate } from './workbench-mapper'

interface WorkbenchDataSource {
  streamUrl: (id: string) => string
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
  manageUserRole: (
    workbenchId: string,
    userId: string,
    body: WorkbenchServiceManageUserRoleInWorkbenchBody
  ) => Promise<ChorusManageUserRoleInWorkbenchReply>
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

  streamUrl(id: string): string {
    return `${env('NEXT_PUBLIC_API_URL')}${env('NEXT_PUBLIC_API_SUFFIX')}/workbenchs/${id}/stream/`
  }

  streamProbe(id: string): Promise<Response> {
    const computedUrl = this.streamUrl(id)

    const api = new BaseAPI(
      new Configuration({
        basePath: computedUrl,
        credentials: 'include'
      })
    )
    const response = fetch(computedUrl, {
      credentials: 'include'
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

  manageUserRole(
    workbenchId: string,
    userId: string,
    body: WorkbenchServiceManageUserRoleInWorkbenchBody
  ): Promise<ChorusManageUserRoleInWorkbenchReply> {
    return this.service.workbenchServiceManageUserRoleInWorkbench({
      id: workbenchId,
      userId,
      body
    })
  }
}

export { WorkbenchDataSourceImpl }
