'use client'

import { useChat } from '@ai-sdk/react'
import { owl } from '@lucide/lab'
import { DefaultChatTransport, UIMessage } from 'ai'
import {
  ChevronDown,
  ChevronUp,
  CircleX,
  createLucideIcon,
  MessageSquare
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import { useChatStore } from '@/stores/chat-store'
import { Button } from '~/components/ui/button'

import { ChatInput } from './chat-input'
import { ChatMessage, TypingIndicator } from './chat-message'

const Owl = createLucideIcon('Owl', owl)

const PAGE_ROUTES: Record<string, string> = {
  dashboard: '/',
  workspaces: '/workspaces',
  sessions: '/sessions',
  'app-store': '/app-store',
  data: '/data',
  messages: '/messages'
}

export function ChatBar() {
  const { isOpen, isExpanded, open, close, toggleExpand } = useChatStore()
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onFinish: ({ message }: { message: UIMessage }) => {
      // Handle navigation tool results after streaming finishes
      for (const part of message.parts) {
        if (
          part.type === 'tool-showPage' &&
          'state' in part &&
          part.state === 'output-available' &&
          'output' in part
        ) {
          const output = part.output as { page?: string }
          if (output.page && PAGE_ROUTES[output.page]) {
            router.push(PAGE_ROUTES[output.page])
          }
        }
      }
    }
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSubmit = () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
    setInput('')
    sendMessage({ text: trimmed })
  }

  const handleFileSelect = (file: File) => {
    const prompt = `J'ai uploadé un document: "${file.name}". Aide-moi à créer un workspace basé sur ce document. Lance le wizard de création.`
    setInput(prompt)
  }

  const chatHeight = isExpanded ? 'h-[85vh]' : 'h-[42vh]'

  return (
    <>
      {/* Floating pill button (collapsed state) */}
      {!isOpen && (
        <button
          onClick={open}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-primary/30 bg-contrast-background/90 px-4 py-2.5 text-sm font-medium text-foreground shadow-lg backdrop-blur-md transition-all hover:border-primary/60 hover:bg-contrast-background hover:shadow-primary/10"
        >
          <Owl className="h-4 w-4 text-primary" />
          <span>Ask Chorus</span>
          {messages.length > 0 && (
            <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {messages.length}
            </span>
          )}
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          className={cn(
            'fixed bottom-0 left-[256px] right-0 z-50 flex flex-col',
            'border-t border-muted/40 bg-contrast-background/95 shadow-2xl backdrop-blur-xl',
            'transition-all duration-300 ease-in-out',
            chatHeight
          )}
        >
          {/* Header */}
          <div className="flex h-10 flex-shrink-0 items-center justify-between border-b border-muted/30 px-4">
            <div className="flex items-center gap-2">
              <Owl className="h-3.5 w-3.5 text-primary" />
              <span className="text-sm font-semibold">Chorus Assistant</span>
              {isLoading && (
                <span className="animate-pulse text-[11px] text-muted-foreground">
                  thinking…
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={toggleExpand}
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronUp className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={close}
              >
                <CircleX className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Messages feed */}
          <div
            ref={scrollRef}
            className="custom-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-4"
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Chorus Assistant</p>
                  <p className="text-sm text-muted-foreground">
                    Ask me to show workspaces, sessions, or help you create a
                    new project.
                  </p>
                </div>
              </div>
            )}
            {messages.map((msg: UIMessage) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>

          {/* Input */}
          <div className="flex-shrink-0 border-t border-muted/20">
            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              onFileSelect={handleFileSelect}
              disabled={isLoading}
            />
          </div>
        </div>
      )}
    </>
  )
}
