/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { AuthenticationApiDataSourceImpl } from '~/data/data-source/chorus-api'
import { AuthenticationRepositoryImpl } from '~/data/repository'
import { AuthenticationLogin } from '~/domain/use-cases/authentication/authentication-login'

const MOCK_LOGIN_API_RESPONSE = {
  token: '2'
}

const MOCK_AUTHN_RESULT = MOCK_LOGIN_API_RESPONSE.token

describe('AuthenticationLoginUseCase', () => {
  it('should login a user', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            result: MOCK_LOGIN_API_RESPONSE
          }),
        status: 200,
        ok: true
      })
    ) as jest.Mock

    const dataSource = new AuthenticationApiDataSourceImpl()
    const repository = new AuthenticationRepositoryImpl(dataSource)
    const useCase = new AuthenticationLogin(repository)

    const response = await useCase.execute({
      email: 'albert.levert@chuv.ch',
      password: 'password123'
    })
    expect(response.error).toBeUndefined()

    const user = response.data
    expect(user).toBeDefined()
    expect(user).toEqual(MOCK_AUTHN_RESULT)
  })
})
