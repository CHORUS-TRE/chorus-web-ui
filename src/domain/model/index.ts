import { ZodIssue } from 'zod'

export type * from './app'
export * from './app'
export type * from './app-instance'
export type * from './authentication'
export type * from './user'
export type * from './workbench'
export type * from './workspace'

export interface Result<T> {
  data?: T
  error?: string
  issues?: ZodIssue[]
}
