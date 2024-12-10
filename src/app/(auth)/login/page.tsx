'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import { handleOAuthToken } from '@/components/actions/authentication-view-model'

import LoginForm from '~/components/forms/login-form'
import { useAuth } from '~/components/store/auth-context'

export default function Login() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const { setAuthenticated } = useAuth()

  useEffect(() => {
    if (token) {
      handleOAuthToken(token).then(() => {
        setAuthenticated(true)
      })
    }
  }, [token, setAuthenticated])

  return <LoginForm />
}
