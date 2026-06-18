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

export type RoleScope = 'platform' | 'workspace' | 'session'

export function getRoleScope(
  roleName: string,
  rolesByName: Map<string, { scope?: string }>
): RoleScope {
  const scope = rolesByName.get(roleName)?.scope
  if (scope === 'workspace' || scope === 'session') return scope
  return 'platform'
}

interface RoleBadgeProps {
  role: Role
  onRemove?: () => void
  className?: string
}

export function RoleBadge({ role, onRemove, className }: RoleBadgeProps) {
  const { rolesByName } = useRoles()
  const scope = getRoleScope(role.name, rolesByName)
  const description = rolesByName.get(role.name)?.description ?? ''
  const displayName = ROLE_DISPLAY_NAMES[role.name] ?? role.name

  const badge = (
    <Badge
      variant="outline"
      className={cn('gap-1 whitespace-nowrap rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground', className)}
    >
      <span>{displayName}</span>
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
        <TooltipContent
          side="top"
          className="z-[100] max-w-xs rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 shadow-xl dark:border-neutral-600 dark:bg-neutral-100 dark:text-neutral-900"
        >
          <p className="font-medium">{displayName}</p>
          <p className="opacity-80">{description}</p>
          <p className="mt-1 text-[10px] opacity-60">Scope: {scope}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}