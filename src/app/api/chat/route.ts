import { orchestrate } from '@/app/api/.ai/agent/orchestrator'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = (await req.json()) as { messages?: Record<string, unknown>[] }
  return orchestrate(body.messages ?? [])
}
