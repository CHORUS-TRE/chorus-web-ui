import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { convertToModelMessages, streamText, UIMessage } from 'ai'
import { createOllama } from 'ollama-ai-provider-v2'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const {
    messages,
    model,
    webSearch
  }: {
    messages: UIMessage[]
    model: string
    webSearch: boolean
  } = await req.json()

  // /chat
  // const model1 = createOllama({
  //   baseURL: 'http://127.0.0.1:11434/api'
  // })('qwen3:0.6b')

  // const model3 = createOpenAICompatible({
  //   name: 'openwebui',
  //   apiKey: process.env.NEXT_PUBLIC_OPEN_WEBUI_API_KEY,
  //   baseURL: 'http://127.0.0.1:1028/ollama/v1',
  //   includeUsage: true // Include usage information in streaming responses
  // })('qwen3:0.6b')

  const model4 = createOpenAICompatible({
    name: 'openwebui',
    apiKey: process.env.NEXT_PUBLIC_OPEN_WEBUI_API_KEY,
    baseURL: 'http://127.0.0.1:1028/api',
    includeUsage: true, // Include usage information in streaming responses

  })('qwen3:0.6b')


    const result = streamText({
      model: webSearch ? 'perplexity/sonar' : model4,
      // providerOptions: { ollama: { think: true } },
      messages: convertToModelMessages(messages),
      onError({ error }) {
        console.error(error)
      }
    })

    // send sources and reasoning back to the client
    const data = result.toUIMessageStreamResponse({
      sendSources: true,
      sendReasoning: true
    })

    return data
}
