import { toChorusError } from '@/data/repository/chorus-error-mapper'
import { ResponseError } from '@/internal/client'

const makeResponseError = (status: number, body: unknown): ResponseError =>
  new ResponseError(
    { status } as Response,
    'http error',
    body as ResponseError['chorusError']
  )

describe('toChorusError', () => {
  it('maps a ResponseError with a structured detail', () => {
    const error = makeResponseError(404, {
      message: 'top-level message',
      details: [
        {
          chorusCode: 'NOT_FOUND',
          title: 'User not found',
          message: 'detail message'
        }
      ]
    })

    expect(toChorusError(error)).toEqual({
      code: 'NOT_FOUND',
      message: 'detail message',
      title: 'User not found',
      httpStatus: 404,
      validationErrors: undefined
    })
  })

  it('captures instance, title and stackTrace from a detailed error body', () => {
    const error = makeResponseError(500, {
      code: 13,
      message: 'Failed to convert user',
      details: [
        {
          chorusCode: 'CONVERSION_ERROR',
          instance: '/api/rest/v1/users',
          message: 'Failed to convert user',
          stackTrace: 'internal/api/v1.UserController.UpdateUser\n\t...',
          title: 'Conversion Error'
        }
      ]
    })

    expect(toChorusError(error)).toEqual({
      code: 'CONVERSION_ERROR',
      message: 'Failed to convert user',
      title: 'Conversion Error',
      instance: '/api/rest/v1/users',
      stackTrace: 'internal/api/v1.UserController.UpdateUser\n\t...',
      httpStatus: 500,
      validationErrors: undefined
    })
  })

  it('maps the empty-details shape to the top-level message', () => {
    const error = makeResponseError(400, {
      code: 3,
      message:
        'type mismatch, parameter: id, error: strconv.ParseUint: parsing "workbenchId": invalid syntax',
      details: []
    })

    expect(toChorusError(error)).toEqual({
      code: 'CHORUS_ERROR_CODE_UNSPECIFIED',
      message:
        'type mismatch, parameter: id, error: strconv.ParseUint: parsing "workbenchId": invalid syntax',
      httpStatus: 400,
      title: undefined,
      instance: undefined,
      stackTrace: undefined,
      validationErrors: undefined
    })
  })

  it('maps field-level validation errors', () => {
    const error = makeResponseError(400, {
      message: 'invalid',
      details: [
        {
          chorusCode: 'VALIDATION_ERROR',
          validationErrors: [
            { field: 'username', reason: 'required' },
            { field: 'email', reason: 'invalid format' }
          ]
        }
      ]
    })

    const result = toChorusError(error)
    expect(result.code).toBe('VALIDATION_ERROR')
    expect(result.validationErrors).toEqual([
      { field: 'username', reason: 'required' },
      { field: 'email', reason: 'invalid format' }
    ])
  })

  it('falls back to the top-level message when there is no detail', () => {
    const error = makeResponseError(500, { message: 'boom', details: [] })

    expect(toChorusError(error)).toEqual({
      code: 'CHORUS_ERROR_CODE_UNSPECIFIED',
      message: 'boom',
      httpStatus: 500,
      title: undefined,
      validationErrors: undefined
    })
  })

  it('handles a ResponseError without a structured body', () => {
    const error = new ResponseError({ status: 503 } as Response, 'gateway down')

    expect(toChorusError(error)).toEqual({
      code: 'CHORUS_ERROR_CODE_UNSPECIFIED',
      message: 'gateway down',
      httpStatus: 503,
      title: undefined,
      validationErrors: undefined
    })
  })

  it('handles a non-ResponseError throwable', () => {
    expect(toChorusError(new Error('network down'))).toEqual({
      code: 'CHORUS_ERROR_CODE_UNSPECIFIED',
      message: 'network down'
    })
  })

  it('handles a non-Error throwable', () => {
    expect(toChorusError('weird')).toEqual({
      code: 'CHORUS_ERROR_CODE_UNSPECIFIED',
      message: 'weird'
    })
  })
})
