import fs from 'node:fs'
import path from 'node:path'

const AGENT_MD_PATH = path.join(
  process.cwd(),
  'src/app/api/.ai/chorus-assistant/AGENT.md'
)

let cached: string | null = null

export function getSystemPrompt(): string {
  if (cached) return cached
  cached = fs.readFileSync(AGENT_MD_PATH, 'utf-8')
  return cached
}
