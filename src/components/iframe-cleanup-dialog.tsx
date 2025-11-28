'use client'

import { formatDistanceToNow } from 'date-fns'
import { Globe, Monitor, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { CachedIframe } from '@/domain/model'
import { useIframeCache } from '@/providers/iframe-cache-provider'

import { Button } from './button'
import { Checkbox } from './ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog'
import { ScrollArea } from './ui/scroll-area'

/**
 * Dialog for managing cached iframes.
 * Allows users to selectively close sessions/webapps to free memory.
 */
export function IframeCleanupDialog() {
  const {
    cachedIframes,
    activeIframeId,
    closeIframe,
    clearAllCache,
    showCleanupDialog,
    setShowCleanupDialog
  } = useIframeCache()

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const iframeList = Array.from(cachedIframes.values()).sort(
    (a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime()
  )

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedIds.size === iframeList.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(iframeList.map((i) => i.id)))
    }
  }

  const handleCloseSelected = () => {
    selectedIds.forEach((id) => {
      closeIframe(id)
    })
    setSelectedIds(new Set())
  }

  const handleCloseAll = () => {
    clearAllCache()
    setSelectedIds(new Set())
    setShowCleanupDialog(false)
  }

  const getIframeIcon = (iframe: CachedIframe) => {
    if (iframe.type === 'session') {
      return <Monitor className="h-4 w-4 text-blue-500" />
    }
    return <Globe className="h-4 w-4 text-green-500" />
  }

  return (
    <Dialog open={showCleanupDialog} onOpenChange={setShowCleanupDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Open Sessions</DialogTitle>
          <DialogDescription>
            You have {iframeList.length} session(s) and web app(s) open. Close
            some to free memory.
          </DialogDescription>
        </DialogHeader>

        {iframeList.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No sessions or web apps open.
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b pb-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox
                  checked={selectedIds.size === iframeList.length}
                  onCheckedChange={handleSelectAll}
                />
                Select all
              </label>
              <span className="text-xs text-muted-foreground">
                {selectedIds.size} selected
              </span>
            </div>

            <ScrollArea className="max-h-[300px] pr-4">
              <div className="space-y-2">
                {iframeList.map((iframe) => (
                  <div
                    key={iframe.id}
                    className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                      activeIframeId === iframe.id
                        ? 'border-accent bg-accent/10'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <Checkbox
                      checked={selectedIds.has(iframe.id)}
                      onCheckedChange={() => handleToggleSelect(iframe.id)}
                    />

                    {getIframeIcon(iframe)}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium">
                          {iframe.name}
                        </span>
                        {activeIframeId === iframe.id && (
                          <span className="shrink-0 rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-accent-foreground">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {iframe.type === 'session' ? 'Session' : 'Web App'} •
                        Last accessed{' '}
                        {formatDistanceToNow(iframe.lastAccessed, {
                          addSuffix: true
                        })}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => closeIframe(iframe.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {iframeList.length > 0 && (
            <>
              <Button
                variant="outline"
                onClick={handleCloseAll}
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                Close All
              </Button>
              <Button
                onClick={handleCloseSelected}
                disabled={selectedIds.size === 0}
              >
                Close Selected ({selectedIds.size})
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
