'use client'

import { ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'

import { createUser } from '@/components/actions/user-view-model'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { Result, User } from '~/domain/model'

const initialState: Result<User> = {
  data: undefined,
  issues: undefined
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-1"
    >
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ArrowRight className="mr-2 h-4 w-4" />
      )}
      Create account
    </Button>
  )
}

export default function UserRegisterForm() {
  const [state, formAction, isPending] = useActionState(
    createUser,
    initialState
  )

  useEffect(() => {
    if (state.data?.id && !state.message?.includes('fail')) {
      redirect(`/login?username=${state.data.username}`)
    }
  }, [state])

  return (
    <div className="mx-auto grid w-full min-w-60 gap-6 text-white">
      <div className="grid gap-4 text-center">
        <h2>Create an account</h2>
        <h5 className="text-muted">
          Enter your username below to create your account
        </h5>
      </div>
      <Separator className="mb-1" />
      <form action={formAction}>
        <div className="mb-4 grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                disabled={isPending}
                id="firstName"
                name="firstName"
                defaultValue={state.data?.firstName}
                required
                className="border border-muted/40 bg-background text-white"
                autoComplete="given-name"
              />
              <div className="text-xs text-red-500">
                {
                  state.issues?.find((e) => e.path.includes('firstName'))
                    ?.message
                }
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                disabled={isPending}
                id="lastName"
                name="lastName"
                required
                defaultValue={state.data?.lastName}
                className="border border-muted/40 bg-background text-white"
                autoComplete="family-name"
              />
              <div className="text-xs text-red-500">
                {
                  state.issues?.find((e) => e.path.includes('lastName'))
                    ?.message
                }
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">username</Label>
            <Input
              disabled={isPending}
              id="username"
              type="username"
              name="username"
              defaultValue={state.data?.username}
              required
              className="border border-muted/40 bg-background text-white"
              autoComplete="username"
            />
            <div className="text-xs text-red-500">
              {state.issues?.find((e) => e.path.includes('username'))?.message}
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              disabled={isPending}
              id="password"
              type="password"
              name="password"
              required
              className="border border-muted/40 bg-background text-white"
              autoComplete="new-password"
            />
            <div className="text-xs text-red-500">
              {state.issues?.find((e) => e.path.includes('password'))?.message}
            </div>
          </div>
        </div>
        <SubmitButton />
      </form>

      <p aria-live="polite" className="sr-only" role="status">
        {state.error}
      </p>
      {state.error && <p className="text-red-500">{state.error}</p>}

      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-muted underline hover:text-accent"
          prefetch={false}
        >
          Login
        </Link>
      </div>
    </div>
  )
}
