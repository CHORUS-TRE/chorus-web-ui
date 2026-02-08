import { LayoutGrid, List, Search } from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import { WorkspaceWorkbenchList } from '@/components/workspace-workbench-list'
import { CATEGORIES, filterApps } from '@/config/app-store'
import { isSessionPath } from '@/lib/route-utils'
import { cn } from '@/lib/utils'
import { useAuthentication } from '@/providers/authentication-provider'
import { useIframeCache } from '@/providers/iframe-cache-provider'
import { useAppState } from '@/stores/app-state-store'
import { createAppInstance } from '@/view-model/app-instance-view-model'
import { Button } from '~/components/button'
import { toast } from '~/components/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { App, AppInstanceStatus, ExternalWebApp } from '~/domain/model'

import { SessionAppIcon } from './app-icon'
import { SessionAppListItem } from './app-list-item'

type ViewMode = 'icons' | 'list'

export function AppStoreView() {
  const [viewMode, setViewMode] = useState<ViewMode>('icons')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const {
    apps,
    refreshApps,
    refreshWorkbenches,
    refreshWorkspaces,
    refreshAppInstances
  } = useAppState()
  const { externalWebApps, background, openSession, openWebApp } =
    useIframeCache()
  const { user } = useAuthentication()
  const router = useRouter()
  const { workspaceId: paramWorkspaceId, sessionId: paramSessionId } =
    useParams()
  const [showStartSessionDialog, setShowStartSessionDialog] = useState(false)
  const [pendingApp, setPendingApp] = useState<App | null>(null)
  const pathname = usePathname()
  const isSessionPage = useMemo(() => isSessionPath(pathname), [pathname])

  // Handler to show session picker with the selected app
  const handleAppClickWithoutSession = (app: App) => {
    setPendingApp(app)
    setShowStartSessionDialog(true)
  }

  // Handler when a session is selected from the dialog
  const handleSessionSelected = (sessionId: string, workspaceId: string) => {
    if (pendingApp) {
      handleLaunchApp(pendingApp, sessionId, workspaceId)
    }
    setShowStartSessionDialog(false)
    setPendingApp(null)
  }

  // Helper to handle app launch (unified for all view modes)
  const handleLaunchApp = async (
    app: App,
    sessionId = paramSessionId || background?.sessionId,
    workspaceId = paramWorkspaceId || background?.workspaceId
  ) => {
    if (!sessionId || !workspaceId) return

    const formData = new FormData()
    formData.append('appId', app.id)
    formData.append('tenantId', '1')
    formData.append('userId', user?.id || '')
    formData.append('workspaceId', workspaceId as string)
    formData.append('workbenchId', sessionId as string)
    formData.append('status', AppInstanceStatus.ACTIVE)

    try {
      const result = await createAppInstance({}, formData)
      if (result.error) throw new Error(result.error)

      openSession(sessionId as string, workspaceId as string)
      router.push(`/workspaces/${workspaceId}/sessions/${sessionId}`)

      refreshAppInstances()
      refreshWorkbenches()
      refreshWorkspaces()
    } catch (error) {
      toast({
        title: 'Error launching app',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive'
      })
    }
  }

  // Filter items (apps and webapps) based on category and search query
  const filteredItems = useMemo(() => {
    // 1. Get filtered internal apps
    const internalApps = filterApps(apps, selectedCategory, searchQuery)

    // 2. Get filtered web apps
    let webApps = externalWebApps || []
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      webApps = webApps.filter(
        (webapp) =>
          webapp.name?.toLowerCase().includes(query) ||
          webapp.description?.toLowerCase().includes(query)
      )
    }

    // 3. Combine based on category
    if (selectedCategory === 'all') {
      return [...internalApps, ...webApps]
    }
    if (selectedCategory === 'webapps') {
      return webApps
    }
    return internalApps
  }, [apps, externalWebApps, selectedCategory, searchQuery])

  return (
    <div className="flex h-full w-full flex-row gap-4 overflow-hidden">
      {/* Category Sidebar */}
      <aside className="flex w-40 flex-shrink-0 flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h3 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Applications
          </h3>
          {CATEGORIES.filter((c) => c.id !== 'chuv' && c.id !== 'webapps').map(
            (cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
                  selectedCategory === cat.id
                    ? 'bg-primary/20 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/10 hover:text-foreground'
                )}
              >
                {cat.icon}
                {cat.label}
              </button>
            )
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            Services
          </h3>
          {CATEGORIES.filter((c) => c.id === 'chuv' || c.id === 'webapps').map(
            (cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
                  selectedCategory === cat.id
                    ? 'bg-primary/20 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/10 hover:text-foreground'
                )}
              >
                {cat.icon}
                {cat.label}
              </button>
            )
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header with Search and View Toggles */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-xl border-muted/20 bg-muted/10 pl-10 focus:ring-primary/30"
            />
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-muted/10 bg-muted/10 p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('icons')}
              className={cn(
                'h-8 w-8 rounded-lg text-muted-foreground',
                viewMode === 'icons' && 'bg-background text-accent shadow-sm'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('list')}
              className={cn(
                'h-8 w-8 rounded-lg text-muted-foreground',
                viewMode === 'list' && 'bg-background text-accent shadow-sm'
              )}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="custom-scrollbar pointer-events-auto mt-0 flex-1 overflow-auto pr-2 pt-2">
          {filteredItems.length > 0 ? (
            <div
              className={cn(
                'grid pb-8',
                viewMode === 'icons'
                  ? 'grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-8'
                  : 'grid-cols-1 gap-2'
              )}
            >
              {filteredItems.map((item) => {
                // Determine if this is an external web app or internal app
                // Web apps are distinguished by having a 'url' property instead of 'dockerImageName'
                const isWebApp = 'url' in item
                const action = () =>
                  isWebApp
                    ? openWebApp(item.id)
                    : isSessionPage
                      ? handleLaunchApp(item as App)
                      : handleAppClickWithoutSession(item as App)

                return viewMode === 'icons' ? (
                  <SessionAppIcon
                    key={item.id}
                    app={item as App | ExternalWebApp}
                    onClick={action}
                    onLaunch={action}
                  />
                ) : (
                  <SessionAppListItem
                    key={item.id}
                    app={item as App | ExternalWebApp}
                    onLaunch={action}
                  />
                )
              })}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/10">
                <Search className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <h4 className="mb-1 text-lg font-semibold">No items found</h4>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or selection.
              </p>
            </div>
          )}
        </div>
      </div>
      <Dialog
        open={showStartSessionDialog}
        onOpenChange={setShowStartSessionDialog}
      >
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle className="">
              Choose a session to start the app
            </DialogTitle>
          </DialogHeader>
          <WorkspaceWorkbenchList
            action={({ id, workspaceId }) => {
              handleSessionSelected(id, workspaceId)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
