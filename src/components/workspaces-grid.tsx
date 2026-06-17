'use client'
import { useCallback, useMemo, useState } from 'react'

import {
  WorkspaceDeleteForm,
  WorkspaceUpdateForm
} from '@/components/forms/workspace-forms'
import { WorkspaceCard } from '@/components/workspace-card'
import { User, WorkspaceWithDev } from '@/domain/model'
import { useAppState } from '@/stores/app-state-store'

import { toast } from './hooks/use-toast'

interface WorkspacesGridProps {
  workspaces: WorkspaceWithDev[] | undefined
  user: User | undefined
  onUpdate?: () => void
}

export default function WorkspacesGrid({
  workspaces,
  user,
  onUpdate
}: WorkspacesGridProps) {
  const [activeUpdateId, setActiveUpdateId] = useState<string | null>(null)
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null)

  const refreshWorkspaces = useAppState((state) => state.refreshWorkspaces)

  // Find the active workspace for dialogs, using a stable lookup
  const activeUpdateWorkspace = useMemo(
    () => workspaces?.find((w) => w.id === activeUpdateId),
    [workspaces, activeUpdateId]
  )
  const activeDeleteWorkspace = useMemo(
    () => workspaces?.find((w) => w.id === activeDeleteId),
    [workspaces, activeDeleteId]
  )

  const closeUpdate = useCallback(() => setActiveUpdateId(null), [])
  const closeDelete = useCallback(() => setActiveDeleteId(null), [])

  return (
    <>
      <div
        className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,280px))]"
        id="workspaces-grid"
      >
        {user &&
          workspaces?.map((workspace) => (
            <WorkspaceCard
              key={`workspace-grid-${workspace.id}`}
              workspace={workspace}
              onEdit={setActiveUpdateId}
              onDelete={setActiveDeleteId}
            />
          ))}
      </div>

      {/* Render dialogs outside .map() so they survive list re-renders */}
      <WorkspaceUpdateForm
        workspace={activeUpdateWorkspace}
        state={[!!activeUpdateId, closeUpdate]}
        onSuccess={() => {
          toast({
            title: 'Success!',
            description: 'Workspace updated'
          })
          if (onUpdate) onUpdate()
          refreshWorkspaces()
        }}
      />

      <WorkspaceDeleteForm
        id={activeDeleteWorkspace?.id}
        state={[!!activeDeleteId, closeDelete]}
        onSuccess={() => {
          refreshWorkspaces()
          toast({
            title: 'Success!',
            description: `Workspace ${activeDeleteWorkspace?.name} deleted`
          })
          if (onUpdate) onUpdate()
        }}
      />
    </>
  )
}
