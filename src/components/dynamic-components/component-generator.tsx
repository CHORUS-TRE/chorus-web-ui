'use client'

import {
  AlertCircle,
  CheckCircle,
  Code,
  Copy,
  Download,
  Eye,
  Loader2,
  Play,
  Sparkles,
  Zap
} from 'lucide-react'
import React from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useAppState } from '@/providers/app-state-provider'
import { useAuthentication } from '@/providers/authentication-provider'
import {
  ComponentSpec,
  GenerationRequest,
  GenerationResponse
} from '@/types/component-system'

import { DynamicRenderer } from './dynamic-renderer'

interface ComponentGeneratorProps {
  className?: string
  onComponentGenerated?: (componentSpec: ComponentSpec) => void
}

export function ComponentGenerator({
  className = '',
  onComponentGenerated
}: ComponentGeneratorProps) {
  const { user } = useAuthentication()
  const { workspaces } = useAppState()

  // State management
  const [prompt, setPrompt] = React.useState('')
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generationResult, setGenerationResult] =
    React.useState<GenerationResponse | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState<
    'generator' | 'preview' | 'code'
  >('generator')

  // Context selection
  const [selectedWorkspace, setSelectedWorkspace] =
    React.useState<string>('none')
  const [pageContext, setPageContext] = React.useState<
    'dashboard' | 'workspace' | 'session'
  >('dashboard')

  // Enhanced sample prompts for research workflows
  const samplePrompts = [
    'Create a table showing research data',
    'Track lab equipment status',
    'Show research metrics dashboard',
    'Build a protocol for experiments',
    'Track sample storage locations',
    'Create collaboration board',
    'Design data collection form',
    'Display project timeline'
  ]

  // Available templates info
  const [availableTemplates, setAvailableTemplates] = React.useState<
    Array<{ id: string; name: string; description: string; category: string }>
  >([])

  // Fetch available templates on mount
  React.useEffect(() => {
    fetch('/api/components/templates')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAvailableTemplates(data.templates)
        }
      })
      .catch(console.error)
  }, [])

  // Handle component generation
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError(
        'Please enter a prompt describing the component you want to create'
      )
      return
    }

    // Skip authentication check for demo purposes

    setIsGenerating(true)
    setError(null)
    setGenerationResult(null)

    try {
      const request: GenerationRequest = {
        prompt: prompt.trim(),
        context: {
          workspaceId:
            selectedWorkspace === 'none'
              ? undefined
              : selectedWorkspace || undefined,
          userRole: user?.role || 'researcher',
          pageContext,
          userId: user?.id || 'demo-user'
        }
      }

      const response = await fetch('/api/components/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })

      const result: GenerationResponse = await response.json()

      if (result.success && result.componentSpec) {
        setGenerationResult(result)
        setActiveTab('preview')
        // Call the callback if provided
        if (onComponentGenerated) {
          onComponentGenerated(result.componentSpec)
        }
      } else {
        setError(result.error || 'Failed to generate component')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle sample prompt selection
  const handleSamplePrompt = (samplePrompt: string) => {
    setPrompt(samplePrompt)
  }

  // Copy component code
  const handleCopyCode = () => {
    if (generationResult?.componentSpec) {
      const code = JSON.stringify(generationResult.componentSpec, null, 2)
      navigator.clipboard.writeText(code)
    }
  }

  return (
    <div className={`mx-auto w-full max-w-6xl ${className}`}>
      <Card className="border-0 bg-gradient-to-br from-background to-muted/20 shadow-lg">
        <CardHeader className="pb-8">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            AI Component Generator
          </CardTitle>
          <CardDescription className="mx-auto max-w-2xl text-center text-base">
            Transform your ideas into functional UI components using natural
            language. Describe what you need and watch AI create
            research-specific components integrated with CHORUS.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as 'generator' | 'preview' | 'code')
            }
            className="w-full"
          >
            <TabsList className="grid h-14 w-full grid-cols-3 bg-muted/50 p-1">
              <TabsTrigger
                value="generator"
                className="h-12 text-sm font-medium"
              >
                <Zap className="mr-2 h-4 w-4" />
                Generate
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                disabled={!generationResult}
                className="h-12 text-sm font-medium"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger
                value="code"
                disabled={!generationResult}
                className="h-12 text-sm font-medium"
              >
                <Code className="mr-2 h-4 w-4" />
                Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="mt-8 space-y-8">
              {/* Context Selection */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label
                    htmlFor="workspace"
                    className="text-sm font-medium text-foreground"
                  >
                    Workspace Context (Optional)
                  </Label>
                  <Select
                    value={selectedWorkspace}
                    onValueChange={setSelectedWorkspace}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select workspace..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        No workspace selected
                      </SelectItem>
                      {workspaces?.map((workspace) => (
                        <SelectItem key={workspace.id} value={workspace.id}>
                          {workspace.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="pageContext"
                    className="text-sm font-medium text-foreground"
                  >
                    Page Context
                  </Label>
                  <Select
                    value={pageContext}
                    onValueChange={(value) =>
                      setPageContext(
                        value as 'dashboard' | 'workspace' | 'session'
                      )
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="workspace">Workspace</SelectItem>
                      <SelectItem value="session">Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Prompt Input */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="prompt"
                    className="text-sm font-medium text-foreground"
                  >
                    Describe the component you want to create
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Example: Create a table showing my workspace data with search and export features"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="min-h-[100px] resize-none text-base"
                  />
                </div>

                {/* AI Suggestion Indicator */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  <span>
                    AI will analyze your prompt and suggest the best component
                    type
                  </span>
                </div>
              </div>

              {/* Sample Prompts */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-foreground">
                    Try these example prompts:
                  </Label>
                  <Badge variant="secondary" className="text-xs">
                    Click to use
                  </Badge>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {samplePrompts.map((samplePrompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto justify-start p-4 text-left transition-all duration-200 hover:border-primary hover:bg-primary/5"
                      onClick={() => handleSamplePrompt(samplePrompt)}
                    >
                      <div className="flex items-start gap-3">
                        <Play className="mt-0.5 h-4 w-4 text-primary" />
                        <span className="text-sm">{samplePrompt}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Available Templates */}
              {availableTemplates.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-foreground">
                    Available component types:
                  </Label>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {availableTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className="p-4 transition-shadow hover:shadow-md"
                      >
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm font-medium">
                              {template.name}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {template.description}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {template.promptPatterns
                              .slice(0, 3)
                              .map((pattern: string) => (
                                <Badge
                                  key={pattern}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {pattern}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Generate Button */}
              <div className="pt-4">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="h-14 w-full text-base font-medium shadow-lg transition-all duration-200 hover:shadow-xl"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Generating Component...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-3 h-5 w-5" />
                      Generate Component
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              {generationResult?.componentSpec && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Component Preview
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Generated: {generationResult.componentSpec.component}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyCode}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Code
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Live Preview */}
                  <div className="rounded-lg border bg-white p-4 dark:bg-gray-50">
                    <div className="mb-4 text-sm text-gray-600 dark:text-gray-700">
                      Live Component Preview:
                    </div>
                    <div className="theme-light">
                      <DynamicRenderer
                        componentSpec={generationResult.componentSpec}
                        data={getSampleData(
                          generationResult.componentSpec.component
                        )}
                      />
                    </div>
                  </div>

                  {/* HTML Preview */}
                  {generationResult.preview && (
                    <div className="space-y-2">
                      <Label className="text-foreground">Static Preview:</Label>
                      <div
                        className="rounded-lg border bg-white p-4"
                        dangerouslySetInnerHTML={{
                          __html: generationResult.preview
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              {generationResult?.componentSpec && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">
                      Component Specification
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyCode}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Code
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground">Component Type:</Label>
                      <code className="mt-1 block rounded bg-muted p-2 text-sm">
                        {generationResult.componentSpec.component}
                      </code>
                    </div>

                    <div>
                      <Label className="text-foreground">
                        Props Configuration:
                      </Label>
                      <pre className="mt-1 overflow-auto rounded bg-muted p-4 text-sm">
                        {JSON.stringify(
                          generationResult.componentSpec.props,
                          null,
                          2
                        )}
                      </pre>
                    </div>

                    {generationResult.componentSpec.apiBinding && (
                      <div>
                        <Label className="text-foreground">
                          API Integration:
                        </Label>
                        <pre className="mt-1 overflow-auto rounded bg-muted p-4 text-sm">
                          {JSON.stringify(
                            generationResult.componentSpec.apiBinding,
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    )}

                    <div>
                      <Label className="text-foreground">
                        Full Specification:
                      </Label>
                      <pre className="mt-1 max-h-64 overflow-auto rounded bg-muted p-4 text-sm">
                        {JSON.stringify(
                          generationResult.componentSpec,
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

// Enhanced helper function to get sample data for preview
function getSampleData(componentType: string): Record<string, unknown> {
  switch (componentType) {
    case 'GeneratedDataTable':
      return [
        {
          id: '1',
          name: 'Research Project Alpha',
          status: 'active',
          created: '2024-01-15'
        },
        {
          id: '2',
          name: 'Data Analysis Beta',
          status: 'completed',
          created: '2024-02-20'
        },
        {
          id: '3',
          name: 'Collaboration Gamma',
          status: 'pending',
          created: '2024-03-10'
        }
      ]

    case 'GeneratedMetricCard':
      return { value: 1234, trend: 'up' }

    case 'GeneratedProgressBar':
      return { current: 75, total: 100 }

    case 'GeneratedMetricsDashboard':
      return {
        metrics: [
          { name: 'Active Projects', value: 12, trend: 'up', change: 8.3 },
          { name: 'Completed Studies', value: 45, trend: 'up', change: 12.1 },
          { name: 'Participants', value: 1247, trend: 'stable', change: 0.2 },
          { name: 'Data Points', value: 28560, trend: 'up', change: 15.7 }
        ]
      }

    case 'GeneratedEquipmentTracker':
      return {
        equipment: [
          {
            id: 'EQ001',
            name: 'Microscope A',
            status: 'available',
            location: 'Lab 1'
          },
          {
            id: 'EQ002',
            name: 'Centrifuge B',
            status: 'in-use',
            location: 'Lab 2'
          },
          {
            id: 'EQ003',
            name: 'Spectrometer C',
            status: 'maintenance',
            location: 'Lab 3'
          }
        ]
      }

    case 'GeneratedProtocolBuilder':
      return {
        sections: ['Overview', 'Materials', 'Procedure', 'Safety', 'Analysis']
      }

    case 'GeneratedSampleTracker':
      return {
        samples: [
          {
            id: 'S001',
            type: 'blood',
            status: 'stored',
            location: 'Freezer A1'
          },
          {
            id: 'S002',
            type: 'tissue',
            status: 'processing',
            location: 'Lab B'
          },
          { id: 'S003', type: 'dna', status: 'analyzed', location: 'Archive' }
        ]
      }

    case 'GeneratedKanbanBoard':
      return {
        columns: [
          {
            id: 'todo',
            title: 'To Do',
            tasks: [
              { id: '1', title: 'Review protocol', assignee: 'Dr. Smith' }
            ]
          },
          {
            id: 'progress',
            title: 'In Progress',
            tasks: [{ id: '2', title: 'Data collection', assignee: 'Lab Team' }]
          },
          { id: 'review', title: 'Under Review', tasks: [] },
          {
            id: 'done',
            title: 'Completed',
            tasks: [{ id: '3', title: 'Literature review' }]
          }
        ]
      }

    case 'GeneratedDataForm':
      return {
        fields: [
          {
            name: 'participant_id',
            type: 'text',
            required: true,
            label: 'Participant ID'
          },
          { name: 'age', type: 'number', required: true, label: 'Age' },
          {
            name: 'gender',
            type: 'select',
            required: true,
            label: 'Gender',
            options: ['Male', 'Female', 'Other']
          },
          {
            name: 'notes',
            type: 'textarea',
            required: false,
            label: 'Additional Notes'
          }
        ]
      }

    case 'GeneratedTimeline':
      return {
        events: [
          {
            date: '2024-01-15',
            title: 'Project Initiation',
            status: 'completed'
          },
          {
            date: '2024-02-20',
            title: 'Data Collection Start',
            status: 'in-progress'
          },
          { date: '2024-04-10', title: 'Interim Analysis', status: 'pending' },
          { date: '2024-06-30', title: 'Final Report', status: 'pending' }
        ]
      }

    default:
      return {}
  }
}
