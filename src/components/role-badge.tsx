'use client'

import { X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { ROLE_DISPLAY_NAMES } from '@/config/permissions'
import type { Role } from '@/domain/model/user'
import { cn } from '@/lib/utils'
import { useRoles } from '@/providers/roles-provider'
import { useAppState } from '@/stores/app-state-store'

export type RoleScope = 'platform' | 'workspace' | 'session'

const scopeColors: Record<RoleScope, string> = {
  platform: 'border-primary text-primary',
  workspace: 'border-muted-foreground text-muted-foreground',
  session: 'border-accent text-accent'
}

export function getRoleScope(
  roleName: string,
  rolesByName: Map<string, { scope?: string }>
): RoleScope {
  const scope = rolesByName.get(roleName)?.scope
  if (scope === 'workspace' || scope === 'session') return scope
  return 'platform'
}

function useResolvedContextName(role: Role): string | undefined {
  const workspaces = useAppState((state) => state.workspaces)

  if (role.context?.workspace && role.context.workspace !== '*') {
    const ws = workspaces?.find((w) => w.id === role.context.workspace)
    return ws?.name || `Workspace ${role.context.workspace}`
  }
  if (role.context?.workspace === '*') return 'All workspaces'
  if (role.context?.user === '*') return 'All users'
  return undefined
}

interface RoleBadgeProps {
  role: Role
  onRemove?: () => void
  className?: string
}

export function RoleBadge({ role, onRemove, className }: RoleBadgeProps) {
  const { rolesByName } = useRoles()
  const scope = getRoleScope(role.name, rolesByName)
  const contextName = useResolvedContextName(role)
  const description = rolesByName.get(role.name)?.description ?? ''
  const displayName = ROLE_DISPLAY_NAMES[role.name] ?? role.name

  const badge = (
    <Badge
      variant="outline"
      className={cn('gap-1 whitespace-nowrap', scopeColors[scope], className)}
    >
      <span>{displayName}</span>
      {contextName && <span className="opacity-80">&rarr; {contextName}</span>}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-1 rounded-full p-0.5 hover:bg-white/20"
          aria-label={`Remove role ${role.name}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  )

  if (!description) return badge

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs">
          <p className="font-medium">{displayName}</p>
          <p className="text-muted-foreground">{description}</p>
          <p className="mt-1 text-[10px] text-muted-foreground/70">
            Scope: {scope}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
