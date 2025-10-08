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

const getRepository = async () => {
  const dataSource = new AuthenticationApiDataSourceImpl(
    env('NEXT_PUBLIC_API_URL') || ''
  )

  return new AuthenticationRepositoryImpl(dataSource)
}

export async function login(
  prevState: Result<string>,
  formData: FormData
): Promise<Result<string>> {
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

  return {
    ...prevState,
    data: login.data
  }
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
    const repository = await getRepository()
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

    await new Promise((resolve) => setTimeout(resolve, 2 * 1000))

    return response
  } catch (error) {
    console.error('Error handling OAuth redirect:', error)
    return { error: 'Failed to handle OAuth redirect' }
  }
}
