'use client'

import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'

interface InboxFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function InboxFilters({
  searchQuery,
  onSearchChange
}: InboxFiltersProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search messages..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="rounded-lg pl-9"
      />
    </div>
  )
}
