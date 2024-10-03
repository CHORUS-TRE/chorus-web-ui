import { useEffect } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useFormState, useFormStatus } from 'react-dom'

import { userCreate } from '@/components/actions/user-view-model'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

import { IFormState } from '../actions/utils'
import { Button } from '../button'

const initialState: IFormState = {
  data: undefined,
  error: undefined,
  issues: undefined
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      <ArrowRight className="h-3.5 w-3.5" />
      Create account
    </Button>
  )
}

export default function UserRegisterForm() {
  const [state, formAction] = useFormState(userCreate, initialState)

  useEffect(() => {
    if (state?.data && !state.error) {
      redirect(`/login?email=${state.data}`)
    }
  }, [state])

  return (
    <div className="mx-auto grid w-[450px] gap-6 text-white">
      <div className="grid gap-2 text-center">
        <h2>Create an account</h2>
        <h5 className="text-muted">
          Enter your email below to create your account
        </h5>
      </div>
      <form action={formAction}>
        <div className="mb-4 grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                name="firstName"
                required
                className="bg-background text-neutral-400"
              />
              <div className="text-xs text-red-500">
                {
                  state?.issues?.find((e) => e.path.includes('firstName'))
                    ?.message
                }
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                name="lastName"
                required
                className="bg-background text-neutral-400"
              />
              <div className="text-xs text-red-500">
                {
                  state?.issues?.find((e) => e.path.includes('lastName'))
                    ?.message
                }
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              required
              className="bg-background text-neutral-400"
            />
            <div className="text-xs text-red-500">
              {state?.issues?.find((e) => e.path.includes('email'))?.message}
            </div>
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
              className="bg-background text-neutral-400"
              autoComplete="new-password"
            />
            <div className="text-xs text-red-500">
              {state?.issues?.find((e) => e.path.includes('password'))?.message}
            </div>
          </div>
        </div>
        <SubmitButton />
      </form>

      <p aria-live="polite" className="sr-only" role="status">
        {JSON.stringify(state, null, 2)}
      </p>
      {state?.error && <p className="text-red-500">{state.error}</p>}

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
