'use client'

import { HardDrive, ShoppingBasket, Zap } from 'lucide-react'
import type React from 'react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { FileSystemItem } from '@/types/file-system'

/** Map raw mount/folder names to user-friendly display names and icons */
const STORE_DISPLAY: Record<
  string,
  { label: string; icon: React.ElementType; description: string }
> = {
  archive: {
    label: 'Permanent Storage',
    icon: HardDrive,
    description: 'Long-term data that persists across sessions'
  },
  scratch: {
    label: 'Working Files',
    icon: Zap,
    description: 'Temporary workspace for active analysis'
  }
}

function getStoreDisplay(name: string) {
  return (
    STORE_DISPLAY[name.toLowerCase()] ?? {
      label: name,
      icon: HardDrive,
      description: 'Storage mount'
    }
  )
}

interface StoreSidebarProps {
  stores: FileSystemItem[]
  selectedStoreId: string | null
  onSelectStore: (storeId: string) => void
  basketItemCount: number
  onShowBasket: () => void
  showTechnicalDetails?: boolean
}

export function StoreSidebar({
  stores,
  selectedStoreId,
  onSelectStore,
  basketItemCount,
  onShowBasket,
  showTechnicalDetails
}: StoreSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-muted/40 p-4">
        <div className="text-md font-medium text-muted-foreground">Stores</div>
      </div>

      <div className="flex-1 space-y-1 overflow-auto p-2">
        {stores.map((store) => {
          const display = getStoreDisplay(store.name)
          const Icon = display.icon
          const isSelected = selectedStoreId === store.id

          return (
            <button
              key={store.id}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/50',
                isSelected && 'bg-accent/10 text-accent'
              )}
              onClick={() => onSelectStore(store.id)}
            >
              <Icon
                className={cn(
                  'h-5 w-5 shrink-0',
                  isSelected ? 'text-accent' : 'text-muted-foreground'
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{display.label}</div>
                {showTechnicalDetails && (
                  <div className="truncate text-xs text-muted-foreground">
                    {store.path || store.name}
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Basket section */}
      <div className="border-t border-muted/40 p-2">
        <button
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/50'
          )}
          onClick={onShowBasket}
        >
          <ShoppingBasket className="h-5 w-5 shrink-0 text-muted-foreground" />
          <span className="font-medium">Basket</span>
          {basketItemCount > 0 && (
            <Badge className="ml-auto rounded-full px-2" variant="default">
              {basketItemCount}
            </Badge>
          )}
        </button>
      </div>
    </div>
  )
}
