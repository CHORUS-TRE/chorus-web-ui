'use client'

import { userCreate } from '@/app/user-view-model.server'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { Button } from '~/components/ui/button'
import { Icons } from '~/components/ui/icons'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import placeholder from '/public/placeholder.svg'

export default function Me() {
  const [formState, formAction] = useFormState(userCreate, {
    data: undefined,
    error: undefined
  })

  useEffect(() => {
    if (formState?.data && !formState.error) {
      redirect(`/login?email=${formState.data.email}`)
    }
  }, [formState])

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-6">
              <Button variant="outline">
                <Icons.gitHub className="mr-2 h-4 w-4" />
                Github
              </Button>
              <Button variant="outline">
                <Icons.google className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <form action={formAction}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" required />
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create account
                </Button>
              </div>
            </form>
          </div>
          {formState?.error && (
            <p className="mt-4 text-red-500">{formState.error}</p>
          )}
          {formState?.data && (
            <p className="mt-4 text-red-500">{formState.data?.email}</p>
          )}

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline" prefetch={false}>
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src={placeholder}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
