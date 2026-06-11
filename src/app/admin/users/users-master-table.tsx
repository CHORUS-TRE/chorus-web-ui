'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { User } from '@/domain/model/user'
import { cn } from '@/lib/utils'
import { useRoles } from '@/providers/roles-provider'

import { getInitials, grantScopeSummary } from './access-utils'

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

interface UsersMasterTableProps {
  users: User[]
  selectedUserId?: string
  onSelect: (userId: string) => void
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function UsersMasterTable({
  users,
  selectedUserId,
  onSelect,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange
}: UsersMasterTableProps) {
  const { rolesByName, availableScopes } = useRoles()

  const from = total === 0 ? 0 : page * pageSize + 1
  const to = Math.min((page + 1) * pageSize, total)
  const pageCount = Math.ceil(total / pageSize)

  return (
    <div>
      <div className="overflow-auto">
        <Table aria-label={`User list, page ${page + 1}`}>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4 text-muted-foreground">User</TableHead>
              <TableHead className="text-muted-foreground">Source</TableHead>
              <TableHead className="hidden text-muted-foreground 2xl:table-cell">Status</TableHead>
              <TableHead className="text-muted-foreground">Grants</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const summary = grantScopeSummary(
                user,
                rolesByName,
                availableScopes
              )
              const grantCount = user.rolesWithContext?.length ?? 0
              const isSelected = user.id === selectedUserId

              return (
                <TableRow
                  key={user.id}
                  onClick={() => onSelect(user.id)}
                  aria-selected={isSelected}
                  className={cn('cursor-pointer', isSelected && 'bg-accent/10')}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-accent/15 text-xs font-semibold text-accent">
                          {getInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="truncate font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.source || '—'}</Badge>
                  </TableCell>
                  <TableCell className="hidden 2xl:table-cell">
                    <Badge
                      variant={
                        user.status === 'active' ? 'default' : 'destructive'
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-1">
                      <Badge className="bg-accent/15 text-accent hover:bg-accent/20">
                        {grantCount}
                      </Badge>
                      {summary.map(({ scope, count }) => (
                        <Badge
                          key={scope}
                          variant="outline"
                          className="text-[10px] font-normal capitalize text-muted-foreground"
                        >
                          {scope}: {count}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
            {users.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-muted-foreground"
                >
                  No users match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination footer */}
      <div className="flex items-center justify-between border-t px-4 py-2">
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
