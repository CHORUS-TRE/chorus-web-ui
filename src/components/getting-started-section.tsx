'use client'

import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  Lightbulb,
  X
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/button'
import { Link } from '@/components/link'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAppState } from '@/stores/app-state-store'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/card'

interface GettingStartedStep {
  id: string
  title: string
  description: string
  icon: string
  link: string
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
        title: 'Create a Workspace',
        description: 'Set up a secure project space',
        icon: 'package',
        link: 'https://docs.chorus-tre.ch/docs/user-guide/getting-started/create_workspace'
      },
      {
        id: 'session',
        title: 'Open a Session',
        description: 'Start a computing environment',
        icon: 'computer',
        link: 'https://docs.chorus-tre.ch/docs/user-guide/getting-started/launch-desktop'
      },
      {
        id: 'app',
        title: 'Launch an App',
        description: 'Run tools from session or store',
        icon: 'grid',
        link: 'https://docs.chorus-tre.ch/docs/user-guide/getting-started/start_app'
      }
    ]
  }
}

export function GettingStartedSection() {
  const { user } = useAuthentication()
  const workspaces = useAppState((state) => state.workspaces)
  const workbenches = useAppState((state) => state.workbenches)
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
          workspaces?.filter(
            (workspace) =>
              user?.rolesWithContext?.some(
                (role) => role.context.workspace === workspace.id
              ) && workspace.dev?.tag !== 'center'
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

  if (isLoading || !content) {
    return null
  }

  return (
    <Card className="mb-6 border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Getting Started</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleCollapse}
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <CardDescription>Follow these steps to get started.</CardDescription>
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="space-y-6">
          {/* Getting Started Steps */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Quick Start Guide</h4>
            <div className="flex flex-wrap gap-3">
              {content.steps.map((step) => (
                <Link
                  key={step.id}
                  href={step.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block min-w-[120px] flex-1"
                >
                  <div className="rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-primary/50 hover:bg-card/80">
                    <div className="mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <h5 className="text-sm font-medium">{step.title}</h5>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
