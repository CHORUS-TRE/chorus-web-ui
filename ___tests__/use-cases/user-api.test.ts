/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { UserRepositoryImpl } from '~/data/repository'
import { UserMe } from '~/domain/use-cases/user/user-me'
import { User } from '~/domain/model/'
import { ChorusUser as UserApi } from '~/internal/client'

const MOCK_USER_API_RESPONSE = {
  id: '1',
  firstName: 'Albert',
  lastName: 'Levert',
  username: 'albert',
  status: 'active',
  roles: ['admin'],
  totpEnabled: true,
  createdAt: new Date('2023-10-01T00:00:00Z'),
  updatedAt: new Date('2023-10-01T00:00:00Z'),
  passwordChanged: true
} as UserApi

const MOCK_USER_RESULT = {
  ...MOCK_USER_API_RESPONSE,
  roles: ['admin']
} as User

describe('UserMeUseCase', () => {
  it('should get the current user', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            result: {
              me: MOCK_USER_API_RESPONSE
            }
          }),
        status: 200,
        ok: true
      })
    ) as jest.Mock

    const session = 'empty'
    const repository = new UserRepositoryImpl(session)
    const useCase = new UserMe(repository)

    const response = await useCase.execute()
    expect(response.error).toBeNull()

    const user = response.data
    expect(user).toBeDefined()
    expect(user).toMatchObject(MOCK_USER_RESULT)
  })
})
