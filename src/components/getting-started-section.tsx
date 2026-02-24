'use client'

import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/button'
import { useAuthentication } from '@/providers/authentication-provider'
import { useIframeCache } from '@/providers/iframe-cache-provider'
import { useAppState } from '@/stores/app-state-store'

interface GettingStartedStep {
  id: string
  title: string
  description: string
  icon: string
  link: string
  path?: string
}

interface AISuggestion {
  id: string
  type: 'workspace' | 'security' | 'data-policy' | 'resource' | 'best-practice'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  action?: {
    label: string
    href: string
  }
  context?: {
    role?: string
    workspaceCount?: number
    securityLevel?: string
  }
}

interface GettingStartedContent {
  steps: GettingStartedStep[]
}

const STORAGE_KEY_DISMISSED = 'getting-started-dismissed'
export const STORAGE_KEY_COLLAPSED = 'getting-started-collapsed'

async function fetchGettingStartedContent(): Promise<GettingStartedContent> {
  return {
    steps: [
      {
        id: 'workspace',
        title: 'How to create a Workspace',
        description: 'Set up a secure project space',
        icon: 'package',
        link: '/sessions/chorus-documentation',
        path: '/docs/user-guide/getting-started/create_workspace'
      },
      {
        id: 'session',
        title: 'How to open a Session',
        description: 'Start a computing environment',
        icon: 'computer',
        link: '/sessions/chorus-documentation',
        path: '/docs/user-guide/getting-started/launch-desktop'
      },
      {
        id: 'app',
        title: 'How to launch an App',
        description: 'Run tools from session or store',
        icon: 'grid',
        link: '/sessions/chorus-documentation',
        path: '/docs/user-guide/getting-started/start_app'
      }
    ]
  }
}

export function GettingStartedSection() {
  const { user } = useAuthentication()
  const workspaces = useAppState((state) => state.workspaces)
  const workbenches = useAppState((state) => state.workbenches)
  const { openWebApp, navigateWebApp } = useIframeCache()
  const [content, setContent] = useState<GettingStartedContent | null>(null)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Fetch content and generate suggestions
  useEffect(() => {
    async function loadContent() {
      setIsLoading(true)
      try {
        const fetchedContent = await fetchGettingStartedContent()
        setContent(fetchedContent)

        // Generate AI suggestions based on user context
        const userRoles = user?.rolesWithContext?.map((r) => r.name) || []

        // Get user's workspaces
        const myWorkspaces =
          workspaces?.filter((workspace) =>
            user?.rolesWithContext?.some(
              (role) => role.context.workspace === workspace.id
            )
          ) || []

        // Get user's active sessions
        const myWorkbenches =
          workbenches?.filter((workbench) =>
            user?.rolesWithContext?.some(
              (role) => role.context.workbench === workbench.id
            )
          ) || []

        const workspaceCount = myWorkspaces.length
        const hasActiveSessions = myWorkbenches.length > 0
      } catch (error) {
        console.error('Error loading getting-started content', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [user, workspaces, workbenches])

  const handleToggleCollapse = useCallback(() => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_COLLAPSED, String(newCollapsed))
    }
  }, [isCollapsed])

  const handleStepClick = useCallback(
    (step: GettingStartedStep) => {
      if (step.link.startsWith('/sessions/') && step.path) {
        const webappId = step.link.replace('/sessions/', '')
        // We use navigateWebApp which will open it if not already open,
        // or just update path if it is.
        navigateWebApp(webappId, step.path)
      } else {
        // Fallback for regular links if any
      }
    },
    [navigateWebApp]
  )

  if (isLoading || !content) {
    return null
  }

  return (
    <div className="flex h-full flex-col p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Getting Started</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleCollapse}
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
        >
          {isCollapsed ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="flex flex-col gap-2">
          <p className="mb-2 text-xs text-muted-foreground">
            Follow these steps to get started with Chorus.
          </p>
          {content.steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(step)}
              className="group flex items-start gap-3 rounded-lg border border-muted/30 bg-muted/10 p-3 text-left transition-all duration-200 hover:border-accent hover:bg-accent/10"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {index + 1}
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-medium text-foreground group-hover:text-accent">
                  {step.title}
                </h5>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
