import { Badge } from '@/components/ui/badge'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  getEnhancedRole,
  getPermissionDescription,
  getRoleDescription,
  getRolePermissions
} from '~/utils/schema-roles'

export function RoleHoverCard({
  roleName,
  children
}: {
  roleName: string
  children: React.ReactNode
}) {
  const role = getEnhancedRole(roleName)
  const permissions = getRolePermissions(roleName)
  const description = getRoleDescription(roleName)

  if (!role) {
    return <>{children}</>
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        className="max-h-[500px] w-[600px] overflow-y-auto rounded-2xl border border-muted/30 bg-background p-4 shadow-lg"
        side="bottom"
        align="start"
        sideOffset={5}
        avoidCollisions={false}
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold">{roleName}</h4>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>

          {role.inheritsFrom && role.inheritsFrom.length > 0 && (
            <div>
              <h5 className="mb-1 text-xs font-medium text-muted-foreground">
                Inherits from:
              </h5>
              <div className="flex flex-wrap gap-1">
                {role.inheritsFrom.map((inheritedRole) => (
                  <Badge
                    key={inheritedRole}
                    variant="outline"
                    className="text-xs"
                  >
                    {inheritedRole}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <h5 className="mb-2 text-xs font-medium text-muted-foreground">
              Permissions ({permissions.length})
            </h5>
            <div className="max-h-56 overflow-y-auto rounded-md border border-muted/40">
              <Table>
                <TableHeader className="sticky top-0 bg-background/95">
                  <TableRow>
                    <TableHead className="h-8 w-2/5 text-xs text-muted-foreground">
                      Action
                    </TableHead>
                    <TableHead className="h-8 w-2/5 text-xs text-muted-foreground">
                      Description
                    </TableHead>
                    <TableHead className="h-8 w-1/5 text-xs text-muted-foreground">
                      Source
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission) => {
                    const isDirectPermission =
                      role.permissions.includes(permission)
                    const description = getPermissionDescription(permission)
                    return (
                      <TableRow key={permission} className="border-muted/40">
                        <TableCell className="py-2 font-mono text-xs text-accent">
                          {permission}
                        </TableCell>
                        <TableCell className="py-2 text-xs text-muted-foreground">
                          {description}
                        </TableCell>
                        <TableCell className="py-2 text-xs">
                          {isDirectPermission ? (
                            <Badge variant="default" className="text-xs">
                              Direct
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Inherited
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {role.attributes && Object.keys(role.attributes).length > 0 && (
            <div>
              <h5 className="mb-1 text-xs font-medium text-muted-foreground">
                Context Scope:
              </h5>
              <div className="flex flex-wrap gap-2">
                {Object.entries(role.attributes).map(([key, value]) => (
                  <Badge key={key} variant="outline" className="text-xs">
                    {key}: {value === '*' ? 'All' : value}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
