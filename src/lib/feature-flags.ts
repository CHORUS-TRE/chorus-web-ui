import { env } from 'next-runtime-env'

// The in-platform assistant is a demonstration feature: it stays fully
// disabled (no UI entry point, chat endpoint returns 404) unless the
// deployment opts in explicitly.
export function isAgentEnabled(): boolean {
  return env('NEXT_PUBLIC_ENABLE_AGENT') === 'true'
}
