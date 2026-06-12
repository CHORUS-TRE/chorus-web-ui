'use client'

import { Lock, Search } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { GrantAccessDialog } from '@/components/forms/grant-access-dialog'
import { toast } from '@/components/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User } from '@/domain/model/user'
import { cn } from '@/lib/utils'
import { useAuthorization } from '@/providers/authorization-provider'
import { listUsers, listUsersPaginated } from '@/view-model/user-view-model'

import { UserAccessDetail } from './user-access-detail'
import { UsersMasterTable } from './users-master-table'
import { UsersStatsRow } from './users-stats-row'

const DEFAULT_PAGE_SIZE = 10

export default function UsersPage() {
  const { can } = useAuthorization()

  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)

  const [selectedUserId, setSelectedUserId] = useState<string | undefined>()
  const [hasSensitiveOnly, setHasSensitiveOnly] = useState(false)

  const [grantOpen, setGrantOpen] = useState(false)
  const [grantUserId, setGrantUserId] = useState<string | undefined>()
  // Full user list for the grant dialog — loaded lazily on first open.
  const [allUsers, setAllUsers] = useState<User[]>([])
  const allUsersLoadedRef = useRef(false)

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), [])

  // Debounce search and reset to page 0.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(0)
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  // Paginated table load.
  useEffect(() => {
    let ignored = false
    async function load() {
      const result = await listUsersPaginated({
        offset: page * pageSize,
        limit: pageSize,
        search: debouncedSearch || undefined
      })
      if (ignored) return
      if (result.data) {
        setUsers(result.data.users)
        setTotal(result.data.total)
        setError(null)
        // Auto-select first row when the page changes.
        setSelectedUserId((prev) => {
          const ids = result.data!.users.map((u) => u.id)
          return ids.includes(prev ?? '') ? prev : ids[0]
        })
      } else {
        setError(result.error || 'Failed to load users.')
        toast({
          title: 'Error',
          description: result.error || 'Failed to load users.',
          variant: 'destructive'
        })
      }
    }
    if (can('listUsers', { user: '*' })) load()
    return () => {
      ignored = true
    }
  }, [page, pageSize, debouncedSearch, refreshKey, can])

  const selectedUser = users.find((u) => u.id === selectedUserId)

  const openGrant = useCallback(async (userId: string) => {
    if (!allUsersLoadedRef.current) {
      const result = await listUsers()
      if (result.data) {
        setAllUsers(result.data)
        allUsersLoadedRef.current = true
      }
    }
    setGrantUserId(userId)
    setGrantOpen(true)
  }, [])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPage(0)
  }, [])

  if (error) {
    return (
      <div className="mt-2 text-sm text-muted-foreground">
        An error occurred while listing platform users. Verify you have the
        necessary permissions to view this content.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <UsersStatsRow totalUsers={total} />

      {/* Master-detail */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="overflow-hidden rounded-[14px] border bg-card dark:border-white/[.08] dark:bg-white/[.018]">
          <div className="flex items-center gap-3 border-b px-4 py-3 dark:border-white/[.08]">
            <span className="text-sm font-semibold">Users</span>
            <span className="text-xs text-muted-foreground">
              {users.length} of {total}
            </span>
            <div className="flex-1" />
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="h-8 w-40 pl-7 text-xs"
                aria-label="Search users"
              />
            </div>
            {/* <Button
              variant="outline"
              size="sm"
              className={cn(
                'h-8 gap-1.5 text-xs',
                hasSensitiveOnly &&
                  'border-amber-500/60 bg-amber-500/10 text-amber-500'
              )}
              onClick={() => setHasSensitiveOnly((v) => !v)}
            >
              <Lock className="h-3 w-3" />
              Has sensitive
            </Button> */}
          </div>
          <UsersMasterTable
            users={users}
            selectedUserId={selectedUserId}
            onSelect={setSelectedUserId}
            total={total}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            hasSensitiveOnly={hasSensitiveOnly}
          />
        </div>

        <UserAccessDetail
          user={selectedUser}
          onChanged={refresh}
          onGrantClick={openGrant}
        />
      </div>

      <GrantAccessDialog
        users={allUsers.length > 0 ? allUsers : users}
        open={grantOpen}
        onOpenChange={setGrantOpen}
        defaultUserId={grantUserId}
        onGranted={() => {
          setGrantOpen(false)
          refresh()
        }}
      />
    </div>
  )
}
