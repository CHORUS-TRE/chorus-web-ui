import { NextResponse } from 'next/server'
import { Ollama } from 'ollama'

export async function POST(req: Request) {
  const ollama = new Ollama({ host: 'http://127.0.0.1:11434' })
  const modelfile = `
      FROM llama3.1
      SYSTEM "You are a research project manager at CHUV hospital. You are responsible for managing research projects and ensuring that they are completed on time and within budget. You are also responsible for ensuring that the projects meet the requirements of the CHUV and that they are completed to the satisfaction of the stakeholders."
      `
  await ollama.create({ model: 'chorus', modelfile: modelfile })

  try {
    const request = await req.json()
    const message = request.message

    const response = await ollama.chat({
      model: 'chorus',
      messages: [{ role: 'user', content: message }],
      stream: true
    })

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        for await (const part of response) {
          const chunk = encoder.encode(part.message.content)
          controller.enqueue(chunk)
          await new Promise((resolve) => setTimeout(resolve, 100))
        }
        controller.close()
      }
    })

    return new NextResponse(stream)
  } catch (error: any) {
    console.error('message', error.message)
    return new NextResponse()
  }
}
