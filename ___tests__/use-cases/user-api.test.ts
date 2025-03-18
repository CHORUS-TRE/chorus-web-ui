/**
 * @jest-environment jsdom
 */
import { UserApiDataSourceImpl } from '~/data/data-source/chorus-api'
import { UserRepositoryImpl } from '~/data/repository'
import { User, UserCreateModel } from '~/domain/model/'
import { UserMe } from '~/domain/use-cases/user/user-me'
import { UserGet } from '~/domain/use-cases/user/user-get'
import { UserCreate } from '~/domain/use-cases/user/user-create'
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

const MOCK_USER_CREATE_MODEL = {
  email: 'new.user@example.com',
  password: 'securePassword123',
  firstName: 'New',
  lastName: 'User'
} as UserCreateModel

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
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            result: { id: '2' }
          }),
        status: 201,
        ok: true
      })
    ) as jest.Mock

    const session = 'empty'
    const dataSource = new UserApiDataSourceImpl(session)
    const repository = new UserRepositoryImpl(dataSource)
    const useCase = new UserCreate(repository)

    const response = await useCase.execute(MOCK_USER_CREATE_MODEL)
    expect(response.error).toBeUndefined()

    const userId = response.data
    expect(userId).toBe('2')
  })
})

describe('UserApiDataSourceImpl', () => {
  const session = 'empty';
  let dataSource: UserApiDataSourceImpl;

  beforeEach(() => {
    // Reset mock before each test
    jest.clearAllMocks();
    dataSource = new UserApiDataSourceImpl(session);
  });

  describe('me', () => {
    it('should successfully get the current user', async () => {
      // Setup mock for me request
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            result: {
              me: MOCK_USER_API_RESPONSE
            }
          }),
          status: 200,
          ok: true
        })
      ) as jest.Mock;

      const result = await dataSource.me();

      expect(result).toMatchObject(MOCK_USER_RESULT);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Verify that correct path and method are used
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
      expect(url).toContain('/users/me');
      // Check if method is GET or undefined (default is GET)
      const getMethod = options?.method || 'GET';
      expect(getMethod).toBe('GET');
    });

    it('should throw error when API response is empty', async () => {
      // Setup mock for failed me request
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            result: { me: null }
          }),
          status: 200,
          ok: true
        })
      ) as jest.Mock;

      await expect(dataSource.me()).rejects.toThrow('Error fetching user');
    });
  });

  describe('get', () => {
    it('should successfully get a user by id', async () => {
      // Setup mock for get user request
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            result: {
              user: MOCK_USER_API_RESPONSE
            }
          }),
          status: 200,
          ok: true
        })
      ) as jest.Mock;

      const result = await dataSource.get('1');

      expect(result).toMatchObject(MOCK_USER_RESULT);
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Verify that correct path and method are used
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
      expect(url).toContain('/users/1');
      // Check if method is GET or undefined (default is GET)
      const getMethod = options?.method || 'GET';
      expect(getMethod).toBe('GET');
    });

    it('should throw error when API response is empty', async () => {
      // Setup mock for failed get request
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            result: { user: null }
          }),
          status: 200,
          ok: true
        })
      ) as jest.Mock;

      await expect(dataSource.get('1')).rejects.toThrow('Error fetching user');
    });
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      // Setup mock for create user request
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            result: { id: '2' }
          }),
          status: 201,
          ok: true
        })
      ) as jest.Mock;

      const result = await dataSource.create(MOCK_USER_CREATE_MODEL);

      expect(result).toBe('2');
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Verify that correct path and method are used
      const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
      expect(url).toContain('/users');
      expect(options.method).toBe('POST');

      // Verify request body contains correct data
      const body = JSON.parse(options.body);
      expect(body).toHaveProperty('username', MOCK_USER_CREATE_MODEL.email);
      expect(body).toHaveProperty('password', MOCK_USER_CREATE_MODEL.password);
      expect(body).toHaveProperty('firstName', MOCK_USER_CREATE_MODEL.firstName);
      expect(body).toHaveProperty('lastName', MOCK_USER_CREATE_MODEL.lastName);
    });

    it('should throw error when API response is empty', async () => {
      // Setup mock for failed create request
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve({
            result: null
          }),
          status: 201,
          ok: true
        })
      ) as jest.Mock;

      await expect(dataSource.create(MOCK_USER_CREATE_MODEL)).rejects.toThrow('Error creating user');
    });
  });
});
