'use client'

import { LayoutGrid, List, Plus, Search, Settings, Upload } from 'lucide-react'

import { Button } from '~/components/button'
import { Button as UIButton } from '~/components/ui/button'
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
    <div className="flex items-center justify-between border-muted/40 p-4">
      <div className="flex items-center gap-3">
        <Button
          onClick={onCreateFolder}
          className="bg-transparent text-accent ring-1 ring-accent hover:bg-accent-background hover:text-black focus:bg-accent-background"
        >
          <Plus className="h-4 w-4" />
          New folder
        </Button>
        <Button
          onClick={onImport}
          className="bg-transparent text-accent ring-1 ring-accent hover:bg-accent-background hover:text-black focus:bg-accent-background"
        >
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
            <UIButton
              variant="ghost"
              size="sm"
              className={`border border-transparent text-muted hover:bg-inherit hover:text-accent ${viewMode === 'grid' ? 'border-accent' : ''}`}
              onClick={onToggleViewMode}
              id="grid-button"
              aria-label="Switch to grid view"
            >
              <LayoutGrid />
            </UIButton>
            <UIButton
              variant="ghost"
              size="sm"
              className={`border border-transparent text-muted hover:bg-inherit hover:text-accent ${viewMode === 'list' ? 'border-accent' : ''}`}
              onClick={onToggleViewMode}
              id="list-button"
              aria-label="Switch to list view"
            >
              <List />
            </UIButton>
          </div>
        </div>
      </div>
    </div>
  )
}
