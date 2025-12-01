import { ZodIssue } from 'zod'

export * from './app'
export * from './app-instance'
export * from './authentication'
export * from './dev-store'
export * from './external-webapp'
export * from './user'
export * from './workbench'
export * from './workspace'
export * from './workspace-file'

export interface Result<T> {
  data?: T
  error?: string
  issues?: ZodIssue[]
}
