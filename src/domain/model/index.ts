import { ZodIssue } from 'zod'

import { ChorusError } from './chorus-error'

export * from './app'
export * from './app-instance'
export * from './approval-request'
export * from './audit'
export * from './authentication'
export * from './authorization'
export * from './chorus-error'
export * from './dev-store'
export * from './external-webapp'
export * from './feedback'
export * from './instance-config'
export * from './notification'
export * from './organization'
export * from './public-workspace'
export * from './terms-of-use'
export * from './upload-compliance'
export * from './user'
export * from './workbench'
export * from './workspace'
export * from './workspace-config'
export * from './workspace-file'
export * from './workspace-service-instance'

export interface Result<T> {
  data?: T
  error?: ChorusError
  issues?: ZodIssue[]
  totalItems?: number
}
