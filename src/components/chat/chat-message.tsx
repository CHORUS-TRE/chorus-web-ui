'use client'

import { type Spec } from '@json-render/core'
import {
  type DataPart,
  JSONUIProvider,
  Renderer,
  useJsonRenderMessage
} from '@json-render/react'
import { UIMessage } from 'ai'
import { Bot, GripVertical, User } from 'lucide-react'
import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'

import { chorusRegistry } from '@/lib/json-render/registry'
import { cn } from '@/lib/utils'
import { ArtifactType, ChatArtifact } from '@/stores/chat-store'

import { ArtifactRenderer } from './artifacts/artifact-renderer'

const TOOL_TYPE_MAP: Record<string, ArtifactType> = {
  showWizard: 'wizard',
  showStudySetupWizard: 'study-setup-wizard',
  showWorkflow: 'workflow',
  getWorkspaceStatus: 'workspace-status',
  generateUI: 'dynamic-ui',
  searchDocumentation: 'search-results'
}

// Extract artifact from tool result parts of a UIMessage
function extractArtifact(message: UIMessage): ChatArtifact | null {
  for (const part of message.parts) {
    if (!part.type.startsWith('tool-')) continue
    if (!('state' in part) || part.state !== 'output-available') continue
    if (!('output' in part) || !part.output) continue

    const toolName = part.type.replace('tool-', '')
    const artifactType = TOOL_TYPE_MAP[toolName]

    if (artifactType) {
      return {
        type: artifactType,
        data: part.output as Record<string, unknown>
      }
    }
  }
  return null
}

/** Draggable wrapper for artifacts/specs — can be dropped onto the AI Board */
function DraggableArtifact({
  prompt,
  data,
  children
}: {
  prompt: string
  data: unknown
  children: React.ReactNode
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(
          'text/widget-spec',
          JSON.stringify({ prompt, spec: data })
        )
        e.dataTransfer.effectAllowed = 'copy'
      }}
      className="group/drag relative cursor-grab active:cursor-grabbing"
    >
      <div className="absolute -left-5 top-2 flex items-center opacity-0 transition-opacity group-hover/drag:opacity-60">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      {children}
    </div>
  )
}

/** Renders a json-render spec inline with live streaming support */
function InlineSpecRenderer({ spec, prompt }: { spec: Spec; prompt: string }) {
  return (
    <DraggableArtifact prompt={prompt} data={spec}>
      <div className="rounded-xl border border-muted/30 bg-card/50 p-3">
        <JSONUIProvider registry={chorusRegistry}>
          <Renderer spec={spec} registry={chorusRegistry} />
        </JSONUIProvider>
      </div>
    </DraggableArtifact>
  )
}

export function ChatMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === 'user'

  // Use json-render hook to extract spec from data parts (```spec fences → data-spec parts)
  const dataParts = useMemo(
    () =>
      message.parts
        .filter((p) => p.type.startsWith('data-'))
        .map((p) => p as DataPart),
    [message.parts]
  )
  const {
    spec: streamedSpec,
    text: streamedText,
    hasSpec
  } = useJsonRenderMessage(dataParts)

  // Extract text content from text parts
  const textContent = message.parts
    .filter((p) => p.type === 'text')
    .map((p) => (p as { type: 'text'; text: string }).text)
    .join('')

  // Combine: use streamedText if available (spec fences stripped), otherwise raw text
  const displayText = streamedText || textContent

  const artifact = !isUser ? extractArtifact(message) : null

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="flex max-w-[80%] items-start gap-2">
          <div className="rounded-2xl rounded-tr-none bg-primary px-3 py-2 text-sm text-primary-foreground">
            {displayText}
          </div>
          <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
            <User className="h-3.5 w-3.5 text-primary" />
          </div>
        </div>
      </div>
    )
  }

  // Skip messages with no visible content (intermediate tool-call steps)
  if (!displayText && !artifact && !hasSpec) return null

  return (
    <div className="flex justify-start">
      <div className="flex min-w-0 max-w-[92%] flex-1 items-start gap-2">
        <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted/40">
          <Bot className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {displayText && (
            <div
              className={cn(
                'rounded-2xl rounded-tl-none border border-muted/20 bg-muted/20 px-3 py-2 text-sm',
                'prose prose-sm prose-invert max-w-none',
                '[&>h1]:text-sm [&>h2]:text-sm [&>h3]:text-xs [&>ol]:my-1 [&>p]:m-0 [&>ul]:my-1'
              )}
            >
              <ReactMarkdown>{displayText}</ReactMarkdown>
            </div>
          )}

          {/* Streamed spec from ```spec fences (json-render inline rendering) */}
          {hasSpec && streamedSpec && (
            <InlineSpecRenderer
              spec={streamedSpec}
              prompt={displayText || 'AI generated widget'}
            />
          )}

          {/* Tool-based artifacts (workspace status, workflows, wizards, etc.) */}
          {artifact && (
            <DraggableArtifact
              prompt={displayText || artifact.type}
              data={artifact.data}
            >
              <ArtifactRenderer artifact={artifact} />
            </DraggableArtifact>
          )}
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
