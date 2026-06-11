'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useRoles } from '@/providers/roles-provider'

interface UsersStatsRowProps {
  totalUsers: number
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="mt-1 text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  )
}

export function UsersStatsRow({ totalUsers }: UsersStatsRowProps) {
  const { roles, permissions } = useRoles()

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      <StatCard value={totalUsers} label="Platform users" />
      <StatCard value={roles.length} label="Roles in catalog" />
      <StatCard value={permissions.length} label="Permissions" />
    </div>
  )
}
