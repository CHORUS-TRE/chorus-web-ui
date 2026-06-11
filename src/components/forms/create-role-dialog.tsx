'use client'

import { useState } from 'react'

import { toast } from '@/components/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useRoles } from '@/providers/roles-provider'
import { createRole } from '@/view-model/authorization-view-model'

interface CreateRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

// Map scope → required context dimensions for dynamic roles.
const SCOPE_CONTEXT: Record<string, string[]> = {
  workspace: ['workspace'],
  workbench: ['workbench']
}

export function CreateRoleDialog({
  open,
  onOpenChange,
  onCreated
}: CreateRoleDialogProps) {
  const { permissions, availableScopes } = useRoles()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [scope, setScope] = useState<string>(availableScopes[0] ?? 'platform')
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset on open.
  const handleOpenChange = (next: boolean) => {
    if (next) {
      setName('')
      setDescription('')
      setScope(availableScopes[0] ?? 'platform')
      setSelectedPerms(new Set())
      setError(null)
    }
    onOpenChange(next)
  }

  const togglePerm = (perm: string) => {
    setSelectedPerms((prev) => {
      const next = new Set(prev)
      if (next.has(perm)) {
        next.delete(perm)
      } else {
        next.add(perm)
      }
      return next
    })
  }

  // Group permissions by their first context dimension (same as EffectivePermissionTags).
  const permsByGroup = permissions.reduce<Record<string, typeof permissions>>(
    (acc, p) => {
      const group = p.context[0] ?? 'platform'
      if (!acc[group]) acc[group] = []
      acc[group].push(p)
      return acc
    },
    {}
  )

  const CAMEL_CASE_RE = /^[A-Z][a-zA-Z0-9]*$/
  const nameError =
    name.length > 0 && !CAMEL_CASE_RE.test(name)
      ? 'Must be CamelCase (e.g. WorkspaceViewer)'
      : null

  const handleSubmit = async () => {
    setError(null)
    if (!name.trim()) {
      setError('Role name is required.')
      return
    }
    if (!CAMEL_CASE_RE.test(name.trim())) {
      setError('Role name must be CamelCase (e.g. WorkspaceViewer).')
      return
    }
    if (selectedPerms.size === 0) {
      setError('Select at least one permission.')
      return
    }

    const context = SCOPE_CONTEXT[scope] ?? []
    setSubmitting(true)
    const result = await createRole({
      name: name.trim(),
      description: description.trim(),
      scope,
      permissions: Array.from(selectedPerms),
      context,
      dynamic: context.length > 0
    })
    setSubmitting(false)

    if (result.error) {
      toast({
        title: 'Failed to create role',
        description: result.error,
        variant: 'destructive'
      })
      return
    }

    toast({
      title: 'Role created',
      description: `"${name.trim()}" is now in the catalog.`
    })
    onOpenChange(false)
    onCreated()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create role</DialogTitle>
          <DialogDescription>
            Define a new dynamic role and assign its permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name + scope row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role-name">Name</Label>
              <Input
                id="role-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. WorkspaceViewer"
                className={nameError ? 'border-destructive' : ''}
              />
              {nameError && (
                <p className="text-xs text-destructive">{nameError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-scope">Scope</Label>
              <Select value={scope} onValueChange={setScope}>
                <SelectTrigger id="role-scope">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableScopes.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role-description">Description</Label>
            <Textarea
              id="role-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this role allows…"
              rows={2}
            />
          </div>

          {/* Context info */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Context required:</span>
            {(SCOPE_CONTEXT[scope] ?? []).length > 0 ? (
              (SCOPE_CONTEXT[scope] ?? []).map((c) => (
                <Badge
                  key={c}
                  variant="outline"
                  className="text-[10px] capitalize"
                >
                  {c}
                </Badge>
              ))
            ) : (
              <Badge variant="secondary" className="text-[10px]">
                none (platform)
              </Badge>
            )}
            <span className="ml-1">
              · {selectedPerms.size} permission
              {selectedPerms.size !== 1 ? 's' : ''} selected
            </span>
          </div>

          {/* Permissions */}
          <div className="space-y-1">
            <Label>Permissions</Label>
            <div className="max-h-64 overflow-y-auto rounded-lg border p-3">
              {Object.entries(permsByGroup).map(([group, perms]) => (
                <div key={group} className="mb-3">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {group}
                  </p>
                  <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {perms.map((perm) => (
                      <label
                        key={perm.name}
                        className="flex cursor-pointer items-start gap-2 rounded px-2 py-1 hover:bg-accent/5"
                      >
                        <Checkbox
                          checked={selectedPerms.has(perm.name)}
                          onCheckedChange={() => togglePerm(perm.name)}
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-medium leading-tight">
                            {perm.description || perm.name}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              variant="outline"
            >
              {submitting ? 'Creating…' : 'Create role'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
