import { appList } from '@/components/actions/app-view-model'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import { App } from '~/domain/model'

async function getAppById(id: string): Promise<App | undefined> {
  const apps = await appList()
  return apps.data?.find((app) => app.id === id)
}

export default async function AppDetailsPage({
  params
}: {
  params: { appId: string }
}) {
  const app = await getAppById(params.appId)

  if (!app) {
    return <div>App not found</div>
  }

  return (
    <div className="flex-1 p-6">
      <div className="mx-auto max-w-3xl">
        <Card className="bg-background text-white">
          <CardHeader className="flex flex-row items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={app.name === 'vscode' ? '/vscode.png' : undefined}
                className="m-auto"
              />
              <AvatarFallback className="text-2xl">
                {app.name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl">{app.name}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                {app.type}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-2 text-xl font-semibold">Description</h3>
              <p className="text-muted-foreground">{app.description}</p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-semibold">Details</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-muted-foreground">Version</dt>
                  <dd>{app.version || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Type</dt>
                  <dd className="capitalize">{app.type}</dd>
                </div>
              </dl>
            </div>

            <div className="pt-6">
              <Button size="lg" className="w-full">
                Start Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
