enum UserStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted'
}
enum UserRoleEnum {
  USER = 'user',
  ADMIN = 'admin'
}

type UserStatus = `${UserStatusEnum}`
type UserRole = `${UserRoleEnum}`

export interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  status: UserStatus
  roles?: UserRole[]
  totpEnabled?: boolean
  createdAt: Date
  updatedAt: Date
  passwordChanged?: boolean
}

export interface CreateUser {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}
