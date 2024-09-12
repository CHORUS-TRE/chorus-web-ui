import React from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Workspace as WorkspaceType } from '@/domain/model'

export function Workspace({ workspace }: { workspace?: WorkspaceType | null }) {
  if (!workspace) {
    return <div>Workspace not found</div>
  }

  return (
    <div className="flex">
      {/* Main */}
      <div className="flex w-full flex-col ">
        <div>
          {/* Main space */}
          <div className="flex flex-col pt-8 ">
            {/* Content */}
            <div className="flex">
              <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl">
                          {workspace?.name}
                        </CardTitle>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            <strong>Type: </strong>
                            {workspace.tags.join(', ')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <strong>Status: </strong>
                            {workspace.status}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <strong>Creation date: </strong>
                            {workspace.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        <CardDescription>
                          {workspace.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground">
                          {workspace.ownerId}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
