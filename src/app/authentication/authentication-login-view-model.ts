import AuthenticationRepositoryImpl from '@/data/repository/authentication-repository-impl'
import AuthenticationApiDataSourceImpl from '@/data/data-source/api/authentication-api-data-source-impl'
import { AuthenticationLogin } from '@/domain/use-cases/authentication/authentication-login'
import { useAuth } from '~/components/auth-context'

export default function authenticationLoginViewModel() {
  const { setAuthentication } = useAuth()

  const authenticationDataSource = new AuthenticationApiDataSourceImpl()
  const authenticationRepository = new AuthenticationRepositoryImpl(
    authenticationDataSource
  )
  const useCase = new AuthenticationLogin(authenticationRepository)

  const login = async (username: string, password: string) => {
    const response = await useCase.execute({ username, password })

    if (response?.error) throw new Error(response.error.message)
    if (response?.data) setAuthentication(response.data)

    return response?.data
  }

  return { login }
}
