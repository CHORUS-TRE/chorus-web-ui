import { env } from 'next-runtime-env'

import { orchestrate } from '@/app/api/.ai/agent/orchestrator'
import { Configuration, UserServiceApi } from '@/internal/client'

export const runtime = 'nodejs'

type ApiError = Error & {
  status?: number
  response?: {
    status?: number
    statusText?: string
  }
  body?: unknown
  cause?: unknown
}

function logAuthenticationError(error: unknown): void {
  if (error instanceof Error) {
    const apiError = error as ApiError

    console.error('Authentication check failed', {
      name: apiError.name,
      message: apiError.message,
      status: apiError.status ?? apiError.response?.status,
      statusText: apiError.response?.statusText,
      cause: apiError.cause,
      stack: apiError.stack
    })

    return
  }

  console.error('Authentication check failed with a non-Error value', {
    errorType: typeof error
  })
}

export async function isAuthenticated(
  cookieHeader: string | null
): Promise<boolean> {
  if (!cookieHeader) {
    console.error('Authentication check failed: cookie header is missing')
    return false
  }

  const basePath = env('NEXT_PUBLIC_API_URL')
  if (!basePath) {
    console.error(
      'Authentication check failed: NEXT_PUBLIC_API_URL is not configured'
    )
    return false
  }

  const userService = new UserServiceApi(new Configuration({ basePath }))
  console.error('Performing authentication check with cookie header:', {
    cookieHeader
  })

  try {
    await userService.userServiceGetUserMe({
      headers: {
        Cookie: cookieHeader
      }
    })

    console.debug('Authentication check succeeded')
    return true
  } catch (error: unknown) {
    logAuthenticationError(error)
    return false
  }
}

export async function POST(req: Request) {
  const requestId = crypto.randomUUID()
  const startedAt = Date.now()

  console.error('[chat] request received', {
    requestId,
    method: req.method,
    hasCookie: Boolean(req.headers.get('cookie'))
  })

  const authenticated =
    process.env.NODE_ENV === 'development' ||
    (await isAuthenticated(req.headers.get('cookie')))

  console.error('[chat] authentication result', { requestId, authenticated })

  if (!authenticated) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await req.json()) as {
      messages?: Record<string, unknown>[]
    }
    const messages = body.messages ?? []

    console.error('[chat] request body parsed', {
      requestId,
      messageCount: messages.length,
      roles: messages.map((m) => m.role)
    })

    const response = await orchestrate(messages)

    console.error('[chat] orchestration completed', {
      requestId,
      durationMs: Date.now() - startedAt
    })

    return response
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      console.warn('Invalid JSON request body', {
        requestId,
        message: error.message
      })

      return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    console.error('Orchestration request failed', {
      requestId,
      durationMs: Date.now() - startedAt,
      message: error instanceof Error ? error.message : String(error),
      stack:
        error instanceof Error && process.env.NODE_ENV === 'development'
          ? error.stack
          : undefined
    })

    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
