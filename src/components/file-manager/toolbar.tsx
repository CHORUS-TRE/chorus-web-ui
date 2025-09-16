'use client'

import { LayoutGrid, List, Plus, Search, Settings, Upload } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

interface ToolbarProps {
  viewMode: 'list' | 'grid'
  onToggleViewMode: () => void
  onCreateFolder: () => void
}

export function Toolbar({
  viewMode,
  onToggleViewMode,
  onCreateFolder
}: ToolbarProps) {
  return (
    <div className="flex items-center justify-between border-b bg-background p-4">
      <div className="flex items-center gap-2">
        <Button onClick={onCreateFolder} size="sm" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          New folder
        </Button>
        <Button variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input placeholder="Search in data" className="w-64 pl-10" />
        </div>

        <div className="flex items-center rounded-md border">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={onToggleViewMode}
            className="rounded-r-none "
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={onToggleViewMode}
            className="rounded-l-none"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
