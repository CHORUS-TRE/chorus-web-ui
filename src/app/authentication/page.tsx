'use client'

import { authenticationLoginViewModel } from './authentication-login-view-model'
import Link from 'next/link'
import { useFormState } from 'react-dom'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { useEffect } from 'react'
import { useAuth } from '~/components/auth-context'
import { redirect } from 'next/navigation'

export default function Login() {
  const [formState, formAction] = useFormState(authenticationLoginViewModel, {
    data: null
  })
  const { isAuthenticated, setAuthenticated } = useAuth()

  useEffect(() => {
    if (formState.data === true) {
      setAuthenticated(true)
      redirect('/')
    }
  }, [formState.data])

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <form action={formAction}>
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your username below to login to your account
              </p>
              {isAuthenticated && (
                <p className="mt-4 text-green-500">You are logged in</p>
              )}
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="username"
                  type="input"
                  name="username"
                  required
                  disabled={isAuthenticated}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  disabled={isAuthenticated}
                />
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                  prefetch={false}
                >
                  Forgot your password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isAuthenticated}
              >
                Login
              </Button>
            </div>
            {formState && <p className="mt-4 text-red-500">{formState.data}</p>}

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="#" className="underline" prefetch={false}>
                Register
              </Link>
            </div>
          </div>
        </form>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
