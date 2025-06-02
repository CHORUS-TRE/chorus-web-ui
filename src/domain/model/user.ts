import { z } from 'zod'

export enum UserStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived'
}
export enum UserRoleEnum {
  VISITOR = 'visitor',
  USER = 'user',
  PI = 'pi',
  ADMIN = 'admin',
  AUTHENTICATED = 'authenticated'
}

export type UserStatus = `${UserStatusEnum}`
export type UserRole = `${UserRoleEnum}`

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  source: z.string(),
  password: z.string().optional(),
  status: z.nativeEnum(UserStatusEnum),
  roles: z.array(z.nativeEnum(UserRoleEnum)).optional(),
  totpEnabled: z.boolean().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  passwordChanged: z.boolean().optional(),

  // webui extra fields
  workspaceId: z.string().optional()
})

export type User = z.infer<typeof UserSchema>

export const UserCreateSchema = z.object({
  username: z.string(),
  password: z.string(),
  firstName: z.string().min(2),
  lastName: z.string().min(2)
})

export type UserCreateModel = z.infer<typeof UserCreateSchema>

export interface UserResponse {
  data?: User
  error?: string
}

export interface UsersResponse {
  data?: User[]
  error?: string
}

export interface UserCreatedResponse {
  data?: string
  error?: string
}
