'use client'

import { Search } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { GrantAccessDialog } from '@/components/forms/grant-access-dialog'
import { toast } from '@/components/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { User } from '@/domain/model/user'
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

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users…"
            className="pl-9"
            aria-label="Search users"
          />
        </div>
      </div>

      {/* Master-detail */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <div className="text-sm font-semibold">Users</div>
              <div className="text-xs text-muted-foreground">
                Click a user to review effective access
              </div>
            </div>
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
              {total} total
            </span>
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
