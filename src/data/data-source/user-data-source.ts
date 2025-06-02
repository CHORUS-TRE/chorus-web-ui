import { User, UserCreateModel } from '@/domain/model'

interface UserDataSource {
  create: (user: UserCreateModel) => Promise<string>
  me: () => Promise<User>
  get: (id: string) => Promise<User>
  list: () => Promise<User[]>
}

export type { UserDataSource }
