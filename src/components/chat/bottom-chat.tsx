'use client'

import {
  ChevronDown,
  ChevronUp,
  GripHorizontal,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  X
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant' | 'component'
  content: string
  timestamp: Date
  componentSpec?: unknown
}

interface BottomChatProps {
  isOpen: boolean
  onToggle: () => void
  onMessageSend: (message: string) => Promise<void>
  suggestions?: string[]
  className?: string
}

export function BottomChat({
  isOpen,
  onToggle,
  onMessageSend,
  suggestions = [],
  className
}: BottomChatProps) {
  const [message, setMessage] = useState('')
  const [height, setHeight] = useState(600)
  const [isResizing, setIsResizing] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Default suggestions for component generation
  const defaultSuggestions = [
    'Create a table showing research data',
    'Track lab equipment status',
    'Show research metrics dashboard',
    'Build a protocol for experiments',
    'Track sample storage locations',
    'Create collaboration board',
    'Design data collection form',
    'Display project timeline'
  ]

  const activeSuggestions =
    suggestions.length > 0 ? suggestions : defaultSuggestions

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isGenerating) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: message.trim(),
        timestamp: new Date()
      }

      setMessages((prev) => [...prev, userMessage])
      const currentMessage = message.trim()
      setMessage('')
      setIsGenerating(true)

      try {
        // Add loading message
        const loadingMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: '🤖 Generating your component...',
          timestamp: new Date()
        }
        setMessages((prev) => [...prev, loadingMessage])

        await onMessageSend(currentMessage)

        // Remove loading message and add success message
        setMessages((prev) => {
          const filtered = prev.filter((msg) => msg.id !== loadingMessage.id)
          return [
            ...filtered,
            {
              id: (Date.now() + 2).toString(),
              type: 'assistant',
              content:
                '✅ Component generated successfully! Check the main interface above to view and interact with your new component.',
              timestamp: new Date()
            }
          ]
        })
      } catch (error) {
        // Remove loading message and add error message
        console.error('Error generating component:', error)
        setMessages((prev) => {
          const filtered = prev.filter((msg) =>
            msg.content.includes('Generating')
          )
          return [
            ...filtered,
            {
              id: (Date.now() + 2).toString(),
              type: 'assistant',
              content:
                '❌ Sorry, there was an error generating your component. Please try again.',
              timestamp: new Date()
            }
          ]
        })
      } finally {
        setIsGenerating(false)
      }
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion)
    inputRef.current?.focus()
  }

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const newHeight = window.innerHeight - e.clientY
      setHeight(Math.max(300, Math.min(800, newHeight)))
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'ns-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [isOpen])

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={onToggle}
            size="lg"
            className="h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Chat Interface */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800 bg-black/95 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-y-0' : 'translate-y-full',
          className
        )}
        style={{ height: isOpen ? `${height}px` : '0px' }}
        ref={chatRef}
      >
        {/* Resize Handle */}
        <div
          className="group absolute left-0 right-0 top-0 flex h-2 cursor-ns-resize items-center justify-center hover:bg-gray-700/50"
          onMouseDown={() => setIsResizing(true)}
        >
          <GripHorizontal className="h-4 w-4 text-gray-500 transition-colors group-hover:text-gray-300" />
        </div>

        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-600/20 p-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                AI Component Generator
              </h3>
              <p className="text-sm text-gray-400">
                Describe what you want to create
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHeight((h) => (h === 600 ? 400 : 600))}
              className="text-gray-400 hover:text-white"
            >
              {height > 500 ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Suggestions Area */}
          <div className="max-h-40 overflow-y-auto border-b border-gray-800 p-4">
            <div className="mb-3">
              <h4 className="mb-2 text-sm font-medium text-white">
                Try these examples:
              </h4>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {activeSuggestions.slice(0, 8).map((suggestion, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer border-gray-700 bg-gray-800/50 p-3 transition-all duration-200 hover:bg-gray-700/50"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-3 w-3 flex-shrink-0 text-blue-400" />
                    <span className="text-sm text-gray-300 transition-colors group-hover:text-white">
                      {suggestion}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="text-center text-sm text-gray-500">
                Start typing to generate AI components...
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-100'
                      }`}
                    >
                      <div className="text-sm">{msg.content}</div>
                      <div className="mt-1 text-xs opacity-70">
                        {msg.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-800 p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div
                className="relative flex-1"
                onClick={() => inputRef.current?.focus()}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe the component you want to create..."
                  className="b1 flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
                {message && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0 text-gray-400 hover:text-white"
                    onClick={() => setMessage('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Button
                type="submit"
                disabled={!message.trim() || isGenerating}
                className="bg-blue-600 px-6 text-white hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </form>

            {/* Status indicators */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="text-xs text-gray-400">
                  AI Assistant Ready
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Press Enter to send • {message.length}/500
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={onToggle} />
      )}
    </>
  )
}
