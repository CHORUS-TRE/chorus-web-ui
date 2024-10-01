import { useEffect } from 'react'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'
import { useFormState, useFormStatus } from 'react-dom'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

import { authenticationLogin } from '../actions/authentication-login-view-model'
import { IFormState } from '../actions/utils'
import { useAuth } from '../auth-context'
import { Button } from '../ui/button'

const initialState: IFormState = {
  data: undefined,
  error: undefined,
  issues: undefined
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      className="w-full bg-accent text-accent-foreground hover:bg-accent"
      type="submit"
      disabled={pending}
    >
      Create account
    </Button>
  )
}

export default function LoginForm() {
  const searchParams = useSearchParams()!
  const [state, formAction] = useFormState(authenticationLogin, initialState)

  const { isAuthenticated, setAuthenticated } = useAuth()

  useEffect(() => {
    if (state.data) {
      const path = searchParams.get('redirect') || '/'
      setAuthenticated(true)
      redirect(path)
    }
  }, [state?.data, searchParams, setAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return

    redirect('/')
  }, [isAuthenticated])

  return (
    <div className="mx-auto grid w-[450px] gap-6 text-white">
      <div className="grid gap-2 text-center">
        <h2>Login</h2>
        <h5 className="text-muted">
          Enter your email below to login to your account
        </h5>
        {isAuthenticated && (
          <p className="mt-4 text-green-500">You are logged in</p>
        )}
      </div>
      <form action={formAction}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="username"
              type="input"
              name="username"
              required
              disabled={isAuthenticated}
              className="text-black"
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
              className="text-black"
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
        {state?.error && <p className="mt-4 text-red-500">{state?.error}</p>}
      </form>

      <p aria-live="polite" className="sr-only" role="status">
        {JSON.stringify(state, null, 2)}
      </p>
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <Link
        href="#"
        className="text-muted underline hover:text-accent"
        prefetch={false}
      >
        Forgot your password?
      </Link>
      <div className="mt-4 text-center text-sm text-muted">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="text-muted underline hover:text-accent"
          prefetch={false}
        >
          Register
        </Link>
      </div>
    </div>
  )
}
