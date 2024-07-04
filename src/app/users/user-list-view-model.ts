import { useState } from 'react'
import { User } from '@/domain/model'
import UserDBDRepository from '@/data/repository/user-repository-impl'
import UserDataSource from '@/data/data-source/mock-api/user-db-data-source-impl'
import { GetUsers } from '@/domain/use-cases/user/get-users'

export default function UserListViewModel() {
  const [users, setUsers] = useState<User[]>([])

  const useCaseGetUsers = new GetUsers(
    new UserDBDRepository(new UserDataSource())
  )

  const getUsers = async () => {
    const users = await useCaseGetUsers.execute()
    setUsers(users)
  }

  return { getUsers, users }
}
