'use client'

import { useEffect, useState } from 'react'

import { userMe } from '~/components/actions/user-view-model'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { UserResponse } from '~/domain/model'

export default function Me() {
  const [user, setUser] = useState<UserResponse['data']>()
  const [error, setError] = useState<UserResponse['error']>()

  useEffect(() => {
    try {
      userMe()
        .then((response) => {
          if (response?.error) setError(response.error)
          if (response?.data) setUser(response?.data)
        })
        .catch((error) => {
          setError(error.message)
        })
    } catch (error) {
      setError(error.message)
    }
  }, [])

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
