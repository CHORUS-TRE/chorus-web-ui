'use client'

import { UIMessage } from 'ai'
import { Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

import { cn } from '@/lib/utils'
import { ChatArtifact } from '@/stores/chat-store'

import { ArtifactRenderer } from './artifacts/artifact-renderer'

// Extract artifact from tool result parts of a UIMessage
function extractArtifact(message: UIMessage): ChatArtifact | null {
  for (const part of message.parts) {
    if (!part.type.startsWith('tool-')) continue
    if (!('state' in part) || part.state !== 'output-available') continue
    if (!('output' in part) || !part.output) continue

    const toolName = part.type.replace('tool-', '')
    const output = part.output as Record<string, unknown>

    if (toolName === 'showWizard') {
      return {
        type: 'wizard',
        data: {
          projectType: output.projectType,
          suggestedName: output.suggestedName,
          context: output.context
        }
      }
    }
    // navigateTo is handled via router.push in right-sidebar.tsx
  }
  return null
}

export function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === 'user'

  // Extract text content from parts
  const textContent = message.parts
    .filter((p) => p.type === 'text')
    .map((p) => (p as { type: 'text'; text: string }).text)
    .join('')

  const artifact = !isUser ? extractArtifact(message) : null

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="flex max-w-[80%] items-start gap-2">
          <div className="rounded-2xl rounded-tr-none bg-primary px-3 py-2 text-sm text-primary-foreground">
            {textContent}
          </div>
          <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
            <User className="h-3.5 w-3.5 text-primary" />
          </div>
        </div>
      </div>
    )
  }

  // Skip messages with no visible content (intermediate tool-call steps)
  if (!textContent && !artifact) return null

  return (
    <div className="flex justify-start">
      <div className="flex min-w-0 max-w-[92%] flex-1 items-start gap-2">
        <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted/40">
          <Bot className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {textContent && (
            <div
              className={cn(
                'rounded-2xl rounded-tl-none border border-muted/20 bg-muted/20 px-3 py-2 text-sm',
                'prose prose-sm prose-invert max-w-none',
                '[&>h1]:text-sm [&>h2]:text-sm [&>h3]:text-xs [&>ol]:my-1 [&>p]:m-0 [&>ul]:my-1'
              )}
            >
              <ReactMarkdown>{textContent}</ReactMarkdown>
            </div>
          )}
          {artifact && <ArtifactRenderer artifact={artifact} />}
        </div>
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted/40">
          <Bot className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="rounded-2xl rounded-tl-none border border-muted/20 bg-muted/20 px-3 py-2">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    </div>
  )
}
