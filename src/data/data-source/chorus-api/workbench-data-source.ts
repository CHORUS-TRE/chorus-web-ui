import { env } from 'next-runtime-env'

import {
  WorkbenchCreateType,
  WorkbenchUpdateType
} from '~/domain/model/workbench'
import {
  ChorusCreateWorkbenchReply,
  ChorusDeleteWorkbenchReply,
  ChorusGetWorkbenchReply,
  ChorusListWorkbenchesReply,
  ChorusManageUserRoleInWorkbenchReply,
  ChorusRemoveUserFromWorkbenchReply,
  ChorusUpdateWorkbenchReply,
  Configuration,
  WorkbenchServiceApi,
  WorkbenchServiceManageUserRoleInWorkbenchBody
} from '~/internal/client'

// import { BaseAPI } from '~/internal/client/runtime'
import { toChorusWorkbench, toChorusWorkbenchUpdate } from './workbench-mapper'

interface WorkbenchDataSource {
  streamUrl: (id: string) => string
  streamProbe: (id: string) => Promise<Response>
  create: (
    workbench: WorkbenchCreateType
  ) => Promise<ChorusCreateWorkbenchReply>
  get: (id: string) => Promise<ChorusGetWorkbenchReply>
  delete: (id: string) => Promise<ChorusDeleteWorkbenchReply>
  list: () => Promise<ChorusListWorkbenchesReply>
  update: (
    workbench: WorkbenchUpdateType
  ) => Promise<ChorusUpdateWorkbenchReply>
  addUserRole: (
    workbenchId: string,
    userId: string,
    body: WorkbenchServiceManageUserRoleInWorkbenchBody
  ) => Promise<ChorusManageUserRoleInWorkbenchReply>
  removeUserFromWorkbench: (
    workbenchId: string,
    userId: string
  ) => Promise<ChorusRemoveUserFromWorkbenchReply>
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
    return `${env('NEXT_PUBLIC_API_URL')}${env('NEXT_PUBLIC_API_SUFFIX')}/workbenches/${id}/stream/`
  }

  streamProbe(id: string): Promise<Response> {
    const computedUrl = this.streamUrl(id)

    // instantiate API client if needed in future for authenticated probes
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

  list(): Promise<ChorusListWorkbenchesReply> {
    return this.service.workbenchServiceListWorkbenches()
  }

  update(workbench: WorkbenchUpdateType): Promise<ChorusUpdateWorkbenchReply> {
    const chorusWorkbench = toChorusWorkbenchUpdate(workbench)
    return this.service.workbenchServiceUpdateWorkbench({
      body: chorusWorkbench
    })
  }

  addUserRole(
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

  removeUserFromWorkbench(
    workbenchId: string,
    userId: string
  ): Promise<ChorusRemoveUserFromWorkbenchReply> {
    return this.service.workbenchServiceRemoveUserFromWorkbench({
      id: workbenchId,
      userId
    })
  }
}

export { WorkbenchDataSourceImpl }
