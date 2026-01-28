'use client'

import { CirclePlus, Globe, Search, Settings, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { useAuthorization } from '@/providers/authorization-provider'
import { useIframeCache } from '@/providers/iframe-cache-provider'
import { useAppState } from '@/stores/app-state-store'
import { AppCard } from '~/components/app-card'
import { Button } from '~/components/button'
import { AppCreateDialog } from '~/components/forms/app-create-dialog'
import { WebAppCreateDialog } from '~/components/forms/webapp-create-dialog'
import { Input } from '~/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { WebAppCard } from '~/components/webapp-card'

export function AppStoreView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showWebAppDialog, setShowWebAppDialog] = useState(false)
  const [activeTab, setActiveTab] = useState(
    tabFromUrl === 'webapps' ? 'webapps' : 'my-apps'
  )
  const [searchQuery, setSearchQuery] = useState('')
  const { apps, refreshApps } = useAppState()
  const { externalWebApps } = useIframeCache()
  const { can, PERMISSIONS } = useAuthorization()

  // Filter apps based on search query
  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return apps
    const query = searchQuery.toLowerCase()
    return apps?.filter(
      (app) =>
        app.name?.toLowerCase().includes(query) ||
        app.description?.toLowerCase().includes(query)
    )
  }, [apps, searchQuery])

  // Filter webapps based on search query
  const filteredWebApps = useMemo(() => {
    if (!searchQuery.trim()) return externalWebApps
    const query = searchQuery.toLowerCase()
    return externalWebApps.filter(
      (webapp) =>
        webapp.name?.toLowerCase().includes(query) ||
        webapp.description?.toLowerCase().includes(query) ||
        webapp.url?.toLowerCase().includes(query)
    )
  }, [externalWebApps, searchQuery])

  // Sync tab state with URL when URL changes
  useEffect(() => {
    const newTab = tabFromUrl === 'webapps' ? 'webapps' : 'my-apps'
    if (newTab !== activeTab) {
      setActiveTab(newTab)
    }
  }, [tabFromUrl, activeTab])

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === 'webapps') {
      router.push('/app-store?tab=webapps')
    } else {
      router.push('/app-store')
    }
  }

  return (
    <>
      <div className="w-full">
        <div className="flex flex-col gap-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search applications and services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <div className="mb-8 flex items-center justify-between">
                <TabsList className="bg-background">
                  <TabsTrigger
                    value="my-apps"
                    className="text-foreground data-[state=active]:text-primary data-[state=active]:underline data-[state=active]:decoration-2 data-[state=active]:underline-offset-4"
                  >
                    Applications
                    {filteredApps && filteredApps.length > 0 && (
                      <span className="ml-1 rounded-full text-muted-foreground">
                        ({filteredApps.length})
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="webapps"
                    className="text-foreground data-[state=active]:text-primary data-[state=active]:underline data-[state=active]:decoration-2 data-[state=active]:underline-offset-4"
                  >
                    Services
                    {filteredWebApps.length > 0 && (
                      <span className="ml-1 rounded-full text-muted-foreground">
                        ({filteredWebApps.length})
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>

                {activeTab === 'webapps'
                  ? can(PERMISSIONS.listApps) && (
                      <Button onClick={() => setShowWebAppDialog(true)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Manage Services
                      </Button>
                    )
                  : can(PERMISSIONS.createApp) && (
                      <Button onClick={() => setShowCreateDialog(true)}>
                        <CirclePlus className="mr-2 h-4 w-4" />
                        Add New App
                      </Button>
                    )}
              </div>

              <TabsContent value="my-apps" className="mt-0">
                {filteredApps && filteredApps.length > 0 ? (
                  <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,250px))]">
                    {filteredApps.map((app) => (
                      <AppCard key={app.id} app={app} onUpdate={refreshApps} />
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-lg text-muted-foreground">
                      No applications match &quot;{searchQuery}&quot;
                    </p>
                    <Button
                      onClick={() => setSearchQuery('')}
                      variant="outline"
                      className="mt-4"
                    >
                      Clear search
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <p className="text-lg text-muted-foreground">
                      No app available.
                    </p>
                    {can(PERMISSIONS.createApp) && (
                      <Button
                        onClick={() => setShowCreateDialog(true)}
                        variant="outline"
                        className="mt-4"
                      >
                        <CirclePlus className="mr-2 h-4 w-4" />
                        Add your first app
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="webapps" className="mt-0">
                {filteredWebApps.length > 0 ? (
                  <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,250px))]">
                    {filteredWebApps.map((webapp) => (
                      <WebAppCard key={webapp.id} webapp={webapp} />
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-lg text-muted">
                      No services match &quot;{searchQuery}&quot;
                    </p>
                    <Button
                      onClick={() => setSearchQuery('')}
                      variant="outline"
                      className="mt-4"
                    >
                      Clear search
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Globe className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-lg text-muted-foreground">
                      No services configured.
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Add external web applications to access them from here.
                    </p>
                    {can(PERMISSIONS.createApp) && (
                      <Button
                        onClick={() => setShowWebAppDialog(true)}
                        variant="outline"
                        className="mt-4"
                      >
                        <CirclePlus className="mr-2 h-4 w-4" />
                        Add your first web app
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {showCreateDialog && (
        <AppCreateDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSuccess={refreshApps}
        />
      )}

      <WebAppCreateDialog
        open={showWebAppDialog}
        onOpenChange={setShowWebAppDialog}
      />
    </>
  )
}
