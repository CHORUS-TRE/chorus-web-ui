import { createOpenAI } from '@ai-sdk/openai'
import { env } from 'next-runtime-env'

export function getModel() {
  const openai = createOpenAI({
    apiKey: env('OPENAI_API_KEY'),
    baseURL: env('OPENAI_API_BASE_URL')
  })
  return openai.chat(env('OPENAI_API_MODEL') || 'gpt-oss-120b')
}
