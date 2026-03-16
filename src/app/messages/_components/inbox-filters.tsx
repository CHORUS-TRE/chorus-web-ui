'use client'

import { Search } from 'lucide-react'

import { Button } from '~/components/button'
import { Input } from '~/components/ui/input'

export type InboxFilter = 'pending' | 'approved' | 'rejected' | 'unread'

const FILTER_OPTIONS: { id: InboxFilter; label: string }[] = [
  { id: 'unread', label: 'Unread' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' }
]

interface InboxFiltersProps {
  activeFilter: InboxFilter
  onFilterChange: (filter: InboxFilter) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  filterCounts?: {
    pending: number
    approved: number
    rejected: number
    unread: number
  }
}

export function InboxFilters({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  filterCounts
}: InboxFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => (
          <Button
            key={opt.id}
            variant="ghost"
            size="sm"
            className={`h-8 rounded-full border px-4 text-sm font-medium ${
              activeFilter === opt.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted/40 text-muted-foreground hover:border-muted-foreground/40'
            }`}
            onClick={() => onFilterChange(opt.id)}
          >
            {opt.label}
            {filterCounts && ` (${filterCounts[opt.id]})`}
          </Button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="rounded-lg pl-9"
        />
      </div>
    </div>
  )
}
