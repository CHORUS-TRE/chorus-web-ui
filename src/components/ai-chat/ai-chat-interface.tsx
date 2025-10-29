'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Maximize, Minus, Send, Sparkles, X } from 'lucide-react'

import { Message } from '@/components/ai-elements/message'
import { Button } from '@/components/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAIChat } from '@/providers/ai-chat-provider'

export function AIChatInterface() {
  const {
    isOpen,
    isMinimized,
    messages,
    input,
    isLoading,
    toggleChat,
    minimizeChat,
    expandChat,
    handleSubmit,
    handleInputChange
  } = useAIChat()

  const chatVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={chatVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div
            className={`w-full overflow-hidden border-t border-gray-200 bg-white shadow-2xl ${
              isMinimized ? 'h-16' : 'h-[400px] sm:h-[500px]'
            } transition-all duration-300 ease-in-out`}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 p-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span className="text-sm font-medium">AI Assistant</span>
                <span className="text-xs opacity-75">Connected</span>
              </div>

              <div className="flex items-center space-x-1">
                <Button
                  onClick={isMinimized ? expandChat : minimizeChat}
                  variant="ghost"
                  className="h-8 w-8 hover:bg-white/20"
                  aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
                >
                  {isMinimized ? (
                    <Maximize className="h-4 w-4" />
                  ) : (
                    <Minus className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={toggleChat}
                  variant="ghost"
                  className="h-8 w-8 hover:bg-white/20"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Chat Content - only show when not minimized */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex h-[calc(400px-64px)] flex-col sm:h-[calc(500px-64px)]"
                >
                  {/* Messages Area */}
                  <ScrollArea className="flex-1 p-4">
                    {messages.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100">
                          <Sparkles className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">
                          AI Assistant Ready
                        </h3>
                        <p className="mb-4 text-sm text-gray-500">
                          Ask for anything! The AI agent can help with layouts,
                          designs, or creative solutions.
                        </p>
                        <div className="text-xs text-gray-400">
                          💡 Try: &ldquo;Design a travel itinerary&rdquo;
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <Message
                            key={message.id}
                            from={
                              message.role as 'user' | 'assistant' | 'system'
                            }
                          >
                            {message.parts.map((part, i) => {
                              if (part.type === 'text') {
                                return <div key={i}>{part.text}</div>
                              }
                              return null
                            })}
                          </Message>
                        ))}
                        {isLoading && (
                          <div className="flex items-center space-x-2 text-gray-500">
                            <div className="flex space-x-1">
                              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                              <div
                                className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                                style={{ animationDelay: '0.1s' }}
                              ></div>
                              <div
                                className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                                style={{ animationDelay: '0.2s' }}
                              ></div>
                            </div>
                            <span className="text-sm">AI is thinking...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="border-t border-gray-200 p-4">
                    <form onSubmit={handleSubmit} className="flex space-x-2">
                      <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type a command... (e.g., 'Design a travel itinerary')"
                        disabled={isLoading}
                        className="flex-1"
                        autoComplete="off"
                      />
                      <Button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                        aria-label="Send message"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
