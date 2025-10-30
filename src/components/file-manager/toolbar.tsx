'use client'

import { LayoutGrid, List, Plus, Search, Upload } from 'lucide-react'

import { Button } from '~/components/button'
import { Input } from '~/components/ui/input'

interface ToolbarProps {
  viewMode: 'list' | 'grid'
  searchQuery: string
  onToggleViewMode: () => void
  onCreateFolder: () => void
  onImport: () => void
  onSearch: (query: string) => void
}

export function Toolbar({
  viewMode,
  searchQuery,
  onToggleViewMode,
  onCreateFolder,
  onImport,
  onSearch
}: ToolbarProps) {
  return (
    <div className="flex items-center justify-between border-muted/40 pb-4">
      <div className="flex items-center gap-3">
        <Button onClick={onCreateFolder} variant="accent-filled">
          <Plus className="h-4 w-4" />
          New folder
        </Button>
        <Button onClick={onImport} variant="accent-filled">
          <Upload className="h-4 w-4" />
          Import
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative mr-2 hidden flex-1 xl:block">
          <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted" />
          <Input
            type="search"
            placeholder="Search in data"
            className="h-7 w-full border border-muted/40 bg-background pl-10 md:w-[240px] lg:w-[240px]"
            id="search-input"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-flow-col grid-rows-1 gap-4">
          <div className="flex items-center justify-end gap-0">
            <Button
              variant="ghost"
              className={`${viewMode === 'grid' ? 'border border-accent' : ''}`}
              onClick={onToggleViewMode}
              id="grid-button"
              aria-label="Switch to grid view"
            >
              <LayoutGrid />
            </Button>
            <Button
              variant="ghost"
              className={`${viewMode === 'list' ? 'border border-accent' : ''}`}
              onClick={onToggleViewMode}
              id="list-button"
              aria-label="Switch to list view"
            >
              <List />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
