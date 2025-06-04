import { User, UserCreateType } from '@/domain/model'

interface UserDataSource {
  create: (user: UserCreateType) => Promise<string>
  me: () => Promise<User>
  get: (id: string) => Promise<User>
  list: () => Promise<User[]>
}

export type { UserDataSource }
