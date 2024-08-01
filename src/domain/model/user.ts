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
  email: z.string().email(),
  status: z.nativeEnum(UserStatusEnum),
  roles: z.array(z.nativeEnum(UserRoleEnum)).optional(),
  totpEnabled: z.boolean().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  passwordChanged: z.boolean().optional()
})

export type User = z.infer<typeof UserSchema>

export interface UserResponse {
  data: User | null
  error: string | null
}
