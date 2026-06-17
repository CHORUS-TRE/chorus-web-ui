'use client'

import { Globe, Search, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { PublicWorkspaceCard } from '@/components/public-workspace-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PublicWorkspace } from '@/domain/model/public-workspace'
import { useAuthentication } from '@/providers/authentication-provider'
import { publicWorkspaceList } from '@/view-model/workspace-view-model'

export default function PublicWorkspacesPage() {
  const { user } = useAuthentication()

  const [workspaces, setWorkspaces] = useState<PublicWorkspace[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchPublicWorkspaces = useCallback(async () => {
    const result = await publicWorkspaceList()
    if (result.error) {
      setError(result.error)
    } else {
      setWorkspaces(result.data ?? [])
    }
  }, [])

  useEffect(() => {
    fetchPublicWorkspaces()
  }, [fetchPublicWorkspaces])

  const memberWorkspaceIds = useMemo(() => {
    const ids = new Set<string>()
    user?.rolesWithContext?.forEach((role) => {
      if (role.context.workspace) {
        ids.add(role.context.workspace)
      }
    })
    return ids
  }, [user?.rolesWithContext])

  const filteredWorkspaces = useMemo(() => {
    if (!workspaces) return null

    if (!searchQuery.trim()) return workspaces

    const query = searchQuery.toLowerCase()
    return workspaces.filter((ws) => {
      const contactName = [ws.contactFirstName, ws.contactLastName]
        .filter(Boolean)
        .join(' ')
      return (
        ws.name?.toLowerCase().includes(query) ||
        ws.description?.toLowerCase().includes(query) ||
        contactName.toLowerCase().includes(query)
      )
    })
  }, [workspaces, searchQuery])

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-5 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <Globe className="h-9 w-9" />
            Public Workspaces
          </h2>
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, description, or contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Globe className="mb-4 h-12 w-12 opacity-50" />
            <p className="text-lg font-medium">
              Failed to load public workspaces
            </p>
            <Button
              onClick={fetchPublicWorkspaces}
              variant="outline"
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        ) : filteredWorkspaces === null ? (
          <span className="animate-pulse text-muted">
            Loading public workspaces...
          </span>
        ) : filteredWorkspaces.length === 0 ? (
          searchQuery ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="mb-4 h-12 w-12 opacity-50" />
              <p className="text-lg font-medium">
                No workspaces match &quot;{searchQuery}&quot;
              </p>
              <Button
                onClick={() => setSearchQuery('')}
                variant="outline"
                className="mt-4"
              >
                Clear search
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Globe className="mb-4 h-12 w-12 opacity-50" />
              <p className="text-lg font-medium">
                No public workspaces available
              </p>
            </div>
          )
        ) : (
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,280px))]">
            {filteredWorkspaces.map((workspace) => (
              <PublicWorkspaceCard
                key={`public-workspace-${workspace.id}`}
                workspace={workspace}
                isMember={memberWorkspaceIds.has(workspace.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
