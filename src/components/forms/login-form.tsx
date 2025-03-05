'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { env } from 'next-runtime-env'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useFormState, useFormStatus } from 'react-dom'

import { AuthenticationMode } from '@/domain/model'
import { AuthenticationModeType } from '@/domain/model/authentication'

import { Button } from '~/components/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { useToast } from '~/hooks/use-toast'

import {
  authenticationLogin,
  getAuthenticationModes,
  getOAuthUrl,
  getSession
} from '../actions/authentication-view-model'
import { IFormState } from '../actions/utils'
import { useAuth } from '../store/auth-context'

const initialState: IFormState = {
  data: undefined,
  error: undefined,
  issues: undefined
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-1 rounded-full bg-accent text-sm text-black transition-[gap] duration-500 ease-in-out hover:gap-2 hover:bg-accent-background focus:bg-accent-background focus:ring-2 focus:ring-accent"
    >
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ArrowRight className="mr-2 h-4 w-4" />
      )}
      Login
    </Button>
  )
}

export default function LoginForm() {
  const searchParams = useSearchParams()!
  const [state, formAction] = useFormState(authenticationLogin, initialState)
  const [authModes, setAuthModes] = useState<AuthenticationMode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const { isAuthenticated, setAuthenticated } = useAuth()

  useEffect(() => {
    const fetchAuthModes = async () => {
      try {
        const response = await getAuthenticationModes()
        setAuthModes(response.data || [])
      } catch (error) {
        toast({
          title: "Couldn't load authentication methods",
          description: 'Please try again later',
          variant: 'destructive',
          duration: 1000
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAuthModes()
  }, [])

  useEffect(() => {
    if (state.data) {
      setAuthenticated(true)

      const checkAuthOnBackend = async () => {
        // Authenticate on backend to set the session cookie
        // const session = await getSession()
        // if (session) {
        //   const authOnBackend = await fetch(
        //     `${env('NEXT_PUBLIC_DATA_SOURCE_API_URL')}/authentication/refresh-token`,
        //     {
        //       method: 'POST',
        //       headers: {
        //         Authorization: `Bearer ${session}`
        //       }
        //     }
        //   )

        //   const data = await authOnBackend.json()
        //   console.log('Session cookie set', data)

        //   const testCookie = await fetch(
        //     `${env('NEXT_PUBLIC_DATA_SOURCE_API_URL')}/workspaces`,
        //     {
        //       headers: {
        //         Authorization: `Bearer ${data.result.token}`
        //       }
        //     }
        //   )

        // const data2 = await testCookie.json()
        // console.log('Test cookie', data2)

        // Get the redirect path and validate it
        const redirectPath = searchParams.get('redirect') || '/'
        // Ensure the redirect URL is relative and doesn't contain protocol/domain
        const isValidRedirect =
          redirectPath.startsWith('/') && !redirectPath.includes('//')

        // Redirect to the validated path or fallback to home
        window.location.href = isValidRedirect ? redirectPath : '/'
        // }
      }

      checkAuthOnBackend()
    }
  }, [state?.data, setAuthenticated])

  const handleOAuthLogin = async (mode: AuthenticationMode) => {
    if (mode.openid?.id) {
      const response = await getOAuthUrl(mode.openid.id)
      if (response.error) {
        toast({
          title: "Couldn't initiate login",
          description: response.error,
          variant: 'destructive',
          duration: 1000
        })
        return
      }

      if (response.data) {
        const url = new URL(response.data)
        const currentState = url.searchParams.get('state') || ''
        url.searchParams.set('state', `${currentState}:${mode.openid.id}`)
        window.location.href = url.toString()
      }
    }
  }

  const error = searchParams.get('error')
  if (error) {
    toast({
      title: 'Authentication Error',
      description: error,
      variant: 'destructive',
      duration: 1000
    })
  }

  const internalLogin = authModes.some(
    (mode) =>
      mode.type === AuthenticationModeType.INTERNAL && mode.internal?.enabled
  )

  return (
    <div className="mx-auto grid w-full min-w-60 gap-6 text-white">
      <div className="grid gap-4 text-center">
        <h2>Login</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
        </div>
      ) : (
        <>
          {/* Internal Login Form */}
          {internalLogin && (
            <>
              <div className="grid gap-4 text-center">
                <p className="text-muted">
                  Enter your email below to login to your account
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  formAction(formData)
                }}
              >
                <div className="mb-6 grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="username"
                      type="input"
                      name="username"
                      required
                      disabled={isAuthenticated}
                      className="border border-muted/40 bg-background text-white"
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
                      className="border border-muted/40 bg-background text-muted"
                      required
                      autoComplete="current-password"
                      disabled={isAuthenticated}
                    />
                  </div>
                </div>
                <SubmitButton />
                {state?.error && (
                  <p className="mt-4 text-red-500">{state?.error}</p>
                )}
              </form>
            </>
          )}

          {/* OAuth Providers */}
          <div className="grid gap-4">
            {authModes.length > 0 && (
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted">
                    {internalLogin
                      ? 'Or choose an account'
                      : 'Choose an account'}
                  </span>
                </div>
              </div>
            )}
            {authModes
              .filter((mode) => mode.type === AuthenticationModeType.OPENID)
              .map((mode) => (
                <Button
                  key={mode.openid?.id}
                  className="w-full justify-center"
                  onClick={() => handleOAuthLogin(mode)}
                >
                  {mode.openid?.id}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ))}
          </div>
        </>
      )}

      {internalLogin && (
        <div className="mt-4 text-center text-sm text-white">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-muted underline hover:text-accent"
            prefetch={false}
          >
            Register
          </Link>
        </div>
      )}
    </div>
  )
}
