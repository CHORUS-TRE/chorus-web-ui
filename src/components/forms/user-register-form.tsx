import { useEffect } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useFormState, useFormStatus } from 'react-dom'

import { userCreate } from '@/components/actions/user-view-model'

import { Icons } from '~/components/ui/icons'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

import { IFormState } from '../actions/utils'
import { Button } from '../ui/button'

const initialState: IFormState = {
  data: undefined,
  error: undefined,
  issues: undefined
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="ml-auto" type="submit" disabled={pending}>
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
      <form action={formAction}>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" required />
              <div className="text-xs text-red-500">
                {
                  state?.issues?.find((e) => e.path.includes('firstName'))
                    ?.message
                }
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" required />
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
            <Input id="email" type="email" name="email" required />
            <div className="text-xs text-red-500">
              {state?.issues?.find((e) => e.path.includes('email'))?.message}
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input id="password" type="password" name="password" required />
            <div className="text-xs text-red-500">
              {state?.issues?.find((e) => e.path.includes('password'))?.message}
            </div>
          </div>
          <SubmitButton />
        </div>
      </form>

      <p aria-live="polite" className="sr-only" role="status">
        {JSON.stringify(state, null, 2)}
      </p>
      {state?.error && <p className="text-red-500">{state.error}</p>}

      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="underline" prefetch={false}>
          Login
        </Link>
      </div>
    </div>
  )
}
