import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Workspace as WorkspaceType } from '@/domain/model'
import { ResponsiveLine } from '@nivo/line'

export function Workspace({ workspace }: { workspace?: WorkspaceType | null }) {
  const [showLargeLeftSidebar, setShowLargeLeftSidebar] = React.useState(true)
  const [showRightSidebar, setShowRightSidebar] = React.useState(false)
  const [showApp, setShowApp] = React.useState(false)

  const handleToggleLeftSidebar = () => {
    setShowLargeLeftSidebar(!showLargeLeftSidebar)
  }

  if (!workspace) {
    return <div>Workspace not found</div>
  }

  return (
    <div className="flex">
      {/* Main */}
      <div className="flex w-full flex-col ">
        {!showApp && (
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
        )}
      </div>
    </div>
  )
}

function LineChart(props: any) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: 'Desktop',
            data: [
              { x: 'Jan', y: 43 },
              { x: 'Feb', y: 137 },
              { x: 'Mar', y: 61 },
              { x: 'Apr', y: 145 },
              { x: 'May', y: 26 },
              { x: 'Jun', y: 154 }
            ]
          },
          {
            id: 'Mobile',
            data: [
              { x: 'Jan', y: 60 },
              { x: 'Feb', y: 48 },
              { x: 'Mar', y: 177 },
              { x: 'Apr', y: 78 },
              { x: 'May', y: 96 },
              { x: 'Jun', y: 204 }
            ]
          }
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{
          type: 'point'
        }}
        yScale={{
          type: 'linear'
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16
        }}
        colors={['#2563eb', '#e11d48']}
        pointSize={6}
        useMesh={true}
        gridYValues={6}
        theme={{
          tooltip: {
            chip: {
              borderRadius: '9999px'
            },
            container: {
              fontSize: '12px',
              textTransform: 'capitalize',
              borderRadius: '6px'
            }
          },
          grid: {
            line: {
              stroke: '#f3f4f6'
            }
          }
        }}
        role="application"
      />
    </div>
  )
}
