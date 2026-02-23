'use client'

import { Shield } from 'lucide-react'
import { useMemo } from 'react'

import { User } from '~/domain/model/user'

interface RoleCount {
  name: string
  count: number
  color: string
  iconColor: string
}

export function WorkspaceRoleDistribution({
  users,
  workspaceId
}: {
  users: User[]
  workspaceId: string
}) {
  const distribution = useMemo(() => {
    const roles: Record<string, number> = {}

    users.forEach((user) => {
      user.rolesWithContext
        ?.filter((role) => role.context.workspace === workspaceId)
        .forEach((role) => {
          if (role.name.startsWith('Workspace')) {
            roles[role.name] = (roles[role.name] || 0) + 1
          }
        })
    })

    return Object.entries(roles).map(([name, count]) => ({
      name: name.replace('Workspace', 'Workspace '),
      count,
      color: 'bg-slate-500/20 text-slate-500 border-slate-500/30',
      iconColor: 'text-slate-500'
    }))
  }, [users, workspaceId])

  if (distribution.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        <Shield className="h-4 w-4" />
        Role Distribution
      </div>
      <div className="flex flex-wrap gap-4">
        {distribution.map((role) => (
          <div
            key={role.name}
            className={`flex items-center gap-3 rounded-xl border p-1 pl-3 pr-2 shadow-sm ${role.color}`}
          >
            <span className="text-sm font-medium">{role.name}</span>
            <div className="flex h-6 w-9 items-center justify-center rounded-lg bg-background/40 text-xs font-bold text-foreground transition-colors hover:bg-background/60">
              {role.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
