'use client'

import { env } from 'next-runtime-env'

import { AuthenticationApiDataSourceImpl } from '@/data/data-source'
import { AuthenticationRepositoryImpl } from '@/data/repository'
import {
  AuthenticationGetModes,
  AuthenticationGetOAuthUrl,
  AuthenticationLogin,
  AuthenticationLogout,
  AuthenticationOAuthRedirect
} from '@/domain/use-cases'
import {
  AuthenticationMode,
  AuthenticationOAuthRedirectRequest,
  Result
} from '~/domain/model'

const getRepository = async (token?: string) => {
  const dataSource = new AuthenticationApiDataSourceImpl(
    env('NEXT_PUBLIC_DATA_SOURCE_API_URL') || '',
    token
  )

  return new AuthenticationRepositoryImpl(dataSource)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function login(prevState: any, formData: FormData) {
  const repository = await getRepository()
  const useCase = new AuthenticationLogin(repository)

  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const login = await useCase.execute({ username: username, password })

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

  sessionStorage.setItem('token', login.data)

  return {
    ...prevState,
    error: login.error,
    data: login.data
  }
}

export async function getToken() {
  const token = sessionStorage.getItem('token') || undefined
  return token
}

export async function getAuthenticationModes(): Promise<
  Result<AuthenticationMode[]>
> {
  try {
    const repository = await getRepository()
    const useCase = new AuthenticationGetModes(repository)

    return await useCase.execute()
  } catch (error) {
    console.error({ error })
    return { error: 'Failed to fetch authentication modes' }
  }
}

export async function logout() {
  try {
    const token = await getToken()
    const repository = await getRepository(token)
    const useCase = new AuthenticationLogout(repository)

    const result = await useCase.execute()

    if (result.error) {
      console.error('Error during logout:', result.error)
    }
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

export async function getOAuthUrl(id: string): Promise<Result<string>> {
  try {
    const repository = await getRepository()

    const useCase = new AuthenticationGetOAuthUrl(repository)

    return await useCase.execute(id)
  } catch (error) {
    console.error('Error getting OAuth URL:', error)
    return { error: 'Failed to get OAuth URL' }
  }
}

export async function handleOAuthRedirect(
  data: AuthenticationOAuthRedirectRequest
): Promise<Result<string>> {
  try {
    const repository = await getRepository()
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

    return response
  } catch (error) {
    console.error('Error handling OAuth redirect:', error)
    return { error: 'Failed to handle OAuth redirect' }
  }
}
