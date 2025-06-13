import { z } from 'zod'

export interface IFormState {
  data?: string
  error?: string
  issues?: z.ZodIssue[]
}
