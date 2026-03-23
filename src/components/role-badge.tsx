'use client'

import { X } from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '~/components/ui/tooltip'
import { ROLE_DEFINITIONS } from '~/config/permissions'
import type { Role } from '~/domain/model/user'
import { cn } from '~/lib/utils'
import { useAppState } from '~/stores/app-state-store'

type RoleScope = 'platform' | 'workspace' | 'session'

const scopeColors: Record<RoleScope, string> = {
  workspace: 'border-red-400',
  session: 'border-orange-400',
  platform: 'border-blue-400'
}

function getRoleScope(roleName: string): RoleScope {
  const def = ROLE_DEFINITIONS[roleName]
  const attrs = def?.attributes
  if (
    attrs?.user === '*' &&
    attrs?.workspace === '*' &&
    attrs?.workbench === '*'
  )
    return 'platform'
  if (attrs?.workbench) return 'session'
  if (attrs?.workspace && !attrs?.user) return 'workspace'
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
  const scope = getRoleScope(role.name)
  const contextName = useResolvedContextName(role)
  const def = ROLE_DEFINITIONS[role.name]

  const badge = (
    <Badge
      variant="outline"
      className={cn('gap-1 whitespace-nowrap', scopeColors[scope], className)}
    >
      <span>{role.name}</span>
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

  if (!def?.description) return badge

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs">
          <p className="font-medium">{role.name}</p>
          <p className="text-muted-foreground">{def.description}</p>
          <p className="mt-1 text-[10px] text-muted-foreground/70">
            Scope: {scope}
            {def.inheritsFrom?.length
              ? ` · Inherits: ${def.inheritsFrom.join(', ')}`
              : ''}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { getRoleScope, type RoleScope }
