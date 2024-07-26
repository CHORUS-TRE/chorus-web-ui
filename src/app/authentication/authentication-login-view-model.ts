'use server'

import { AuthenticationRepositoryImpl } from '@/data/repository'
import { AuthenticationApiDataSourceImpl } from '@/data/data-source/api'
import { AuthenticationLogin } from '@/domain/use-cases/authentication/authentication-login'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function authenticationLoginViewModel(
  prevState: any,
  formData: FormData
) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const dataSource = new AuthenticationApiDataSourceImpl()
  const repository = new AuthenticationRepositoryImpl(dataSource)
  const useCase = new AuthenticationLogin(repository)

  const { data, error } = await useCase.execute({ username, password })

  if (error)
    return {
      ...prevState,
      data: error.message
    }

  if (!data)
    return {
      ...prevState,
      data: 'No token received'
    }

  cookies().set('session', data, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/'
  })

  return {
    ...prevState,
    data: true
  }
}

export async function getSession() {
  const session = cookies().get('session')?.value
  if (!session) return null

  return session
}

export async function logout() {
  // Destroy the session
  cookies().set('session', '', { expires: new Date(0) })
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  if (!session) return

  // Refresh the session so it doesn't expire
  const expires = new Date(Date.now() + 10 * 1000)
  const res = NextResponse.next()
  res.cookies.set({
    name: 'session',
    value: session,
    httpOnly: true,
    expires
  })

  return res
}
