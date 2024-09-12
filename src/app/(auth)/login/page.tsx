'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'
import { useFormState } from 'react-dom'

import { authenticationLogin } from '@/components/actions/authentication-login-view-model'

import { useAuth } from '~/components/auth-context'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

import placeholder from '/public/login.png'

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
    <div className="border-slate-600 bg-slate-900  bg-opacity-85 lg:grid lg:grid-cols-[2fr_1fr]">
      <div className="flex items-center justify-center py-12">
        <form action={formAction}>
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center text-muted">
              <h3 className="mb-4">Welcome to CHORUS!</h3>
              <h1 className="text-3xl font-bold text-muted">Login</h1>
              <p className="text-balance text-muted">
                Enter your email below to login to your account
              </p>
              {isAuthenticated && (
                <p className="mt-4 text-green-500">You are logged in</p>
              )}
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-muted">
                  Email
                </Label>
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
                  <Label htmlFor="password" className="text-muted">
                    Password
                  </Label>
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
                variant="link"
                className="w-full bg-accent text-accent-foreground hover:bg-accent"
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
              className="ml-auto inline-block text-sm text-muted underline"
              prefetch={false}
            >
              Forgot your password?
            </Link>
            <div className="mt-4 text-center text-sm text-muted">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-muted-foreground underline"
                prefetch={false}
              >
                Register
              </Link>
            </div>
          </div>
        </form>
      </div>
      <div className="hidden bg-opacity-0 bg-cover bg-center lg:block ">
        <Image
          src={placeholder}
          alt="Image"
          className="bg-cover bg-center dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
