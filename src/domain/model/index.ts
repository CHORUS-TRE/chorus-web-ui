import { ZodIssue } from 'zod'

export type * from './app'
export * from './app'
export type * from './app-instance'
export * from './app-instance'
export type * from './authentication'
export * from './authentication'
export type * from './user'
export * from './user'
export type * from './workbench'
export * from './workbench'
export type * from './workspace'
export * from './workspace'

export interface Result<T> {
  data?: T
  error?: string
  issues?: ZodIssue[]
}
