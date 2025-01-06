'use client'

import { useState } from 'react'

import { useAuth } from '~/components/store/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { UserResponse } from '~/domain/model'

export default function Me() {
  const [error, setError] = useState<UserResponse['error']>()
  const { user } = useAuth()

  return (
    <div className="grid gap-6">
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {user && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {user.firstName} {user.lastName}
            </p>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
