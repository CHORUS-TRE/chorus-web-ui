import { ResponsiveLine } from '@nivo/line'
import {
  Activity,
  ArrowRight,
  CircleGauge,
  Database,
  Folder,
  Footprints,
  LaptopMinimal,
  Users
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'

import { Link } from '@/components/link'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { AuditEntry } from '@/domain/model/audit'
import { useFileSystem } from '@/hooks/use-file-system'
import { useAuthentication } from '@/providers/authentication-provider'
import { useAppStateStore } from '@/stores/app-state-store'
import { formatFileSize } from '@/utils/format-file-size'
import { listWorkspace as listWorkspaceAudit } from '@/view-model/audit-view-model'

import { WorkbenchCreateForm } from './forms/workbench-create-form'
import { WorkspaceUpdateForm } from './forms/workspace-forms'
import { toast } from './hooks/use-toast'
import { ChartContainer } from './ui/chart'
import { ScrollArea } from './ui/scroll-area'
import { WorkspaceWorkbenchList } from './workspace-workbench-list'

// Add a simple custom bar chart component
function SimpleBarChart({
  data,
  height = 36,
  width = 72,
  color = 'hsl(var(--chart-1))'
}: {
  data: Array<{ value: number }>
  height?: number
  width?: number
  color?: string
}) {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div style={{ width, height }} className="flex items-end space-x-1">
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * height
        return (
          <div
            key={index}
            style={{
              height: `${barHeight}px`,
              backgroundColor: color
            }}
            className="flex-1 rounded-t-sm"
          />
        )
      })}
    </div>
  )
}

export function Workspace({ workspaceId }: { workspaceId: string }) {
  const router = useRouter()
  const [openEdit, setOpenEdit] = useState(false)
  const { workbenches, refreshWorkspaces, workspaces, refreshWorkbenches } =
    useAppStateStore()
  const { user, refreshUser } = useAuthentication()
  const { getChildren } = useFileSystem(workspaceId)
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([])

  const rootChildren = getChildren('root')

  useEffect(() => {
    async function fetchAudit() {
      try {
        const result = await listWorkspaceAudit(workspaceId)
        if (result.data) {
          setAuditEntries(result.data)
        }
      } catch (err) {
        console.error('Failed to fetch audit entries:', err)
      }
    }
    fetchAudit()
  }, [workspaceId])
  const workspace = workspaces?.find((w) => w.id === workspaceId)

  return (
    <>
      {openEdit && (
        <WorkspaceUpdateForm
          workspace={workspace}
          state={[openEdit, setOpenEdit]}
          onSuccess={() => {
            toast({
              title: 'Workspace updated',
              description: 'Workspace updated',
              variant: 'default'
            })
            refreshWorkspaces()
            refreshUser()
          }}
        />
      )}

      <div className="my-1 grid w-full gap-4 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        {/* Sessions Card */}
        <Card
          role="region"
          aria-labelledby="sessions-card-title"
          className="flex h-full flex-col"
        >
          <CardHeader className="mb-0 w-full">
            <CardTitle className="mb-1 flex items-center gap-3">
              <Link href={`/workspaces/${workspaceId}/sessions`} variant="flex">
                <LaptopMinimal
                  className="h-6 w-6 flex-shrink-0"
                  aria-hidden="true"
                />
                <span id="sessions-card-title" className="">
                  <span className="sr-only">Sessions</span>
                  Sessions
                </span>
              </Link>
            </CardTitle>
            <CardDescription className="overflow-hidden truncate text-xs text-muted-foreground">
              {(() => {
                const sessionCount =
                  workbenches?.filter(
                    (workbench) => workbench.workspaceId === workspaceId
                  )?.length || 0
                return (
                  <span className="w-16 truncate text-nowrap">{`${sessionCount} ${sessionCount === 1 ? 'session' : 'sessions'} in ${workspace?.name}`}</span>
                )
              })()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading sessions...</div>}>
              {(() => {
                const sessionCount =
                  workbenches?.filter(
                    (workbench) => workbench.workspaceId === workspaceId
                  )?.length || 0

                // Adaptive layout based on session count
                const getScrollAreaClass = () => {
                  if (sessionCount === 0) return 'flex flex-col'
                  if (sessionCount <= 2)
                    return 'flex max- flex-col overflow-y-auto'
                  if (sessionCount <= 4)
                    return 'flex max-h-32 flex-col overflow-y-auto'
                  return 'flex max-h-40 flex-col overflow-y-auto'
                }

                return (
                  <ScrollArea
                    className={getScrollAreaClass()}
                    type="hover"
                    role="region"
                    aria-label={`Sessions list with ${sessionCount} ${sessionCount === 1 ? 'session' : 'sessions'}`}
                    aria-describedby="scroll-hint"
                  >
                    <div id="scroll-hint" className="sr-only">
                      Use arrow keys or scroll to navigate through sessions
                    </div>
                    <WorkspaceWorkbenchList
                      workspaceId={workspaceId}
                      size="small"
                    />
                  </ScrollArea>
                )
              })()}
            </Suspense>
          </CardContent>
          <div className="flex-grow" />
          <CardFooter className="flex items-end justify-start">
            <div className="flex w-full flex-row items-center gap-2">
              <WorkbenchCreateForm
                workspaceId={workspace?.id || ''}
                workspaceName={workspace?.name}
                onSuccess={() => {
                  refreshWorkbenches()
                }}
              />
            </div>
          </CardFooter>
        </Card>

        {/* Data Card */}
        <Card className="flex h-full flex-col bg-contrast-background/70 backdrop-blur-sm">
          <CardHeader className="mb-0 w-full">
            <CardTitle className="mb-1 flex items-center gap-3">
              <Link href={`/workspaces/${workspaceId}/data`} variant="flex">
                <Database
                  className="h-6 w-6 flex-shrink-0"
                  aria-hidden="true"
                />
                <span id="sessions-card-title" className="">
                  <span className="sr-only">Data</span>
                  Data
                </span>
              </Link>
            </CardTitle>
            <CardDescription className="overflow-hidden truncate text-xs text-muted-foreground">
              View and manage your data sources.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <>
              <div className="flex flex-col gap-2">
                {rootChildren && rootChildren.length === 0 && (
                  <div className="flex items-center justify-between text-muted-foreground">
                    <p className="text-xs text-muted-foreground">No data</p>
                  </div>
                )}
                {rootChildren
                  .filter((child) => child.type === 'folder')
                  .map((child) => (
                    <div
                      className="flex items-center justify-between text-muted-foreground"
                      key={child.id}
                    >
                      <p className="text-xs text-foreground">{child.name}</p>
                      <p className="text-xs">
                        <Folder className="h-4 w-4" />
                      </p>
                    </div>
                  ))}
                {rootChildren
                  .filter((child) => child.type === 'file')
                  .map((child) => (
                    <div
                      className="flex items-center justify-between text-muted-foreground"
                      key={child.id}
                    >
                      <p className="text-ellipsis whitespace-nowrap text-wrap text-xs text-foreground">
                        {child.name}
                      </p>
                      <p className="text-xs">{formatFileSize(child.size)}</p>
                    </div>
                  ))}
              </div>
            </>
          </CardContent>
          <div className="flex-grow" />
          <CardFooter className="flex items-end justify-start">
            <Button
              variant="accent-filled"
              onClick={() => {
                router.push(`/workspaces/${workspaceId}/data`)
              }}
            >
              <ArrowRight className="h-4 w-4" />
              View Data
            </Button>
          </CardFooter>
        </Card>

        {/* Members Card */}
        {workspace && user?.workspaceId !== workspace?.id && (
          <Card className="flex h-full flex-col">
            <CardHeader className="mb-0 w-full">
              <CardTitle className="mb-1 flex items-center gap-3">
                <Link href={`/workspaces/${workspaceId}/users`} variant="flex">
                  <Users className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                  <span id="sessions-card-title" className="">
                    <span className="sr-only">Members</span>
                    Members
                  </span>
                </Link>
              </CardTitle>
              <CardDescription className="overflow-hidden truncate text-xs text-muted-foreground">
                See who&apos;s on your team and their roles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="mb-2 flex max-h-40 flex-col overflow-y-auto pr-2">
                <div className="grid gap-1">
                  {workspace?.dev?.members?.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No members found
                    </p>
                  )}

                  {workspace?.dev?.members
                    ?.filter((member) =>
                      member.rolesWithContext?.some(
                        (role) =>
                          role.context.workspace === workspaceId &&
                          role.name.startsWith('Workspace')
                      )
                    )
                    .map((member) => {
                      const rolesInWorkspace = member.rolesWithContext?.filter(
                        (role) => role.context.workspace === workspaceId
                      )
                      const roleNames = rolesInWorkspace?.map((role) => {
                        if (role.name.startsWith('Workspace')) {
                          return role.name.replace('Workspace', '').trim()
                        }
                        return role.name
                      })

                      return (
                        <div
                          className="flex items-center justify-between gap-4 text-muted-foreground"
                          key={`team-${member.id}`}
                        >
                          <div className="flex items-center gap-4">
                            <Avatar className="h-6 w-6 text-foreground">
                              <AvatarFallback>
                                {member.firstName[0]?.toUpperCase()}{' '}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm">
                                {member.firstName} {member.lastName}
                              </p>
                            </div>
                          </div>
                          {roleNames && (
                            <p className="text-xs text-muted-foreground">
                              {roleNames.join(', ')}
                            </p>
                          )}
                        </div>
                      )
                    })}
                </div>
              </ScrollArea>
            </CardContent>
            <div className="flex-grow" />
            <CardFooter className="flex items-end justify-start">
              <Button
                variant="accent-filled"
                onClick={() => router.push(`/workspaces/${workspaceId}/users`)}
              >
                <ArrowRight className="h-4 w-4" />
                Manage Members
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Quick Actions */}
        {/* <Card className="glass-surface demo-effect">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              className="w-full gap-2"
              variant="outline"
              onClick={() => setOpenEdit(true)}
            >
              <Settings className="h-4 w-4" />
              Workspace Settings
            </Button>
            <Button className="w-full gap-2" variant="outline">
              <Plus className="h-4 w-4" />
              Request Dataset Access
            </Button>
            <Button className="w-full gap-2" variant="outline">
              <Users className="h-4 w-4" />
              Add Team Member
            </Button>
            <Button className="w-full gap-2" variant="outline">
              <FileDown className="h-4 w-4" />
              Export Results
            </Button>
            <Button className="w-full gap-2" variant="outline">
              <MessageSquare className="h-4 w-4" />
              Contact Support
            </Button>
          </CardContent>
        </Card> */}

        <Card className="flex h-full flex-col">
          <CardHeader className="mb-0 w-full">
            <CardTitle className="mb-1 flex items-center gap-3">
              <Link href={`/workspaces/${workspaceId}/audit`} variant="flex">
                <Activity className="h-6 w-6" />
                Recent Activity
              </Link>
            </CardTitle>
            <CardDescription className="overflow-hidden truncate text-xs text-muted-foreground">
              Latest actions in your project workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditEntries.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No recent activity.
                </p>
              ) : (
                <>
                  {[...auditEntries]
                    .sort((a, b) => {
                      const ta = a.createdAt
                        ? new Date(a.createdAt).getTime()
                        : 0
                      const tb = b.createdAt
                        ? new Date(b.createdAt).getTime()
                        : 0
                      return tb - ta
                    })
                    .slice(0, 3)
                    .map((entry, index) => (
                      <div
                        key={entry.id || index}
                        className="flex items-start gap-3 border-b pb-3 last:border-0"
                      >
                        <div className="mt-2 h-2 w-2 rounded-full bg-primary"></div>
                        <div className="flex-1">
                          <p className="text-foreground-muted text-xs">
                            {entry.description ||
                              entry.action ||
                              'Unknown action'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {entry.actorUsername || 'System'}
                            {entry.createdAt &&
                              ` • ${new Date(entry.createdAt).toLocaleString()}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  <p className="pt-1 text-[10px] text-muted-foreground">
                    Showing {Math.min(3, auditEntries.length)} of{' '}
                    {auditEntries.length}
                  </p>
                </>
              )}
            </div>
          </CardContent>
          <div className="flex-grow" />
          <CardFooter className="flex items-end justify-start">
            <Button
              variant="accent-filled"
              onClick={() => router.push(`/workspaces/${workspaceId}/audit`)}
            >
              <ArrowRight className="h-4 w-4" />
              View All
            </Button>
          </CardFooter>
        </Card>

        {/* Resources Card */}
        <Card className="demo-effect flex h-full flex-col">
          <CardHeader className="mb-0 w-full">
            <CardTitle className="mb-1 flex items-center gap-3">
              <Link href={'#'} variant="flex">
                <CircleGauge className="h-6 w-6" />
                Resources
              </Link>
            </CardTitle>
            <CardDescription className="overflow-hidden truncate text-xs text-muted-foreground">
              You&apos;re using 1.2GB of your 5GB storage limit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <>
              <div className="flex items-baseline gap-1 text-3xl font-semibold tabular-nums leading-none text-muted text-muted-foreground">
                12.5
                <span className="text-sm font-normal text-muted">Mo/day</span>
              </div>
              <ChartContainer
                config={{
                  steps: { label: 'Steps', color: 'hsl(var(--chart-1))' }
                }}
                className="ml-auto w-[72px]"
              >
                <SimpleBarChart
                  data={[
                    { value: 2000 },
                    { value: 2100 },
                    { value: 2200 },
                    { value: 1300 },
                    { value: 1400 }
                  ]}
                />
              </ChartContainer>
            </>
          </CardContent>
          <div className="flex-grow" />
          <CardFooter className="flex items-end justify-start">
            <Button disabled variant="accent-filled">
              <ArrowRight className="h-4 w-4" />
              View Resources
            </Button>
          </CardFooter>
        </Card>

        {/* Footprint Card */}
        <Card className="demo-effect flex h-full flex-col">
          <CardHeader className="mb-0 w-full">
            <CardTitle className="mb-1 flex items-center gap-3">
              <Link href={'#'} variant="flex">
                <Footprints className="h-6 w-6" />
                Footprint
              </Link>
            </CardTitle>
            <CardDescription className="overflow-hidden truncate text-xs text-muted-foreground"></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted"></div>
          </CardContent>
          <div className="flex-grow" />
          <CardFooter className="flex items-end justify-start">
            <Button disabled variant="accent-filled">
              <ArrowRight className="h-4 w-4" />
              View Footprint
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

function LineChart(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: 'Session',
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
