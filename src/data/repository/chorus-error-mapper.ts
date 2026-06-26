import { ChorusError } from '@/domain/model'
import { ChorusChorusErrorCode, ResponseError } from '@/internal/client'

const UNSPECIFIED = 'CHORUS_ERROR_CODE_UNSPECIFIED' as const

/**
 * Raw shape of the backend error body. Mirrors ChorusChorusErrorResponse but
 * also includes fields the generated model omits (notably details[].stackTrace),
 * which is why the runtime attaches the raw body rather than the parsed model.
 */
interface RawErrorDetail {
  chorusCode?: ChorusChorusErrorCode
  instance?: string
  title?: string
  message?: string
  stackTrace?: string
  validationErrors?: Array<{ field?: string; reason?: string }>
}

interface RawErrorBody {
  code?: number
  message?: string
  details?: RawErrorDetail[]
}

/**
 * Normalize anything thrown by the data layer into a domain ChorusError.
 *
 * API errors arrive as a ResponseError carrying the raw error body (attached in
 * the client runtime). The body has either a populated `details[0]` (structured
 * error) or an empty `details` with a top-level `message` (simple error); both
 * are handled. Network and other failures fall back to an unspecified error so
 * `message` is always populated.
 */
export function toChorusError(e: unknown): ChorusError {
  if (e instanceof ResponseError) {
    const body = e.chorusError as RawErrorBody | null | undefined
    const detail = body?.details?.[0]
    const validationErrors = detail?.validationErrors?.map((v) => ({
      field: v.field ?? '',
      reason: v.reason ?? ''
    }))

    return {
      code: detail?.chorusCode ?? UNSPECIFIED,
      message: detail?.message ?? body?.message ?? e.message,
      httpStatus: e.response?.status,
      title: detail?.title,
      instance: detail?.instance,
      stackTrace: detail?.stackTrace,
      validationErrors
    }
  }

  return {
    code: UNSPECIFIED,
    message: e instanceof Error ? e.message : String(e)
  }
}

/**
 * Build a ChorusError for a client-side failure (e.g. the API response did not
 * match the expected schema, or a required field was missing). These never
 * originate from the backend error body.
 */
export function conversionError(message: string): ChorusError {
  return { code: 'CONVERSION_ERROR', message }
}
