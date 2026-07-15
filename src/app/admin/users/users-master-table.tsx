'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { User } from '@/domain/model/user'
import { useRoles } from '@/providers/roles-provider'

import {
  effectivePermissionNames,
  getInitials,
  grantScopeSummary,
  SENSITIVE_PERMISSION_RE
} from './access-utils'

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

const SCOPE_DOTS: Record<string, string> = {
  platform: '#477AFF',
  workspace: '#ABA5F5',
  workbench: '#66EFFF'
}

function ScopeBar({
  summary
}: {
  summary: { scope: string; count: number }[]
}) {
  const total = summary.reduce((n, s) => n + s.count, 0) || 1
  return (
    <div
      className="flex h-[5px] w-[104px] overflow-hidden rounded-full"
      style={{ background: '#2A2A2A' }}
    >
      {summary.map(({ scope, count }) => (
        <div
          key={scope}
          title={`${scope}: ${count}`}
          style={{
            width: `${(count / total) * 100}%`,
            background: SCOPE_DOTS[scope] ?? '#888',
            opacity: 0.85
          }}
        />
      ))}
    </div>
  )
}

interface UsersMasterTableProps {
  users: User[]
  selectedUserId?: string
  onSelect: (userId: string) => void
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  hasSensitiveOnly?: boolean
}

export function UsersMasterTable({
  users,
  selectedUserId,
  onSelect,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  hasSensitiveOnly = false
}: UsersMasterTableProps) {
  const { rolesByName, availableScopes } = useRoles()

  const from = total === 0 ? 0 : page * pageSize + 1
  const to = Math.min((page + 1) * pageSize, total)
  const pageCount = Math.ceil(total / pageSize)

  const visibleUsers = hasSensitiveOnly
    ? users.filter((u) =>
        effectivePermissionNames(u, rolesByName).some((p) =>
          SENSITIVE_PERMISSION_RE.test(p)
        )
      )
    : users

  return (
    <div>
      {/* User rows */}
      <div>
        {visibleUsers.map((user) => {
          const summary = grantScopeSummary(user, rolesByName, availableScopes)
          const grantCount = user.rolesWithContext?.length ?? 0
          const isSelected = user.id === selectedUserId

          return (
            <div
              key={user.id}
              onClick={() => onSelect(user.id)}
              className="relative flex cursor-pointer items-center gap-3 border-b border-white/5 px-4 py-[13px] last:border-0 hover:bg-white/[.035]"
              style={{
                background: isSelected ? 'rgba(71,122,255,.10)' : undefined
              }}
            >
              {/* Selected accent bar */}
              {isSelected && (
                <div
                  className="absolute bottom-2 left-0 top-2 w-[3px] rounded-full"
                  style={{ background: '#BCFF47' }}
                />
              )}

              {/* Avatar */}
              <div
                className="inline-flex shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                style={{
                  width: 34,
                  height: 34,
                  background: isSelected ? '#477AFF' : '#3A3A3A',
                  color: isSelected ? '#fff' : '#D8D8D8',
                  border: `1px solid ${isSelected ? '#6B93FF' : '#4A4A4A'}`
                }}
              >
                {getInitials(user)}
              </div>

              {/* Name + handle */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-foreground-muted truncate"
                    style={{
                      fontSize: 13.5,
                      fontWeight: 500
                    }}
                    title={`id: ${user.id}`}
                  >
                    {user.firstName} {user.lastName}
                  </span>
                  {user.status !== 'active' && (
                    <span
                      className="shrink-0 uppercase"
                      style={{
                        fontSize: 9.5,
                        fontWeight: 600,
                        letterSpacing: '.06em',
                        color: '#8A8A8A'
                      }}
                    >
                      inactive
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: '#7E7E7E',
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                >
                  @{user.username}
                </div>
              </div>

              {/* Source badge */}
              <span className="rounded-full border bg-muted/50 px-2 py-0.5 font-mono text-[10px]">
                {user.source}
              </span>

              {/* Grant count + scope bar */}
              <div
                className="shrink-0"
                style={{
                  width: 116,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  alignItems: 'flex-end'
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: '#C8C8C8',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <b style={{ color: '#7E7E7E', fontWeight: 600 }}>
                    {grantCount}
                  </b>{' '}
                  <span style={{ color: '#7E7E7E' }}>grants</span>
                </div>
                {/* {grantCount > 0 && <ScopeBar summary={summary} />} */}
              </div>
            </div>
          )
        })}

        {visibleUsers.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No users match the current filters.
          </div>
        )}
      </div>

      {/* Pagination footer */}
      <div className="flex items-center justify-between border-t border-white/5 px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Rows</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => onPageSizeChange(Number(v))}
          >
            <SelectTrigger className="h-7 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)} className="text-xs">
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            {from}–{to} of {total}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={page === 0}
              onClick={() => onPageChange(page - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={page >= pageCount - 1}
              onClick={() => onPageChange(page + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
