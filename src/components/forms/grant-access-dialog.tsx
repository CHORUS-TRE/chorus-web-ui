'use client'

import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useState
} from 'react'

import { errorToast } from '@/components/error-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ROLE_DISPLAY_NAMES } from '@/config/permissions'
import { Result } from '@/domain/model'
import { User } from '@/domain/model/user'
import { cn } from '@/lib/utils'
import { useRoles } from '@/providers/roles-provider'
import { createUserRole } from '@/view-model/user-view-model'

import { toast } from '../hooks/use-toast'

const PREVIEW_PERMISSION_LIMIT = 10

interface GrantAccessDialogProps {
  users: User[]
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultUserId?: string
  defaultRoleName?: string
  onGranted: (user: User) => void
}

export function GrantAccessDialog({
  users,
  open,
  onOpenChange,
  defaultUserId,
  defaultRoleName,
  onGranted
}: GrantAccessDialogProps) {
  const { roles, rolesByName, availableScopes } = useRoles()

  const [userId, setUserId] = useState(defaultUserId ?? '')
  const [roleName, setRoleName] = useState(defaultRoleName ?? '')
  const [workspace, setWorkspace] = useState('')
  const [workbench, setWorkbench] = useState('')
  const [userCtx, setUserCtx] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const [state, formAction] = useActionState(createUserRole, {} as Result<User>)

  // Reset fields whenever the dialog opens with new defaults.
  useEffect(() => {
    if (open) {
      setUserId(defaultUserId ?? '')
      setRoleName(defaultRoleName ?? '')
      setWorkspace('')
      setWorkbench('')
      setUserCtx('')
      setFormError(null)
    }
  }, [open, defaultUserId, defaultRoleName])

  // Handle the server action result.
  useEffect(() => {
    if (state.data) {
      onGranted(state.data)
      onOpenChange(false)
    } else if (state.issues && state.issues.length > 0) {
      toast({
        title: 'Validation error',
        description: state.issues
          .map((i) => {
            const path = i.path.join('.')
            return path ? `${path}: ${i.message}` : i.message
          })
          .join('\n'),
        variant: 'destructive'
      })
    } else if (state.error) {
      toast({
        title: 'Failed to grant access',
        ...errorToast(state.error),
        variant: 'destructive'
      })
    }
  }, [state, onGranted, onOpenChange])

  const rolesByScope = useMemo(() => {
    const grouped: Record<string, typeof roles> = {}
    for (const role of roles) {
      ;(grouped[role.scope] ??= []).push(role)
    }
    return grouped
  }, [roles])

  const selectedRole = roleName ? rolesByName.get(roleName) : undefined
  const needsWorkspace = selectedRole?.context.includes('workspace') ?? false
  const needsWorkbench = selectedRole?.context.includes('workbench') ?? false
  const needsUser = selectedRole?.context.includes('user') ?? false

  const handleSubmit = () => {
    setFormError(null)

    if (!userId) {
      setFormError('Select a user.')
      return
    }
    if (!roleName) {
      setFormError('Select a role.')
      return
    }
    if (needsWorkspace && !workspace.trim()) {
      setFormError('Workspace context is required for this role.')
      return
    }
    if (needsWorkbench && !workbench.trim()) {
      setFormError('Session context is required for this role.')
      return
    }

    const formData = new FormData()
    formData.append('userId', userId)
    formData.append('roleName', roleName)
    if (needsWorkspace && workspace.trim())
      formData.append('workspace', workspace.trim())
    if (needsWorkbench && workbench.trim())
      formData.append('workbench', workbench.trim())
    if (needsUser && userCtx.trim()) formData.append('user', userCtx.trim())

    startTransition(() => {
      formAction(formData)
    })
  }

  const previewPermissions = selectedRole?.permissions ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Grant access</DialogTitle>
          <DialogDescription>
            Assign a role to a user, with the context it applies to.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="grant-user">User</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger id="grant-user" aria-label="Select user">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.firstName} {u.lastName} (@{u.username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grant-role">Role</Label>
            <Select value={roleName} onValueChange={setRoleName}>
              <SelectTrigger id="grant-role" aria-label="Select role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {availableScopes.map((scope) => (
                  <SelectGroup key={scope}>
                    <SelectLabel className="capitalize">{scope}</SelectLabel>
                    {(rolesByScope[scope] ?? []).map((r) => (
                      <SelectItem key={r.name} value={r.name}>
                        {ROLE_DISPLAY_NAMES[r.name] ?? r.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grant-workspace">Workspace context</Label>
            <Input
              id="grant-workspace"
              value={workspace}
              disabled={!needsWorkspace}
              onChange={(e) => setWorkspace(e.target.value)}
              placeholder={
                needsWorkspace
                  ? 'required: workspace id or slug'
                  : 'not needed for this role'
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grant-workbench">Session context</Label>
            <Input
              id="grant-workbench"
              value={workbench}
              disabled={!needsWorkbench}
              onChange={(e) => setWorkbench(e.target.value)}
              placeholder={
                needsWorkbench
                  ? 'required: session id or slug'
                  : 'not needed for this role'
              }
            />
          </div>

          {needsUser && (
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="grant-user-ctx">User context</Label>
              <Input
                id="grant-user-ctx"
                value={userCtx}
                onChange={(e) => setUserCtx(e.target.value)}
                placeholder="user id or username (or * for all)"
              />
            </div>
          )}

          {/* Role preview */}
          {selectedRole && (
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 md:col-span-2">
              <p className="text-sm font-semibold">
                {ROLE_DISPLAY_NAMES[selectedRole.name] ?? selectedRole.name}{' '}
                preview
              </p>
              {selectedRole.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {selectedRole.description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-accent text-accent">
                  {selectedRole.scope}
                </Badge>
                <Badge variant="secondary">
                  {selectedRole.permissions.length} permissions
                </Badge>
                <Badge variant="secondary">
                  {selectedRole.dynamic ? 'context required' : 'global'}
                </Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {previewPermissions
                  .slice(0, PREVIEW_PERMISSION_LIMIT)
                  .map((perm) => (
                    <Badge
                      key={perm}
                      variant="secondary"
                      className="text-[10px] font-normal"
                    >
                      {perm}
                    </Badge>
                  ))}
                {previewPermissions.length > PREVIEW_PERMISSION_LIMIT && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-normal"
                  >
                    +{previewPermissions.length - PREVIEW_PERMISSION_LIMIT} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {formError && (
          <p className={cn('text-sm text-destructive')}>{formError}</p>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add grant</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
