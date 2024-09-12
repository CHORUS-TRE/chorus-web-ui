/**
 * @jest-environment jsdom
 */
import { UserApiDataSourceImpl } from '~/data/data-source/chorus-api'
import { UserRepositoryImpl } from '~/data/repository'
import { User } from '~/domain/model/'
import { UserMe } from '~/domain/use-cases/user/user-me'
import { ChorusUser as UserApi } from '~/internal/client'

import '@testing-library/jest-dom'

const MOCK_USER_API_RESPONSE = {
  id: '1',
  firstName: 'Albert',
  lastName: 'Levert',
  username: 'albert@chuv.ch',
  status: 'active',
  roles: ['admin'],
  totpEnabled: true,
  createdAt: new Date('2023-10-01T00:00:00Z'),
  updatedAt: new Date('2023-10-01T00:00:00Z'),
  passwordChanged: true
} as UserApi

const { username, ...rest } = MOCK_USER_API_RESPONSE
const MOCK_USER_RESULT = {
  ...rest,
  email: username
} as User

describe('UserUseCases', () => {
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
    const dataSource = new UserApiDataSourceImpl(session)
    const repository = new UserRepositoryImpl(dataSource)
    const useCase = new UserMe(repository)

    const response = await useCase.execute()
    expect(response.error).toBeUndefined()

    const user = response.data
    expect(user).toBeDefined()
    expect(user).toMatchObject(MOCK_USER_RESULT)
  })
})
