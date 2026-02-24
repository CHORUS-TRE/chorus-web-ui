'use client'

import { Filter, RotateCcw, ScrollText, Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import AuditTable from '@/components/audit-table'
import { AuditEntry, AuditListPlatformParams } from '@/domain/model'
import { Button } from '~/components/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { listPlatform } from '~/view-model/audit-view-model'

// ─── Filter form state ────────────────────────────────────────────────────────

interface FilterState {
  filterUserId: string
  filterWorkspaceId: string
  filterWorkbenchId: string
  filterAction: string
  filterFromTime: string // ISO date string from <input type="date">
  filterToTime: string
}

const EMPTY_FILTERS: FilterState = {
  filterUserId: '',
  filterWorkspaceId: '',
  filterWorkbenchId: '',
  filterAction: '',
  filterFromTime: '',
  filterToTime: ''
}

function toParams(f: FilterState): AuditListPlatformParams {
  return {
    ...(f.filterUserId && { filterUserId: f.filterUserId }),
    ...(f.filterWorkspaceId && { filterWorkspaceId: f.filterWorkspaceId }),
    ...(f.filterWorkbenchId && { filterWorkbenchId: f.filterWorkbenchId }),
    ...(f.filterAction && { filterAction: f.filterAction }),
    ...(f.filterFromTime && { filterFromTime: new Date(f.filterFromTime) }),
    ...(f.filterToTime && {
      filterToTime: new Date(f.filterToTime + 'T23:59:59')
    })
  }
}

function hasActiveFilters(f: FilterState): boolean {
  return Object.values(f).some((v) => v !== '')
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminAuditPage() {
  const [entries, setEntries] = useState<AuditEntry[] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [draft, setDraft] = useState<FilterState>(EMPTY_FILTERS)
  const [applied, setApplied] = useState<FilterState>(EMPTY_FILTERS)

  const loadAudit = useCallback(async (filters: FilterState) => {
    setIsLoading(true)
    const result = await listPlatform(toParams(filters))
    if (result.data) {
      setEntries(result.data)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadAudit(EMPTY_FILTERS)
  }, [loadAudit])

  const handleApply = () => {
    setApplied(draft)
    loadAudit(draft)
  }

  const handleReset = () => {
    setDraft(EMPTY_FILTERS)
    setApplied(EMPTY_FILTERS)
    loadAudit(EMPTY_FILTERS)
  }

  const field = (
    id: keyof FilterState,
    label: string,
    placeholder: string,
    type: string = 'text'
  ) => (
    <div className="flex flex-col gap-1">
      <Label
        htmlFor={id}
        className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={draft[id]}
        onChange={(e) =>
          setDraft((prev) => ({ ...prev, [id]: e.target.value }))
        }
        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        className="h-8 text-xs"
      />
    </div>
  )

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
              <ScrollText className="h-9 w-9" />
              Platform Audit
            </h2>
            <p className="text-sm text-muted-foreground">
              View platform-wide audit log entries.
            </p>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <div className="mb-4 rounded-xl border border-muted/20 bg-muted/5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Filters
          </span>
          {hasActiveFilters(applied) && (
            <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
              active
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {field('filterUserId', 'User ID', 'user-abc123')}
          {field('filterWorkspaceId', 'Workspace ID', 'ws-abc123')}
          {field('filterWorkbenchId', 'Workbench ID', 'wb-abc123')}
          {field('filterAction', 'Action', 'e.g. CREATE_WORKSPACE')}
          {field('filterFromTime', 'From', '', 'date')}
          {field('filterToTime', 'To', '', 'date')}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Button
            size="sm"
            className="h-8 gap-1.5 rounded-lg px-3 text-xs"
            onClick={handleApply}
            disabled={isLoading}
          >
            <Search className="h-3 w-3" />
            Apply
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 rounded-lg px-3 text-xs text-muted-foreground"
            onClick={handleReset}
            disabled={isLoading || !hasActiveFilters(draft)}
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        </div>
      </div>

      <div className="mt-2 w-full">
        <AuditTable
          entries={entries}
          title="Platform Audit Log"
          description={
            hasActiveFilters(applied)
              ? 'Showing filtered audit entries.'
              : 'All audit entries across the platform.'
          }
        />
      </div>
    </>
  )
}
