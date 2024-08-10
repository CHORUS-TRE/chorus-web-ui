'use client'

import { useEffect, useState } from 'react'

import { userMe } from '~/app/user-view-model.server'
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
    } catch (error: any) {
      setError(error.message)
    }
  }, [])

  return (
    <div className="flex">
      <div className="flex min-h-screen w-full flex-col  bg-muted/40">
        <div>
          <div className="flex flex-col pt-8 ">
            <div className="flex">
              <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
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
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
