/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'

import { UserApiDataSourceImpl } from '~/data/data-source/chorus-api/user-data-source'
import { UserRepositoryImpl } from '~/data/repository/user-repository-impl'
import { User, UserCreateType } from '~/domain/model/'
import { UserCreate } from '~/domain/use-cases/user/user-create'
import { UserGet } from '~/domain/use-cases/user/user-get'
import { UserMe } from '~/domain/use-cases/user/user-me'
import { ChorusUser as ChorusUserApi } from '~/internal/client'

const MOCK_USER_API_RESPONSE = {
  id: '1',
  firstName: 'Albert',
  lastName: 'Levert',
  username: 'albert@chuv.ch',
  source: 'chorus',
  status: 'active',
  roles: ['admin'],
  totpEnabled: true,
  createdAt: new Date('2023-10-01T00:00:00Z'),
  updatedAt: new Date('2023-10-01T00:00:00Z'),
  passwordChanged: true,
  source: 'chorus'
} as ChorusUserApi

const { username, ...rest } = MOCK_USER_API_RESPONSE
const MOCK_USER_RESULT = {
  ...rest,
  username: username
} as User

const MOCK_USER_CREATE_MODEL = {
  username: 'new.user@example.com',
  password: 'securePassword123',
  firstName: 'New',
  lastName: 'User'
} as UserCreateType

const MOCK_NEW_USER_API_RESPONSE = {
  id: '2',
  firstName: 'New',
  lastName: 'User',
  username: 'new.user@example.com',
  source: 'chorus',
  status: 'active',
  roles: [],
  totpEnabled: false,
  createdAt: new Date('2025-06-18T20:24:31.912Z'),
  updatedAt: new Date('2025-06-18T20:24:31.912Z'),
  passwordChanged: false,
  source: 'chorus'
} as ChorusUserApi

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

  it('should get a user by id', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            result: {
              user: MOCK_USER_API_RESPONSE
            }
          }),
        status: 200,
        ok: true
      })
    ) as jest.Mock

    const session = 'empty'
    const dataSource = new UserApiDataSourceImpl(session)
    const repository = new UserRepositoryImpl(dataSource)
    const useCase = new UserGet(repository)

    const response = await useCase.execute('1')
    expect(response.error).toBeUndefined()

    const user = response.data
    expect(user).toBeDefined()
    expect(user).toMatchObject(MOCK_USER_RESULT)
  })

  it('should create a new user', async () => {
    let requestCounter = 0
    global.fetch = jest.fn((url, options) => {
      requestCounter++

      if (requestCounter === 1) {
        expect(options?.method).toBe('POST')
        return Promise.resolve({
          json: () => Promise.resolve({ result: { id: '2' } }),
          status: 201,
          ok: true
        })
      } else if (requestCounter === 2) {
        const method = options?.method || 'GET'
        expect(method).toBe('GET')
        expect(url).toContain('/users/2')
        return Promise.resolve({
          json: () =>
            Promise.resolve({ result: { user: MOCK_NEW_USER_API_RESPONSE } }),
          status: 200,
          ok: true
        })
      }
      return Promise.reject(new Error('Unexpected request'))
    }) as jest.Mock

    const session = 'empty'
    const dataSource = new UserApiDataSourceImpl(session)
    const repository = new UserRepositoryImpl(dataSource)
    const useCase = new UserCreate(repository)

    const response = await useCase.execute(MOCK_USER_CREATE_MODEL)
    expect(response.error).toBeUndefined()

    const user = response.data
    expect(user).toBeDefined()
    expect(user?.id).toBe('2')
    expect(user?.username).toBe(MOCK_USER_CREATE_MODEL.username)
  })
})

describe('UserApiDataSourceImpl', () => {
  const session = 'empty'
  let dataSource: UserApiDataSourceImpl

  beforeEach(() => {
    // Reset mock before each test
    jest.clearAllMocks()
    dataSource = new UserApiDataSourceImpl(session)
  })

  describe('me', () => {
    it('should successfully get the current user', async () => {
      // Setup mock for me request
      global.fetch = jest.fn().mockImplementationOnce(() =>
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

      const result = await dataSource.me()

      expect(result).toEqual({ result: { me: MOCK_USER_API_RESPONSE } })
      expect(global.fetch).toHaveBeenCalledTimes(1)

      // Verify that correct path and method are used
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0]
      expect(url).toContain('/users/me')
      // Check if method is GET or undefined (default is GET)
      const getMethod = options?.method || 'GET'
      expect(getMethod).toBe('GET')
    })

    it('should throw error when API response is empty', async () => {
      // Setup mock for failed me request
      global.fetch = jest.fn().mockImplementationOnce(() => {
        return Promise.reject(
          new Error(
            'The request failed and the interceptors did not return an alternative response'
          )
        )
      })

      await expect(dataSource.me()).rejects.toThrow(
        'The request failed and the interceptors did not return an alternative response'
      )
    })
  })

  describe('get', () => {
    it('should successfully get a user by id', async () => {
      // Setup mock for get user request
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              result: {
                user: MOCK_USER_API_RESPONSE
              }
            }),
          status: 200,
          ok: true
        })
      ) as jest.Mock

      const result = await dataSource.get('1')

      expect(result).toEqual({ result: { user: MOCK_USER_API_RESPONSE } })
      expect(global.fetch).toHaveBeenCalledTimes(1)

      // Verify that correct path and method are used
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0]
      expect(url).toContain('/users/1')
      // Check if method is GET or undefined (default is GET)
      const getMethod = options?.method || 'GET'
      expect(getMethod).toBe('GET')
    })

    it('should throw error when API response is empty', async () => {
      // Setup mock for failed get request
      global.fetch = jest.fn().mockImplementationOnce(() => {
        return Promise.reject(
          new Error(
            'The request failed and the interceptors did not return an alternative response'
          )
        )
      })

      await expect(dataSource.get('1')).rejects.toThrow(
        'The request failed and the interceptors did not return an alternative response'
      )
    })
  })

  describe('create', () => {
    it('should successfully create a user', async () => {
      // Setup mock for create user request
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              result: { id: '2' }
            }),
          status: 201,
          ok: true
        })
      ) as jest.Mock

      const result = await dataSource.create(MOCK_USER_CREATE_MODEL)

      expect(result).toEqual({ result: { id: '2' } })
      expect(global.fetch).toHaveBeenCalledTimes(1)

      // Verify that correct path and method are used
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0]
      expect(url).toContain('/users')
      expect(options.method).toBe('POST')

      // Verify request body contains correct data
      const body = JSON.parse(options.body)
      expect(body).toHaveProperty('username', MOCK_USER_CREATE_MODEL.username)
      expect(body).toHaveProperty('password', MOCK_USER_CREATE_MODEL.password)
      expect(body).toHaveProperty('firstName', MOCK_USER_CREATE_MODEL.firstName)
      expect(body).toHaveProperty('lastName', MOCK_USER_CREATE_MODEL.lastName)
    })

    it('should throw error when API response is empty', async () => {
      // Setup mock for failed create request
      global.fetch = jest.fn().mockImplementationOnce(() => {
        return Promise.reject(
          new Error(
            'The request failed and the interceptors did not return an alternative response'
          )
        )
      })

      await expect(dataSource.create(MOCK_USER_CREATE_MODEL)).rejects.toThrow(
        'The request failed and the interceptors did not return an alternative response'
      )
    })
  })
})
