import type { ZodIssue } from 'zod'

export interface IFormState {
  data?: string
  error?: string
  issues?: ZodIssue[]
}
