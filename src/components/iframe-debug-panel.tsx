'use client'

import { formatDistanceToNow } from 'date-fns'
import { Bug, ChevronDown, ChevronUp, Globe, Monitor, X } from 'lucide-react'
import { useState } from 'react'

import { useIframeCache } from '@/providers/iframe-cache-provider'

import { Button } from './button'

/**
 * Debug panel to visualize the iframe cache state.
 * Shows all cached iframes, their visibility status, and allows inspection.
 * Only visible in development mode.
 */
export function IframeDebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const {
    cachedIframes,
    activeIframeId,
    externalWebApps,
    closeIframe,
    setShowCleanupDialog
  } = useIframeCache()

  const iframeList = Array.from(cachedIframes.values())

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[9999] h-10 w-10 rounded-full bg-purple-600 p-0 shadow-lg hover:bg-purple-700"
        title="Open Iframe Debug Panel"
      >
        <Bug className="h-5 w-5" />
        {iframeList.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
            {iframeList.length}
          </span>
        )}
      </Button>
    )
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-[9999] w-80 rounded-lg border border-purple-500/50 bg-black/95 shadow-2xl backdrop-blur-sm transition-all ${
        isMinimized ? 'h-auto' : 'max-h-[80vh]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-purple-500/30 p-3">
        <div className="flex items-center gap-2">
          <Bug className="h-4 w-4 text-purple-400" />
          <span className="font-mono text-sm font-semibold text-purple-300">
            Iframe Cache Debug
          </span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-white"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 border-b border-purple-500/30 p-3">
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-purple-400">
                {iframeList.length}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500">
                Cached
              </div>
            </div>
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-green-400">
                {activeIframeId ? 1 : 0}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500">
                Visible
              </div>
            </div>
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-blue-400">
                {externalWebApps.length}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-gray-500">
                Services
              </div>
            </div>
          </div>

          {/* Active iframe */}
          <div className="border-b border-purple-500/30 p-3">
            <div className="mb-1 text-[10px] uppercase tracking-wider text-gray-500">
              Active Iframe
            </div>
            {activeIframeId ? (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <code className="text-xs text-green-400">{activeIframeId}</code>
              </div>
            ) : (
              <div className="text-xs text-gray-500">None (all hidden)</div>
            )}
          </div>

          {/* Iframe list */}
          <div className="max-h-60 overflow-auto p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-wider text-gray-500">
                Cached Iframes
              </div>
              {iframeList.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 px-2 text-[10px] text-gray-400 hover:text-white"
                  onClick={() => setShowCleanupDialog(true)}
                >
                  Manage
                </Button>
              )}
            </div>

            {iframeList.length === 0 ? (
              <div className="rounded border border-dashed border-gray-700 p-4 text-center text-xs text-gray-500">
                No iframes cached
              </div>
            ) : (
              <div className="space-y-2">
                {iframeList.map((iframe) => {
                  const isActive = activeIframeId === iframe.id
                  const domElement = document.getElementById(
                    `iframe-${iframe.id}`
                  )

                  return (
                    <div
                      key={iframe.id}
                      className={`rounded border p-2 ${
                        isActive
                          ? 'border-green-500/50 bg-green-500/10'
                          : 'border-gray-700 bg-gray-900/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {iframe.type === 'session' ? (
                            <Monitor className="h-3 w-3 text-blue-400" />
                          ) : (
                            <Globe className="h-3 w-3 text-green-400" />
                          )}
                          <span className="text-xs font-medium text-white">
                            {iframe.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {isActive && (
                            <span className="rounded bg-green-500 px-1.5 py-0.5 text-[8px] font-bold text-black">
                              VISIBLE
                            </span>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 text-gray-500 hover:text-red-400"
                            onClick={() => closeIframe(iframe.id)}
                            title="Close this iframe"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-1 space-y-0.5">
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-gray-500">ID:</span>
                          <code className="text-purple-400">{iframe.id}</code>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-gray-500">Type:</span>
                          <span className="text-gray-300">{iframe.type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-gray-500">In DOM:</span>
                          <span
                            className={
                              domElement ? 'text-green-400' : 'text-red-400'
                            }
                          >
                            {domElement ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-gray-500">Last access:</span>
                          <span className="text-gray-300">
                            {formatDistanceToNow(iframe.lastAccessed, {
                              addSuffix: true
                            })}
                          </span>
                        </div>
                        <div className="truncate text-[10px] text-gray-500">
                          {iframe.url}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* DOM Check button */}
          <div className="border-t border-purple-500/30 p-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-purple-500/50 text-xs text-purple-300 hover:bg-purple-500/20"
              onClick={() => {
                const iframes = document.querySelectorAll(
                  'iframe[id^="iframe-"]'
                )
                console.group('🔍 Iframe DOM Check')
                console.log(`Found ${iframes.length} iframes in DOM`)
                iframes.forEach((f) => {
                  const iframe = f as HTMLIFrameElement
                  console.log({
                    id: iframe.id,
                    src: iframe.src,
                    visibility: iframe.style.visibility,
                    pointerEvents: iframe.style.pointerEvents,
                    zIndex: iframe.style.zIndex,
                    inDocument: document.body.contains(iframe)
                  })
                })
                console.groupEnd()
                alert(
                  `Found ${iframes.length} iframes in DOM. Check console for details.`
                )
              }}
            >
              <Bug className="mr-2 h-3 w-3" />
              Log DOM State to Console
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
