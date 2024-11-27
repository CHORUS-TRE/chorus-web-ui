'use client'

import { useCallback, useEffect, useState } from 'react'
import { CirclePlus } from 'lucide-react'

import { AppCard } from '~/components/app-card'
import { AppCreateDialog } from '~/components/app-create-dialog'
import { Button } from '~/components/button'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { App } from '~/domain/model'
import { AppType } from '~/domain/model/app'

import { appList } from './actions/app-view-model'

export function AppStoreView() {
  const [apps, setApps] = useState<App[]>([])
  const [error, setError] = useState<string>()
  const [selectedType, setSelectedType] = useState<AppType>('app' as AppType)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const loadApps = async () => {
    try {
      setIsLoading(true)
      setError(undefined)
      const result = await appList()

      if (result.error) {
        setError(result.error)
        return
      }

      if (!result.data) {
        setError('No apps available')
        return
      }

      setApps(result.data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load apps')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadApps()
  }, [selectedType])

  const handleUpdate = useCallback(async () => {
    await loadApps()
  }, [])

  const filteredApps = apps.filter((app) => app.type === selectedType)

  return (
    <div className="flex min-h-screen flex-col">
      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <Tabs
                defaultValue="app"
                onValueChange={(value) => setSelectedType(value as AppType)}
                className="w-full"
              >
                <div className="mb-8 flex items-center justify-between">
                  <TabsList className="bg-background">
                    <TabsTrigger
                      value="app"
                      className="data-[state=active]:text-primary-foreground"
                    >
                      Apps
                    </TabsTrigger>
                    <TabsTrigger
                      value="scripts"
                      className="data-[state=active]:text-primary-foreground"
                    >
                      Scripts
                    </TabsTrigger>
                    <TabsTrigger
                      value="workflows"
                      className="data-[state=active]:text-primary-foreground"
                    >
                      Workflows
                    </TabsTrigger>
                  </TabsList>

                  <Button onClick={() => setShowCreateDialog(true)}>
                    <CirclePlus className="mr-2 h-4 w-4" />
                    Add New App
                  </Button>
                </div>

                <TabsContent value="app" className="mt-0">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {isLoading ? (
                      <div className="col-span-full text-center text-muted-foreground">
                        Loading...
                      </div>
                    ) : (
                      filteredApps.map((app) => (
                        <AppCard
                          key={app.id}
                          app={app}
                          onUpdate={handleUpdate}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="service" className="mt-0">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredApps.map((app) => (
                      <AppCard key={app.id} app={app} onUpdate={handleUpdate} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {filteredApps.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-lg text-muted-foreground">
                  No {selectedType} available.
                </p>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  variant="outline"
                  className="mt-4"
                >
                  <CirclePlus className="mr-2 h-4 w-4" />
                  Add your first {selectedType}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <AppCreateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleUpdate}
        defaultType={selectedType}
      />
    </div>
  )
}
