import { env } from 'next-runtime-env'

import { orchestrate } from '@/app/api/.ai/agent/orchestrator'
import { Configuration, UserServiceApi } from '@/internal/client'

export const runtime = 'nodejs'

const SESSION_COOKIE_NAME = 'jwttoken'

function extractCookie(cookieHeader: string, name: string): string | undefined {
  const prefix = `${name}=`
  return cookieHeader
    .split(';')
    .map((pair) => pair.trim())
    .find((pair) => pair.startsWith(prefix))
    ?.slice(prefix.length)
}

export async function isAuthenticated(
  cookieHeader: string | null
): Promise<boolean> {
  if (!cookieHeader) return false

  const jwtToken = extractCookie(cookieHeader, SESSION_COOKIE_NAME)
  if (!jwtToken) return false

  const userService = new UserServiceApi(
    new Configuration({ basePath: env('NEXT_PUBLIC_API_URL') || '' })
  )

  try {
    await userService.userServiceGetUserMe({
      headers: { Cookie: `${SESSION_COOKIE_NAME}=${jwtToken}` }
    })
    return true
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  if (!(await isAuthenticated(req.headers.get('cookie')))) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = (await req.json()) as { messages?: Record<string, unknown>[] }
  return orchestrate(body.messages ?? [])
}
