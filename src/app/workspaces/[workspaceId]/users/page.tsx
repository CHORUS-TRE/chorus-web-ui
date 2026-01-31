'use client'

import { LayoutGrid, Rows3, Users } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { Button } from '~/components/button'
import { AddUserToWorkspaceDialog } from '~/components/forms/add-user-to-workspace-dialog'
import { toast } from '~/components/hooks/use-toast'
import { WorkspaceRoleDistribution } from '~/components/workspace-role-distribution'
import { WorkspaceUserCard } from '~/components/workspace-user-card'
import WorkspaceUserTable from '~/components/workspace-user-table'
import { Role, User } from '~/domain/model/user'
import { useUserPreferences } from '~/stores/user-preferences-store'
import { listUsers } from '~/view-model/user-view-model'

export default function UsersPage() {
  const params = useParams<{ workspaceId: string }>()
  const workspaceId = params?.workspaceId
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)
  const { showUsersTable, toggleUsersView } = useUserPreferences()

  const loadUsers = useCallback(async () => {
    const result = await listUsers({ filterWorkspaceIDs: [workspaceId] })
    if (result.data) {
      // Filter users who have roles in this workspace
      const workspaceUsers = result.data.filter((user) =>
        user.rolesWithContext?.some(
          (role) => role.context.workspace === workspaceId
        )
      )
      setUsers(workspaceUsers)
      setError(null)
    } else {
      setError(result.error || 'Failed to load workspace members')
      toast({
        title: 'Error',
        description: result.error || 'Failed to load workspace members',
        variant: 'destructive'
      })
    }
  }, [workspaceId])

  useEffect(() => {
    if (workspaceId) {
      loadUsers()
    }
  }, [workspaceId])

  if (!workspaceId) {
    return null
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Workspace Members
        </h1>
        <p className="text-muted-foreground">
          Manage users and their roles in this workspace
        </p>
      </div>

      <WorkspaceRoleDistribution users={users} workspaceId={workspaceId} />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-6 w-6" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Members ({users.length})
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-0 overflow-hidden rounded-lg border border-border/50 bg-background/50 p-1">
              <Button
                variant="ghost"
                className={`h-8 w-8 p-0 ${!showUsersTable ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
                onClick={toggleUsersView}
                disabled={!showUsersTable}
                aria-label="Switch to grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className={`h-8 w-8 p-0 ${showUsersTable ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
                onClick={toggleUsersView}
                disabled={showUsersTable}
                aria-label="Switch to table view"
              >
                <Rows3 className="h-4 w-4" />
              </Button>
            </div>
            <AddUserToWorkspaceDialog
              workspaceId={workspaceId}
              onUserAdded={loadUsers}
            />
          </div>
        </div>

        {showUsersTable ? (
          <WorkspaceUserTable
            workspaceId={workspaceId}
            title=""
            description=""
          />
        ) : (
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {users.map((user) => (
              <WorkspaceUserCard
                key={user.id}
                user={user}
                workspaceId={workspaceId}
                onUpdate={loadUsers}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
