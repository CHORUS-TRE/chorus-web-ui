'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, UIMessage } from 'ai'
import { useRouter } from 'next/navigation'
import React, { createContext, useContext, useEffect, useRef } from 'react'

import { useChatStore } from '@/stores/chat-store'

const PAGE_ROUTES: Record<string, string> = {
  dashboard: '/',
  workspaces: '/workspaces',
  sessions: '/sessions',
  'app-store': '/app-store',
  data: '/data',
  messages: '/messages'
}

interface ChatContextValue {
  messages: UIMessage[]
  sendMessage: (options: { text: string }) => void
  status: string
  error: Error | undefined
  clearError: () => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  // Read persisted messages once on mount (no subscription — getState avoids re-renders)
  const initialMessages = useRef<UIMessage[]>(useChatStore.getState().messages)

  const { messages, sendMessage, status, error, clearError } = useChat({
    messages:
      initialMessages.current.length > 0 ? initialMessages.current : undefined,
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onFinish: ({ message }: { message: UIMessage }) => {
      for (const part of message.parts) {
        if (
          part.type === 'tool-navigateTo' &&
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

  // Persist messages to Zustand whenever they change so the next mount can restore them
  useEffect(() => {
    useChatStore.getState().setMessages(messages as UIMessage[])
  }, [messages])

  return (
    <ChatContext.Provider
      value={{
        messages: messages as UIMessage[],
        sendMessage,
        status,
        error,
        clearError
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider')
  return ctx
}
