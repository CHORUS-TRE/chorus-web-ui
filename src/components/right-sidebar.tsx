'use client'

import { owl } from '@lucide/lab'
import { UIMessage } from 'ai'
import {
  AlertCircle,
  BookOpen,
  CircleX,
  createLucideIcon,
  MessageCircle,
  X
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { isAgentEnabled } from '@/lib/feature-flags'
import { cn } from '@/lib/utils'
import { useChatContext } from '@/providers/chat-provider'
import { useUserPreferences } from '@/stores/user-preferences-store'

import { ChatInput } from './chat/chat-input'
import { ChatMessage, TypingIndicator } from './chat/chat-message'
import { UserGuide } from './user-guide'

const Owl = createLucideIcon('Owl', owl)

const QUICK_PROMPTS = [
  {
    label: 'Start a new study',
    prompt: 'I want to start a new research study'
  },
  {
    label: 'Extract data',
    prompt: 'I need to extract clinical data from the CDW'
  },
  // { label: 'My study status', prompt: 'Show me my workspace status' },
  { label: 'Feasability study', prompt: 'How to perform a feasability study?' }
]

function WelcomeCard({ onPrompt }: { onPrompt: (text: string) => void }) {
  return (
    <div className="flex justify-start">
      <div className="flex min-w-0 max-w-[92%] flex-1 items-start gap-2">
        <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted/40">
          <Owl className="h-3.5 w-3.5 text-accent" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div
            className={cn(
              'rounded-2xl rounded-tl-none border border-muted/20 bg-muted/20 px-3 py-2 text-sm'
            )}
          >
            <p className="mb-1 font-medium">
              Hi! I&apos;m the Chorus Assistant.
            </p>
            <p className="text-xs text-muted-foreground">
              I can help you navigate the platform, create workspaces, launch
              sessions, and more.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p.prompt}
                onClick={() => onPrompt(p.prompt)}
                className="rounded-full border border-muted/30 bg-muted/10 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-foreground"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function friendlyError(error: Error): string {
  const msg = error.message.toLowerCase()
  if (
    msg.includes('api-key') ||
    msg.includes('api key') ||
    msg.includes('x-api-key')
  ) {
    return 'The AI service API key is invalid or missing. Contact your administrator.'
  }
  if (
    msg.includes('rate limit') ||
    msg.includes('too many requests') ||
    msg.includes('429')
  ) {
    return 'Too many requests. Please wait a moment and try again.'
  }
  if (
    msg.includes('network') ||
    msg.includes('fetch') ||
    msg.includes('econnrefused')
  ) {
    return 'Unable to reach the assistant. Check your connection.'
  }
  return 'Something went wrong. Please try again.'
}

export default function RightSidebar() {
  const { toggleRightSidebar } = useUserPreferences()
  const { messages, sendMessage, status, error, clearError } = useChatContext()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [panel, setPanel] = useState<'assistant' | 'guide'>('guide')

  useEffect(() => {
    const savedPanel = localStorage.getItem('chorus-right-sidebar-panel')
    if (savedPanel === 'assistant' || savedPanel === 'guide')
      setPanel(savedPanel)
  }, [])

  const selectPanel = (nextPanel: 'assistant' | 'guide') => {
    setPanel(nextPanel)
    localStorage.setItem('chorus-right-sidebar-panel', nextPanel)
  }

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading, error])

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
    setInput('')
    sendMessage({ text: trimmed })
  }

  const handleQuickPrompt = (text: string) => {
    if (isLoading) return
    sendMessage({ text })
  }

  const handleFileSelect = (file: File) => {
    const prompt = `J'ai uploadé un document: "${file.name}". Aide-moi à créer un workspace basé sur ce document. Lance le wizard de création.`
    setInput(prompt)
  }

  return isAgentEnabled() ? (
    <div className="relative flex h-full w-full flex-col">
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-muted/30 px-4">
        <div className="flex items-center gap-2 font-semibold">
          <Owl className="h-4 w-4" />
          <span>Chorus Assistant</span>
          {isLoading && (
            <span
              className={cn(
                'animate-pulse text-[11px] font-normal text-muted-foreground'
              )}
            >
              thinking…
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleRightSidebar}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <CircleX className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 border-b border-muted/30 p-1.5">
        <button
          onClick={() => selectPanel('assistant')}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors',
            panel === 'assistant'
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Assistant
        </button>
        <button
          onClick={() => selectPanel('guide')}
          className={cn(
            'flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors',
            panel === 'guide'
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <BookOpen className="h-3.5 w-3.5" />
          User Guide
        </button>
      </div>

      {panel === 'guide' ? (
        <UserGuide />
      ) : (
        <>
          <div
            ref={scrollRef}
            className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4"
          >
            <WelcomeCard onPrompt={handleQuickPrompt} />
            {(messages as UIMessage[]).map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <p className="flex-1">{friendlyError(error)}</p>
                <button
                  onClick={clearError}
                  className="text-destructive/60 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
          <div className="border-t border-muted/30">
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              onFileSelect={handleFileSelect}
              disabled={isLoading}
              placeholder="Ask Chorus anything…"
            />
          </div>
        </>
      )}
    </div>
  ) : (
    <div className="relative flex h-full w-full flex-col">
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-muted/30 px-4">
        <div className="flex items-center gap-2 font-semibold">
          <span>Chorus Help</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleRightSidebar}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <CircleX className="h-4 w-4" />
        </Button>
      </div>

      <UserGuide />
    </div>
  )
}
