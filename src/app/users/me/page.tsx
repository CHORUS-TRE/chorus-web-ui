'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { Badge, LineChart } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter
} from '~/components/ui/card'
import { userMeViewModel } from './user-me-view-model'
import { use, useEffect, useState } from 'react'
import { UserResponse } from '~/domain/model'
import { set } from 'zod'

export default function Me() {
  const [user, setUser] = useState<UserResponse['data']>()
  const [error, setError] = useState<UserResponse['error']>()
  const { me } = userMeViewModel()

  useEffect(() => {
    try {
      me()
        .then((response) => {
          if (response?.error) setError(response.error)
          if (response?.data) setUser(response?.data)
        })
        .catch((error) => {
          throw new Error(error)
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
                    {error && (
                      <p className="mt-4 text-red-500">{error.message}</p>
                    )}
                    {user && (
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-2xl">
                            User: {user.username}
                          </CardTitle>
                          {/* <div>
                          <p className="text-xs text-muted-foreground">
                            <strong>Type: </strong>
                            {workspace.project.type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <strong>Status: </strong>
                            {workspace.project.status}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <strong>Creation date: </strong>
                            {workspace.createdAt}
                          </p>
                        </div> */}
                          {/* <CardDescription>
                        {workspace.description}
                      </CardDescription> */}
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground">
                            {/* {workspace.owner.map((owner) => (
                            <span key={owner.fullName}>{owner.fullName}</span>
                          ))} */}
                          </p>
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
