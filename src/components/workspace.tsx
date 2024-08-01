import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card'
import { ResponsiveLine } from '@nivo/line'
import React from 'react'
import { Workspace as WorkspaceType } from '@/domain/model'

export function Workspace({ workspace }: { workspace?: WorkspaceType | null }) {
  if (!workspace) {
    return <div>Workspace not found</div>
  }

  const [showLargeLeftSidebar, setShowLargeLeftSidebar] = React.useState(true)
  const [showRightSidebar, setShowRightSidebar] = React.useState(false)
  const [showApp, setShowApp] = React.useState(false)

  const handleToggleLeftSidebar = () => {
    setShowLargeLeftSidebar(!showLargeLeftSidebar)
  }

  return (
    <div className="flex">
      {/* Main */}
      <div className="flex min-h-screen w-full flex-col  bg-muted/40">
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
                              {workspace.createdAt.toDateString()}
                            </p>
                          </div>
                          <CardDescription>
                            {workspace.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground">
                            {workspace.ownerIds.map((owner) => (
                              <span key={owner}>{owner}</span>
                            ))}
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
                              See who's on your team and their roles.
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
                                  <div className="text-muted-foreground">
                                    Designer
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <Avatar>
                                  <AvatarImage src="/placeholder-user.jpg" />
                                  <AvatarFallback>MB</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    Michael Brown
                                  </div>
                                  <div className="text-muted-foreground">
                                    Developer
                                  </div>
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
