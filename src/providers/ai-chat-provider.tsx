'use client'

import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { createContext, useContext, useEffect, useState } from 'react'

interface AIChatContextType {
  isOpen: boolean
  isMinimized: boolean
  messages: UIMessage[]
  input: string
  isLoading: boolean
  toggleChat: () => void
  minimizeChat: () => void
  expandChat: () => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setInput: (input: string) => void
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined)

export function useAIChat() {
  const context = useContext(AIChatContext)
  if (context === undefined) {
    throw new Error('useAIChat must be used within an AIChatProvider')
  }
  return context
}

interface AIChatProviderProps {
  children: React.ReactNode
}

export function AIChatProvider({ children }: AIChatProviderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState('')

  // Use the existing AI chat hook pattern
  const { messages, sendMessage, status } = useChat()
  const isLoading = status === 'streaming' || status === 'submitted'

  // Load chat state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('ai-chat-state')
    if (savedState) {
      try {
        const { isOpen: savedIsOpen, isMinimized: savedIsMinimized } =
          JSON.parse(savedState)
        setIsOpen(savedIsOpen || false)
        setIsMinimized(savedIsMinimized || false)
      } catch (error) {
        console.error('Failed to load chat state:', error)
      }
    }
  }, [])

  // Save chat state to localStorage
  useEffect(() => {
    localStorage.setItem(
      'ai-chat-state',
      JSON.stringify({ isOpen, isMinimized })
    )
  }, [isOpen, isMinimized])

  // Handle body padding to push content up when chat is open
  useEffect(() => {
    const body = document.body

    const updatePadding = () => {
      // Add smooth transition for padding changes
      body.style.transition = 'padding-bottom 0.3s ease-in-out'

      if (isOpen && !isMinimized) {
        // Add bottom padding to push content up
        body.style.paddingBottom = window.innerWidth >= 640 ? '500px' : '400px'
      } else if (isOpen && isMinimized) {
        // Add minimal padding for minimized state
        body.style.paddingBottom = '64px'
      } else {
        // Remove padding when closed
        body.style.paddingBottom = '0px'
      }
    }

    updatePadding()

    // Handle window resize
    const handleResize = () => {
      if (isOpen && !isMinimized) {
        body.style.paddingBottom = window.innerWidth >= 640 ? '500px' : '400px'
      }
    }

    window.addEventListener('resize', handleResize)

    // Cleanup function
    return () => {
      body.style.paddingBottom = '0px'
      body.style.transition = ''
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen, isMinimized])

  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false)
      setIsMinimized(false)
    } else {
      setIsOpen(true)
      setIsMinimized(false)
    }
  }

  const minimizeChat = () => {
    setIsMinimized(true)
    setIsOpen(true)
  }

  const expandChat = () => {
    setIsMinimized(false)
    setIsOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage(
        {
          text: input.trim(),
          files: []
        },
        {
          body: {
            model: 'default',
            webSearch: false
          }
        }
      )
      setInput('')
    }
  }

  const value = {
    isOpen,
    isMinimized,
    messages,
    input,
    isLoading,
    toggleChat,
    minimizeChat,
    expandChat,
    handleSubmit,
    handleInputChange,
    setInput
  }

  return (
    <AIChatContext.Provider value={value}>{children}</AIChatContext.Provider>
  )
}
