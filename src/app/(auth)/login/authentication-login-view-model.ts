'use server'

import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { AuthenticationRepositoryImpl } from '@/data/repository'
import { AuthenticationLogin } from '@/domain/use-cases/authentication/authentication-login'

import { AuthenticationApiDataSourceImpl } from '~/data/data-source/chorus-api'
import { AuthenticationLocalStorageDataSourceImpl } from '~/data/data-source/local-storage/authentication-local-storage-data-source-impl'
import { env } from '~/env'

export async function authenticationLogin(prevState: any, formData: FormData) {
  const dataSource =
    env.DATA_SOURCE === 'local'
      ? await AuthenticationLocalStorageDataSourceImpl.getInstance(
          env.DATA_SOURCE_LOCAL_DIR
        )
      : new AuthenticationApiDataSourceImpl()
  const repository = new AuthenticationRepositoryImpl(dataSource)
  const useCase = new AuthenticationLogin(repository)

  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const login = await useCase.execute({ email: username, password })

  if (login.error)
    return {
      ...prevState,
      data: undefined,
      error: login.error
    }

  if (!login.data)
    return {
      ...prevState,
      data: undefined,
      error: 'Something went wrong, please try again'
    }

  cookies().set('session', login.data, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/'
  })

  return {
    ...prevState,
    data: login.data,
    error: undefined
  }
}

export async function getSession() {
  const session = cookies().get('session')?.value
  if (!session) return null

  return session
}

export async function logout() {
  // Destroy the session
  await cookies().set('session', '', { expires: new Date(0) })
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
