'use server'

import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { AuthenticationApiDataSourceImpl } from '@/data/data-source/chorus-api'
import { AuthenticationRepositoryImpl } from '@/data/repository'
import {
  AuthenticationModesResponse,
  AuthenticationOAuthRedirectRequest,
  AuthenticationOAuthRedirectResponse,
  AuthenticationOAuthResponse
} from '@/domain/model'
import {
  AuthenticationGetModes,
  AuthenticationGetOAuthUrl,
  AuthenticationLogin,
  AuthenticationOAuthRedirect
} from '@/domain/use-cases'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function authenticationLogin(prevState: any, formData: FormData) {
  const dataSource = new AuthenticationApiDataSourceImpl()
  const repository = new AuthenticationRepositoryImpl(dataSource)
  const useCase = new AuthenticationLogin(repository)

  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const login = await useCase.execute({ email: username, password })

  if (login.error)
    return {
      ...prevState,
      error: login.error
    }

  if (!login.data)
    return {
      ...prevState,
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
    data: login.data
  }
}

export async function getAuthenticationModes(): Promise<AuthenticationModesResponse> {
  try {
    const dataSource = new AuthenticationApiDataSourceImpl()
    const repository = new AuthenticationRepositoryImpl(dataSource)
    const useCase = new AuthenticationGetModes(repository)

    return await useCase.execute()
  } catch (error) {
    console.error('Error fetching auth modes:', error)
    return { error: 'Failed to fetch authentication modes' }
  }
}

export async function logout() {
  // Destroy the session
  await cookies().set('session', '', { expires: new Date(0) })
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  if (!session) return

  // Refresh the session so it doesn't expire
  const expires = new Date(Date.now() + 5 * 1000)
  const res = NextResponse.next()
  res.cookies.set({
    name: 'session',
    value: session,
    httpOnly: true,
    expires
  })

  return res
}

export async function getOAuthUrl(
  id: string
): Promise<AuthenticationOAuthResponse> {
  try {
    const dataSource = new AuthenticationApiDataSourceImpl()

    const repository = new AuthenticationRepositoryImpl(dataSource)
    const useCase = new AuthenticationGetOAuthUrl(repository)

    return await useCase.execute(id)
  } catch (error) {
    console.error('Error getting OAuth URL:', error)
    return { error: 'Failed to get OAuth URL' }
  }
}

export async function handleOAuthRedirect(
  data: AuthenticationOAuthRedirectRequest
): Promise<AuthenticationOAuthRedirectResponse> {
  try {
    const dataSource = new AuthenticationApiDataSourceImpl()
    const repository = new AuthenticationRepositoryImpl(dataSource)
    const useCase = new AuthenticationOAuthRedirect(repository)

    const response = await useCase.execute(data)

    if (response.error) {
      return response
    }

    if (!response.data) {
      return { error: 'No token received' }
    }

    if (!response.data) {
      throw new Error('No token received')
    }

    cookies().set('session', response.data || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // One week
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Error handling OAuth redirect:', error)
    return { error: 'Failed to handle OAuth redirect' }
  }
}
