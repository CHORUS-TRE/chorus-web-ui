'use client'

import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useRoles } from '@/providers/roles-provider'

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Group a permission by its primary context dimension (or "Global"). */
function groupOf(context: string[]): string {
  return context.length > 0 ? capitalize(context[0]) : 'Global'
}

export default function PermissionExplorerPage() {
  const { permissions, roles } = useRoles()

  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState('all')

  const groups = useMemo(() => {
    const set = new Set<string>()
    for (const p of permissions) set.add(groupOf(p.context))
    return Array.from(set).sort()
  }, [permissions])

  const usedByCount = useMemo(() => {
    const counts = new Map<string, number>()
    for (const role of roles) {
      for (const perm of role.permissions) {
        counts.set(perm, (counts.get(perm) ?? 0) + 1)
      }
    }
    return counts
  }, [roles])

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()
    return permissions.filter((p) => {
      const matchesGroup =
        groupFilter === 'all' || groupOf(p.context) === groupFilter
      const matchesQuery =
        !query || `${p.name} ${p.description}`.toLowerCase().includes(query)
      return matchesGroup && matchesQuery
    })
  }, [permissions, search, groupFilter])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search permissions…"
            className="pl-9"
            aria-label="Search permissions"
          />
        </div>
        <Select value={groupFilter} onValueChange={setGroupFilter}>
          <SelectTrigger className="w-44" aria-label="Filter by group">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All groups</SelectItem>
            {groups.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <div className="mb-1 text-sm font-semibold">Permission explorer</div>
        <p className="mb-4 text-xs text-muted-foreground">
          Use this page for transparency and debugging, not day-to-day user
          grants.
        </p>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((permission) => {
            const count = usedByCount.get(permission.name) ?? 0
            return (
              <Card key={permission.name}>
                <CardContent className="p-4">
                  <div className="font-semibold">{permission.name}</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {permission.description || 'No description'}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-[10px]">
                      {groupOf(permission.context)}
                    </Badge>
                    {permission.context.length > 0 ? (
                      permission.context.map((ctx) => (
                        <Badge
                          key={ctx}
                          variant="outline"
                          className="text-[10px] font-normal capitalize"
                        >
                          {ctx}
                        </Badge>
                      ))
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-normal"
                      >
                        global
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    Used by {count} {count === 1 ? 'role' : 'roles'}
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {visible.length === 0 && (
            <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
              No permissions match the current filters.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
