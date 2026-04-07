'use client'

import { Pencil, Plus, Store, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { toast } from '@/components/hooks/use-toast'
import { useIframeCache } from '@/providers/iframe-cache-provider'
import { appDelete, appList } from '@/view-model/app-view-model'
import { Button } from '~/components/button'
import { AppCreateDialog } from '~/components/forms/app-create-dialog'
import { WebAppCreateDialog } from '~/components/forms/webapp-create-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { App } from '~/domain/model'

export default function AdminAppStorePage() {
  const router = useRouter()
  const { externalWebApps, removeExternalWebApp } = useIframeCache()

  const [apps, setApps] = useState<App[] | undefined>(undefined)
  const [showAppDialog, setShowAppDialog] = useState(false)
  const [showWebAppDialog, setShowWebAppDialog] = useState(false)
  const [editingWebappId, setEditingWebappId] = useState<string | undefined>(
    undefined
  )
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const fetchApps = async () => {
    const result = await appList({ disableGrouping: true })
    if (result.error) {
      toast({ title: result.error, variant: 'destructive' })
      return
    }
    setApps(result.data)
  }

  useEffect(() => {
    fetchApps()
  }, [])

  const handleDeleteApp = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return

    setIsDeleting(id)
    try {
      const result = await appDelete(id)
      if (result.error) {
        toast({
          title: 'Error deleting app',
          description: result.error,
          variant: 'destructive'
        })
      } else {
        toast({
          title: 'App deleted',
          description: 'The application has been removed.'
        })
        await fetchApps()
      }
    } finally {
      setIsDeleting(null)
    }
  }

  const handleDeleteWebApp = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    setIsDeleting(id)
    try {
      const success = await removeExternalWebApp(id)
      if (success) {
        toast({
          title: 'Service deleted',
          description: 'The service has been removed.'
        })
      }
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-semibold text-muted-foreground">
            <Store className="h-9 w-9" />
            App Store
          </h1>
          <p className="mb-8 text-muted-foreground">
            Manage global application settings and available apps.
          </p>
        </div>
      </div>

      <Tabs defaultValue="apps" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="apps">Applications</TabsTrigger>
            <TabsTrigger value="webapps">Webapps (Services)</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="apps" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowAppDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add App
            </Button>
          </div>

          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-2 text-muted-foreground">
                    Name
                  </TableHead>
                  <TableHead className="p-2 text-muted-foreground">
                    Version
                  </TableHead>
                  <TableHead className="p-2 text-right text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps?.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell>{app.dockerImageTag || '—'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/admin/app-store/app/${app.id}`)
                          }
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          disabled={isDeleting === app.id}
                          onClick={() => handleDeleteApp(app.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {apps !== undefined && !apps.length && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No applications found.
                    </TableCell>
                  </TableRow>
                )}
                {apps === undefined && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Loading…
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="webapps" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setShowWebAppDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Webapp
            </Button>
          </div>

          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-2 text-muted-foreground">
                    Name
                  </TableHead>
                  <TableHead className="p-2 text-muted-foreground">
                    URL
                  </TableHead>
                  <TableHead className="p-2 text-right text-muted-foreground">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {externalWebApps.map((webapp) => (
                  <TableRow key={webapp.id}>
                    <TableCell className="font-medium">{webapp.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {webapp.url}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingWebappId(webapp.id)
                            setShowWebAppDialog(true)
                          }}
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          disabled={isDeleting === webapp.id}
                          onClick={() => handleDeleteWebApp(webapp.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!externalWebApps.length && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No webapps found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <AppCreateDialog
        open={showAppDialog}
        onOpenChange={setShowAppDialog}
        onSuccess={() => fetchApps()}
      />

      <WebAppCreateDialog
        open={showWebAppDialog}
        onOpenChange={(open) => {
          setShowWebAppDialog(open)
          if (!open) {
            setEditingWebappId(undefined)
          }
        }}
        initialEditingWebappId={editingWebappId}
      />
    </div>
  )
}
