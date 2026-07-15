'use client'

import { ArrowRight } from 'lucide-react'
import { useMemo } from 'react'

import { WorkspaceCreateFormInline } from '@/components/forms/workspace-forms'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAppState } from '@/stores/app-state-store'

interface StepWorkspaceProps {
  onCreated: (workspace: { id: string; name: string }) => void
  onBack: () => void
}

export function StepWorkspace({ onCreated, onBack }: StepWorkspaceProps) {
  const { user } = useAuthentication()
  const { workspaces } = useAppState()

  const myWorkspaces = useMemo(() => {
    return (workspaces ?? []).filter((workspace) => {
      const isOwner = workspace.userId === user?.id
      const isMember = user?.rolesWithContext?.some(
        (role) => role.context.workspace === workspace.id
      )
      return isOwner || isMember
    })
  }, [workspaces, user])

  return (
    <>
      <div className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        Step 3 of 5
      </div>
      <h2 className="mb-3.5 text-[34px] font-medium tracking-[-0.02em]">
        Set up your workspace
      </h2>
      <p className="mb-[30px] max-w-[560px] text-[14.5px] leading-[1.6] text-muted-foreground">
        A workspace is a shared project space — it holds your data, sessions and
        collaborators behind one access agreement. Jump into one you already
        have, or create a new one.
      </p>

      {/* Existing workspaces */}
      {myWorkspaces.length > 0 && (
        <div className="mb-7 max-w-[640px]">
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
            Use an existing workspace
          </div>
          <div className="flex flex-col gap-2">
            {myWorkspaces.map((ws) => (
              <button
                key={ws.id}
                type="button"
                onClick={() => onCreated({ id: ws.id, name: ws.name })}
                className="flex items-center justify-between rounded-[10px] border border-muted/40 bg-muted/10 px-4 py-3 text-left transition-colors hover:border-accent/40"
              >
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-medium text-foreground">
                    {ws.name}
                  </div>
                  {ws.description && (
                    <div className="truncate text-[12px] text-muted-foreground">
                      {ws.description}
                    </div>
                  )}
                </div>
                <ArrowRight className="h-[15px] w-[15px] flex-none text-muted-foreground" />
              </button>
            ))}
          </div>

          <div className="mb-1 mt-7 flex items-center gap-3 text-[11px] uppercase tracking-[0.1em] text-muted-foreground/60">
            <span className="h-px flex-1 bg-border" />
            or create a new one
            <span className="h-px flex-1 bg-border" />
          </div>
        </div>
      )}

      <div className="max-w-[640px]">
        <WorkspaceCreateFormInline
          userId={user?.id}
          onSuccess={(workspace) => onCreated(workspace)}
          footer={({ isSubmitting }) => (
            <div className="flex items-center gap-3.5 pt-8">
              <button
                type="button"
                onClick={onBack}
                className="px-2 py-[11px] text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 rounded-full border border-accent px-[22px] py-[11px] text-sm font-medium text-accent transition-all hover:gap-2.5 disabled:opacity-40"
              >
                {isSubmitting ? 'Creating…' : 'Create workspace'}
                {!isSubmitting && <ArrowRight className="h-[15px] w-[15px]" />}
              </button>
              <span className="ml-1 text-xs text-muted-foreground/70">
                Step 3 of 5
              </span>
            </div>
          )}
        />
      </div>
    </>
  )
}
