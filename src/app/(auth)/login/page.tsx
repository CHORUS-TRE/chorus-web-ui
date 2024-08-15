'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useFormState } from 'react-dom'

import { authenticationLogin } from '@/components/actions/authentication-login-view-model'

import { useAuth } from '~/components/auth-context'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

import placeholder from '/public/placeholder.svg'

export default function Login() {
  const searchParams = useSearchParams()!
  const [formState, formAction] = useFormState(authenticationLogin, {
    data: null,
    error: null
  })
  const { isAuthenticated, setAuthenticated } = useAuth()

  useEffect(() => {
    if (formState.data) {
      const path = searchParams.get('redirect') || '/'
      setAuthenticated(true)
      redirect(path)
    }
  }, [formState?.data, searchParams, setAuthenticated])

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <form action={formAction}>
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p>
              {isAuthenticated && (
                <p className="mt-4 text-green-500">You are logged in</p>
              )}
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="username"
                  type="input"
                  name="username"
                  required
                  disabled={isAuthenticated}
                  defaultValue={searchParams.get('email') || ''}
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
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isAuthenticated}
              >
                Login
              </Button>
            </div>
            {formState.error && (
              <p className="mt-4 text-red-500">{formState.error}</p>
            )}
            <Link
              href="#"
              className="ml-auto inline-block text-sm underline"
              prefetch={false}
            >
              Forgot your password?
            </Link>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="underline" prefetch={false}>
                Register
              </Link>
            </div>
          </div>
        </form>
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
