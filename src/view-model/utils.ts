import { z } from 'zod'

export interface IFormState<T> {
  data?: T | string
  error?: string
  issues?: z.ZodIssue[]
}
