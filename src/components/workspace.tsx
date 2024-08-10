import React, { useState } from 'react'

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
  const [showLargeLeftSidebar, setShowLargeLeftSidebar] = useState(true)
  const [showRightSidebar, setShowRightSidebar] = useState(false)

  const handleToggleLeftSidebar = () => {
    setShowLargeLeftSidebar(!showLargeLeftSidebar)
  }

  if (!workspace) {
    return <div>Workspace not found</div>
  }

  return (
    <div className="flex min-h-screen w-full">
      <div className="mx-auto flex-1 auto-rows-max gap-4">
        <div className="grid gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl">
                Project: {workspace?.name}
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
              <CardDescription>{workspace.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                <span>{workspace.ownerId}</span>
              </p>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Apps</CardTitle>
                <CardDescription>
                  View and manage your active apps.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    Explorer
                    <Badge>Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    Brainstorm
                    <Badge>Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    Excel
                    <Badge>Exited</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Team</CardTitle>
                <CardDescription>
                  See who&apos;s on your team and their roles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">John Doe</div>
                      <div className="text-muted-foreground">
                        Project Manager
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Jane Smith</div>
                      <div className="text-muted-foreground">Designer</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>MB</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Michael Brown</div>
                      <div className="text-muted-foreground">Developer</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm">View Team</Button>
              </CardFooter>
            </Card>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Check out the latest analytics for your workspace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart className="aspect-[3/2]" />
              </CardContent>
              <CardFooter>
                <Button size="sm">View Analytics</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
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
