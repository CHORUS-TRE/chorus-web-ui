'use client'

import {
  AppWindow,
  CheckCircle,
  Clock,
  Crown,
  Key,
  LaptopMinimal,
  Package,
  Settings,
  Shield,
  User,
  XCircle
} from 'lucide-react'
import { useParams } from 'next/navigation'

import { Button } from '@/components/button'
import { Link } from '@/components/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAppState } from '@/stores/app-state-store'
import { RoleHoverCard } from '~/components/role-hover-card'
import { useAuthentication } from '~/providers/authentication-provider'

export default function UserProfile() {
  const { user } = useAuthentication()
  const { workspaces } = useAppState()
  const params = useParams<{ userId: string }>()
  const userId = params?.userId

  // const { users: userList } = useAppState()
  // const profileUser = userList?.find((u) => u.id === userId)

  if (user?.id !== userId) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No user information available</p>
        </div>
      </div>
    )
  }

  const profileUser = user

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />
      case 'inactive':
        return <XCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const groupRolesByWorkspace = () => {
    if (
      !profileUser.rolesWithContext ||
      profileUser.rolesWithContext.length === 0
    ) {
      return {}
    }

    const groups: Record<
      string,
      Record<string, typeof profileUser.rolesWithContext>
    > = {}

    profileUser.rolesWithContext.forEach((role) => {
      const workspaceId = role.context.workspace || 'undefined'
      const roleName = role.name

      if (!groups[workspaceId]) {
        groups[workspaceId] = {}
      }

      if (!groups[workspaceId][roleName]) {
        groups[workspaceId][roleName] = []
      }

      groups[workspaceId][roleName].push(role)
    })

    return groups
  }

  const formatContextDisplay = (context: Record<string, string>) => {
    return Object.entries(context)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')
  }

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-5 mt-5 flex w-full flex-row items-center gap-3 text-start">
            <Package className="h-9 w-9" />
            User Profile
          </h2>
          {/* {canCreateWorkspace && (
            <Button onClick={() => setCreateOpen(true)} variant="accent-filled">
              <CirclePlus className="h-4 w-4" />
              Create Workspace
            </Button>
          )} */}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          {/* Profile Header */}
          <Card className="card-glass flex flex-col rounded-2xl">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl">
                    {profileUser.firstName.charAt(0)}
                    {profileUser.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div>
                    <h1 className="text-3xl font-bold">
                      {profileUser.firstName} {profileUser.lastName}
                    </h1>
                    <p className="text-muted-foreground">
                      @{profileUser.username}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(profileUser.status)}
                    <Badge className={getStatusColor(profileUser.status)}>
                      {profileUser.status}
                    </Badge>
                    {profileUser.totpEnabled && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Key className="h-3 w-3" />
                        2FA Enabled
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/users/${userId}/settings/`}>
                    <Button variant="outline">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <Card className="card-glass flex h-full flex-col rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    User ID
                  </label>
                  <p className="font-mono text-sm">{profileUser.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Username
                  </label>
                  <p>{profileUser.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <p>
                    {profileUser.firstName} {profileUser.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Authentication Source
                  </label>
                  <p>{profileUser.source}</p>
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="card-glass flex h-full flex-col rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Account Status</span>
                  <Badge className={getStatusColor(profileUser.status)}>
                    {profileUser.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Two-Factor Auth</span>
                  <Badge
                    variant={profileUser.totpEnabled ? 'default' : 'secondary'}
                  >
                    {profileUser.totpEnabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Password Changed</span>
                  <Badge
                    variant={
                      profileUser.passwordChanged ? 'default' : 'secondary'
                    }
                  >
                    {profileUser.passwordChanged ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Created
                    </span>
                    <p className="text-sm">
                      {new Date(profileUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </span>
                    <p className="text-sm">
                      {new Date(profileUser.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workspace Information */}
          {profileUser.workspaceId && (
            <Card className="card-glass flex h-full flex-col rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AppWindow className="h-5 w-5" />
                  Personal Workspace
                  <Badge variant="outline" className="text-xs">
                    {profileUser.workspaceId ? 'Assigned' : 'Unassigned'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    <Link href={`/workspaces/${profileUser.workspaceId}`}>
                      Current Workspace ID
                    </Link>
                  </label>
                  <p className="font-mono text-sm">
                    {profileUser.workspaceId
                      ? profileUser.workspaceId
                      : 'Unassigned'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card className="card-glass flex flex-col rounded-2xl">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" disabled>
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" disabled>
                  <Key className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
                <Link href={`/users/${userId}/settings/privacy`}>
                  <Button variant="outline">
                    <Shield className="mr-2 h-4 w-4" />
                    Privacy Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          {/* Roles & Permissions */}
          <Card className="card-glass flex h-full flex-col rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Roles & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const groupedRoles = groupRolesByWorkspace()
                const globalRoles = groupedRoles['undefined']
                const workspaceRoleEntries = Object.entries(
                  groupedRoles
                ).filter(([wsId]) => wsId !== 'undefined')

                if (!globalRoles && workspaceRoleEntries.length === 0) {
                  return (
                    <p className="text-muted-foreground">No roles assigned</p>
                  )
                }

                return (
                  <div className="space-y-6">
                    {globalRoles && (
                      <div>
                        <div className="flex items-center gap-2">
                          <Crown className="h-5 w-5 text-purple-400" />
                          <h5 className="text-base font-semibold">
                            Global Roles
                          </h5>
                        </div>
                        <div className="mt-3 space-y-3 pl-7">
                          {Object.entries(globalRoles).map(
                            ([roleName, roleInstances]) => (
                              <RoleHoverCard key={roleName} roleName={roleName}>
                                <div className="flex cursor-help items-center gap-2">
                                  <Shield className="h-4 w-4" />
                                  <h6 className="text-sm font-medium">
                                    {roleName}
                                  </h6>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {roleInstances.length}
                                  </Badge>
                                </div>
                              </RoleHoverCard>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {workspaceRoleEntries.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2">
                          <AppWindow className="h-5 w-5 text-muted-foreground" />
                          <h5 className="text-base font-semibold">
                            Workspace Roles
                          </h5>
                        </div>
                        <Accordion
                          type="multiple"
                          className="mt-2 w-full"
                          defaultValue={
                            workspaceRoleEntries.length === 1
                              ? [workspaceRoleEntries[0][0]]
                              : []
                          }
                        >
                          {workspaceRoleEntries.map(([workspaceId, roles]) => {
                            const workspace = workspaces?.find(
                              (w) => w.id === workspaceId
                            )
                            const totalRoles =
                              Object.values(roles).flat().length

                            return (
                              <AccordionItem
                                key={workspaceId}
                                value={workspaceId}
                              >
                                <AccordionTrigger>
                                  <div className="flex flex-1 items-center justify-between pr-4">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">
                                        {workspace?.name || 'Workspace'}
                                      </span>
                                      <span className="font-mono text-xs text-muted-foreground">
                                        (id: {workspaceId})
                                      </span>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {totalRoles}{' '}
                                      {totalRoles > 1 ? 'roles' : 'role'}
                                    </Badge>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-4 pl-2">
                                    {Object.entries(roles).map(
                                      ([roleName, roleInstances]) => (
                                        <div
                                          key={roleName}
                                          className="space-y-2"
                                        >
                                          <RoleHoverCard roleName={roleName}>
                                            <div className="flex cursor-help items-center gap-2">
                                              {roleName.includes(
                                                'Workspace'
                                              ) ? (
                                                <AppWindow className="h-4 w-4 text-muted-foreground" />
                                              ) : (
                                                <LaptopMinimal className="h-4 w-4 text-muted-foreground" />
                                              )}
                                              <h6 className="text-sm font-medium">
                                                {roleName}
                                              </h6>
                                              <Badge
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {roleInstances.length}
                                              </Badge>
                                            </div>
                                          </RoleHoverCard>

                                          {roleName.includes('Workbench') ? (
                                            <div className="ml-6 grid grid-cols-2 gap-2 pt-1 md:grid-cols-3 lg:grid-cols-4">
                                              {roleInstances.map(
                                                (role, index) => (
                                                  <Link
                                                    key={index}
                                                    href={`/workspaces/${role.context.workspace}/sessions/${role.context.workbench}`}
                                                    className="group"
                                                  >
                                                    <div className="truncate rounded-md border p-2 transition-colors hover:border-accent hover:bg-accent/10">
                                                      <div className="flex items-center gap-2">
                                                        <LaptopMinimal className="h-3 w-3 flex-shrink-0" />
                                                        <span className="truncate text-xs">
                                                          {
                                                            role.context
                                                              .workbench
                                                          }
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </Link>
                                                )
                                              )}
                                            </div>
                                          ) : (
                                            <div className="ml-6 text-xs text-muted-foreground">
                                              Applies to the entire workspace.
                                            </div>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            )
                          })}
                        </Accordion>
                      </div>
                    )}
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
