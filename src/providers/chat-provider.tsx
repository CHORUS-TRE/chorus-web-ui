'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, UIMessage } from 'ai'
import React, { createContext, useContext, useEffect, useRef } from 'react'

import { useChatStore } from '@/stores/chat-store'

interface ChatContextValue {
  messages: UIMessage[]
  sendMessage: (options: { text: string }) => void
  status: string
  error: Error | undefined
  clearError: () => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // Read persisted messages once on mount (no subscription — getState avoids re-renders)
  const initialMessages = useRef<UIMessage[]>(useChatStore.getState().messages)

  const { messages, sendMessage, status, error, clearError } = useChat({
    messages:
      initialMessages.current.length > 0 ? initialMessages.current : undefined,
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onFinish: () => {
      // Tool outputs are handled by the artifact renderers in ChatMessage
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
