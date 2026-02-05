'use client'

import { owl } from '@lucide/lab'
import {
  Bot,
  CircleHelp,
  CircleX,
  createLucideIcon,
  HelpCircle,
  Send,
  Settings,
  Sparkles,
  Store,
  User
} from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { isSessionPath, isWebappPath } from '@/lib/route-utils'
import { cn } from '@/lib/utils'
import { useUserPreferences } from '@/stores/user-preferences-store'
import { Button } from '~/components/button'
import { Input } from '~/components/ui/input'

import { GettingStartedSection } from './getting-started-section'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  action?: {
    label: string
    href: string
  }
}

const Owl = createLucideIcon('Owl', owl)

export default function RightSidebar() {
  const router = useRouter()
  const { toggleRightSidebar, showRightSidebar } = useUserPreferences()
  const { workspaceId, sessionId } = useParams()
  const pathname = usePathname()
  const scrollRef = useRef<HTMLDivElement>(null)

  const isSessionPage = isSessionPath(pathname) && !isWebappPath(pathname)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Welcome to Chorus! I'm here to help you get the most out of your workspace.",
      timestamp: new Date()
    }
  ])

  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (isSessionPage && messages.length === 1) {
      // Add tips after a short delay
      const timer = setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: '2',
            role: 'assistant',
            content:
              'To get started, launch your first app from the App Store. You can find many tools ready to use!',
            timestamp: new Date(),
            action: {
              label: 'Open App Store',
              href: `/app-store`
            }
          }
        ])
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isSessionPage, messages.length, workspaceId, sessionId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInputValue('')

    // Mock auto-reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'I\'m currently in "Guide Mode". I can help you navigate the platform and launch apps. What would you like to know?',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, reply])
    }, 1000)
  }

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-muted/30 px-4">
        <div className="flex items-center gap-2 font-semibold">
          <Owl className="h-4 w-4" />
          <span>Chorus Assistant</span>
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

      {/* Messages Area */}
      {isSessionPage && (
        <div
          ref={scrollRef}
          className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'mb-4 flex w-full',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'flex max-w-[85%] gap-3',
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    message.role === 'user' ? 'bg-primary/20' : 'bg-muted/40'
                  )}
                >
                  {message.role === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div
                  className={cn(
                    'rounded-2xl px-4 py-2 text-sm shadow-sm',
                    message.role === 'user'
                      ? 'rounded-tr-none bg-primary text-primary-foreground'
                      : 'rounded-tl-none border border-muted/20 bg-muted/30'
                  )}
                >
                  {message.content}
                  {message.action && (
                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant="accent-filled"
                        className="h-8 rounded-lg text-xs"
                        onClick={() => {
                          router.push(message.action!.href)
                        }}
                      >
                        <Store className="mr-2 h-3.5 w-3.5" />
                        {message.action.label}
                      </Button>
                    </div>
                  )}
                  <div className="mt-1 text-[10px] opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!isSessionPage && <GettingStartedSection />}

      {/* Input Area */}
      {/* <div className="border-t border-muted/30 p-4">
        <div className="relative flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            className="border-muted/30 bg-muted/20 pr-10 focus-visible:ring-primary/50"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSendMessage}
            className="absolute right-1 text-primary hover:bg-transparent"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          <QuickAction icon={<Store className="h-3 w-3" />} label="App Store" />
          <QuickAction icon={<HelpCircle className="h-3 w-3" />} label="Docs" />
          <QuickAction
            icon={<Settings className="h-3 w-3" />}
            label="Settings"
          />
        </div>
      </div> */}
    </div>
  )
}

function QuickAction({
  icon,
  label
}: {
  icon: React.ReactNode
  label: string
}) {
  return (
    <button className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-muted/30 bg-muted/10 px-3 py-1.5 text-[10px] font-medium transition-colors hover:bg-muted/20">
      {icon}
      {label}
    </button>
  )
}
