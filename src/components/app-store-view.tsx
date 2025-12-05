'use client'

import { CirclePlus, Globe, Settings } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useAppState } from '@/providers/app-state-provider'
import { useIframeCache } from '@/providers/iframe-cache-provider'
import { AppCard } from '~/components/app-card'
import { Button } from '~/components/button'
import { AppCreateDialog } from '~/components/forms/app-create-dialog'
import { WebAppCreateDialog } from '~/components/forms/webapp-create-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { WebAppCard } from '~/components/webapp-card'
import { useAuthorizationViewModel } from '~/view-model/authorization-view-model'

export function AppStoreView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabFromUrl = searchParams.get('tab')

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showWebAppDialog, setShowWebAppDialog] = useState(false)
  const [activeTab, setActiveTab] = useState(
    tabFromUrl === 'webapps' ? 'webapps' : 'my-apps'
  )
  const { apps, refreshApps } = useAppState()
  const { externalWebApps } = useIframeCache()
  const { canManageSettings, canManageAppStore } = useAuthorizationViewModel()

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
        <div className="flex flex-col gap-8">
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
                    className="data-[state=active]:text-primary-foreground"
                  >
                    Applications
                    {apps && apps.length > 0 && (
                      <span className="ml-1 rounded-full">({apps.length})</span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="webapps"
                    className="data-[state=active]:text-primary-foreground"
                  >
                    Services
                    {externalWebApps.length > 0 && (
                      <span className="ml-1 rounded-full">
                        ({externalWebApps.length})
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>

                {activeTab === 'webapps'
                  ? canManageSettings && (
                      <Button onClick={() => setShowWebAppDialog(true)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Manage Services
                      </Button>
                    )
                  : canManageAppStore && (
                      <Button onClick={() => setShowCreateDialog(true)}>
                        <CirclePlus className="mr-2 h-4 w-4" />
                        Add New App
                      </Button>
                    )}
              </div>

              <TabsContent value="my-apps" className="mt-0">
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,250px))]">
                  {apps?.map((app) => (
                    <AppCard key={app.id} app={app} onUpdate={refreshApps} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="webapps" className="mt-0">
                {externalWebApps.length > 0 ? (
                  <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,250px))]">
                    {externalWebApps.map((webapp) => (
                      <WebAppCard key={webapp.id} webapp={webapp} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Globe className="mb-4 h-12 w-12 text-muted" />
                    <p className="text-lg text-muted">
                      No services configured.
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Add external web applications to access them from here.
                    </p>
                    {canManageSettings && (
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

              <TabsContent value="apps" className="mt-0">
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,250px))]">
                  {apps?.map((app) => (
                    <AppCard key={app.id} app={app} onUpdate={refreshApps} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {apps?.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-lg text-muted">No app available.</p>
              {canManageAppStore && (
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
