import type { ZodIssue } from 'zod'

export interface IFormState {
  data?: string | object
  error?: string
  issues?: ZodIssue[]
}
