import { AuthenticationRepositoryImpl } from '@/data/repository'
import { AuthenticationApiDataSourceImpl } from '@/data/data-source/api'
import { AuthenticationLogin } from '@/domain/use-cases/authentication/authentication-login'
import { useAuth } from '~/components/auth-context'

export default function authenticationLoginViewModel() {
  const { setAuthentication } = useAuth()

  const dataSource = new AuthenticationApiDataSourceImpl()
  const repository = new AuthenticationRepositoryImpl(dataSource)
  const useCase = new AuthenticationLogin(repository)

  const login = async (username: string, password: string) => {
    const { data, error } = await useCase.execute({ username, password })

    if (error) throw error
    if (data) setAuthentication(data)

    return data
  }

  return { login }
}
