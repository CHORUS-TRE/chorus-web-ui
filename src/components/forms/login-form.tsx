'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useFormState, useFormStatus } from 'react-dom'

import { AuthenticationMode } from '@/domain/model'
import { AuthenticationModeType } from '@/domain/model/authentication'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { useToast } from '~/hooks/use-toast'

import {
  authenticationLogin,
  getAuthenticationModes,
  getOAuthUrl
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
  const router = useRouter()
  const searchParams = useSearchParams()!
  const [state, formAction] = useFormState(authenticationLogin, initialState)
  const [authModes, setAuthModes] = useState<AuthenticationMode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const { isAuthenticated, setAuthenticated, refreshUser } = useAuth()

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
    }
  }, [state?.data, setAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return

    const path = searchParams.get('redirect') || '/'
    window.location.href = path
  }, [isAuthenticated, searchParams])

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

  return (
    <div className="mx-auto grid w-[380px] gap-6 text-white">
      <div className="grid gap-4 text-center">
        <h2>Login</h2>
        <h5 className="text-muted">Login to your account</h5>
      </div>
      <Separator className="mb-4" />

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted" />
        </div>
      ) : (
        <>
          {/* Internal Login Form */}
          {authModes.some(
            (mode) =>
              mode.type === AuthenticationModeType.INTERNAL &&
              mode.internal?.enabled
          ) && (
            <>
              <div className="grid gap-4 text-center">
                <p className="text-muted">
                  Enter your email below to login to your account
                </p>
              </div>
              <form action={formAction}>
                <div className="mb-6 grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="username"
                      type="input"
                      name="username"
                      required
                      disabled={isAuthenticated}
                      className="border-none bg-background text-muted"
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
                      className="border-none bg-background text-muted"
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
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted">
                  Or continue with
                </span>
              </div>
            </div>
            {authModes
              .filter((mode) => mode.type === AuthenticationModeType.OPENID)
              .map((mode) => (
                <Button
                  key={mode.openid?.id}
                  variant="outline"
                  className="w-full justify-center gap-1 rounded-full text-sm transition-[gap] duration-500 ease-in-out hover:gap-2 focus:ring-2 focus:ring-accent"
                  onClick={() => handleOAuthLogin(mode)}
                >
                  {mode.openid?.id}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ))}
          </div>
        </>
      )}

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
    </div>
  )
}
