import { ChorusChorusErrorCode } from '@/internal/client'

export interface ValidationError {
  field: string
  reason: string
}

/**
 * Domain representation of a structured API error, mapped from the backend's
 * ChorusChorusErrorResponse at the repository boundary. `message` is always
 * present so callers can render it directly.
 */
export interface ChorusError {
  code: ChorusChorusErrorCode
  message: string
  httpStatus?: number
  title?: string
  /** API path that produced the error, e.g. "/api/rest/v1/users". */
  instance?: string
  /** Server-side stack trace, when provided. For diagnostic display only. */
  stackTrace?: string
  validationErrors?: ValidationError[]
}
