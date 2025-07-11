import {
  AppInstanceCreateType,
  AppInstanceUpdateType
} from '@/domain/model/app-instance'
import {
  AppInstanceServiceApi,
  ChorusCreateAppInstanceReply,
  ChorusDeleteAppInstanceReply,
  ChorusGetAppInstanceReply,
  ChorusListAppInstancesReply,
  ChorusUpdateAppInstanceReply,
  Configuration
} from '~/internal/client'

import {
  toChorusAppInstance,
  toChorusAppInstanceUpdate
} from './app-instance-mapper'

interface AppInstanceDataSource {
  create: (
    appInstance: AppInstanceCreateType
  ) => Promise<ChorusCreateAppInstanceReply>
  get: (id: string) => Promise<ChorusGetAppInstanceReply>
  delete: (id: string) => Promise<ChorusDeleteAppInstanceReply>
  list: () => Promise<ChorusListAppInstancesReply>
  update: (
    appInstance: AppInstanceUpdateType
  ) => Promise<ChorusUpdateAppInstanceReply>
}

export type { AppInstanceDataSource }

class AppInstanceDataSourceImpl implements AppInstanceDataSource {
  private service: AppInstanceServiceApi

  constructor(basePath: string) {
    const configuration = new Configuration({
      basePath,
      credentials: 'include'
    })
    this.service = new AppInstanceServiceApi(configuration)
  }

  create(
    appInstance: AppInstanceCreateType
  ): Promise<ChorusCreateAppInstanceReply> {
    const chorusAppInstance = toChorusAppInstance(appInstance)
    return this.service.appInstanceServiceCreateAppInstance({
      body: chorusAppInstance
    })
  }

  get(id: string): Promise<ChorusGetAppInstanceReply> {
    return this.service.appInstanceServiceGetAppInstance({ id })
  }

  delete(id: string): Promise<ChorusDeleteAppInstanceReply> {
    return this.service.appInstanceServiceDeleteAppInstance({ id })
  }

  list(): Promise<ChorusListAppInstancesReply> {
    return this.service.appInstanceServiceListAppInstances({})
  }

  update(
    appInstance: AppInstanceUpdateType
  ): Promise<ChorusUpdateAppInstanceReply> {
    const chorusAppInstance = toChorusAppInstanceUpdate(appInstance)
    return this.service.appInstanceServiceUpdateAppInstance({
      body: { appInstance: chorusAppInstance }
    })
  }
}

export { AppInstanceDataSourceImpl }
