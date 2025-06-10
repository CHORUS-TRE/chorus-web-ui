'use client'

import { useAuth } from '~/components/store/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

export default function Me() {
  const { user } = useAuth()

  return (
    <div className="grid gap-6">
      {user && (
        <Card className="w-full bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pb-4">
            <CardTitle className="text-2xl">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted">
              {user.firstName} {user.lastName}
            </p>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
