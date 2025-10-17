// Component Generator Page - MVP Demo
'use client'

import {
  ExternalLink,
  Globe,
  Layers,
  Palette,
  Sparkles,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

import { BottomChat } from '@/components/chat/bottom-chat'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface GeneratedComponent {
  id: number
  spec: unknown
  preview: string
  prompt: string
  timestamp: Date
}

export default function ComponentGeneratorPage() {
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [generatedComponents, setGeneratedComponents] = useState<
    GeneratedComponent[]
  >([])

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen)
  }

  const handleMessageSend = async (message: string): Promise<void> => {
    console.log('Message sent:', message)

    try {
      // Call the component generation API
      const response = await fetch('/api/components/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: message,
          context: {
            userRole: 'researcher',
            pageContext: 'dashboard',
            userId: 'demo-user'
          }
        })
      })

      const result = await response.json()

      if (result.success) {
        console.log('Component generated successfully:', result.componentSpec)

        // Store the generated component
        const newComponent: GeneratedComponent = {
          id: Date.now(),
          spec: result.componentSpec,
          preview: result.preview || '',
          prompt: message,
          timestamp: new Date()
        }

        setGeneratedComponents((prev) => [...prev, newComponent])
        return Promise.resolve()
      } else {
        console.error('Generation failed:', result.error)
        throw new Error(result.error || 'Generation failed')
      }
    } catch (error) {
      console.error('Error generating component:', error)
      throw error
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Hero Section */}
          <div className="mb-8 text-center">
            <h1 className="mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-4xl font-bold md:text-5xl">
              Dynamic Component Generator
            </h1>
          </div>

          {/* Generated Components Display */}
          {generatedComponents.length > 0 && (
            <div className="mb-16">
              <div className="mb-8 text-center">
                <h2 className="mb-4 text-3xl font-bold text-white">
                  Your Generated Components
                </h2>
                <p className="text-muted-foreground">
                  Components created from your prompts
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {generatedComponents.map((component) => (
                  <Card
                    key={component.id}
                    className="border border-gray-700 bg-gray-900/50 text-white"
                  >
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="mb-2 text-lg font-semibold text-blue-400">
                          {(component.spec as { name?: string })?.name ||
                            'Generated Component'}
                        </h3>
                        <p className="mb-2 text-sm text-gray-300">
                          <strong>Prompt:</strong> {component.prompt}
                        </p>
                        <p className="text-xs text-gray-400">
                          Created: {component.timestamp.toLocaleTimeString()}
                        </p>
                      </div>

                      {/* Component Preview */}
                      <div className="mb-4 rounded-lg border border-gray-600 bg-gray-800/30 p-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-300">
                          Preview:
                        </h4>
                        {component.preview ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: component.preview
                            }}
                            className="text-white"
                          />
                        ) : (
                          <div className="text-sm text-gray-400">
                            Component specification:{' '}
                            {JSON.stringify(component.spec, null, 2)}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-white"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-white"
                        >
                          Use Component
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Feature Cards */}
          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-lg transition-all duration-300 hover:shadow-xl dark:from-blue-950/50 dark:to-blue-900/30">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
                  <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  Lightning Fast
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  From prompt to working component in seconds with AI-powered
                  generation
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100/50 shadow-lg transition-all duration-300 hover:shadow-xl dark:from-green-950/50 dark:to-green-900/30">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <Globe className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  Auto Integration
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Automatically connects to CHORUS API endpoints with proper
                  authentication
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 shadow-lg transition-all duration-300 hover:shadow-xl dark:from-purple-950/50 dark:to-purple-900/30">
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10">
                  <Palette className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  Research Ready
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Designed specifically for research workflows and data
                  visualization
                </p>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>

      {/* Bottom Chat Interface */}
      <BottomChat
        isOpen={isChatOpen}
        onToggle={handleChatToggle}
        onMessageSend={handleMessageSend}
      />
    </div>
  )
}
