import { z } from 'zod'

import { RoleSchema } from './role'

export enum UserStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
  UNKNOWN = ''
}

export enum UserRoleEnum {
  ADMIN = 'admin',
  AUTHENTICATED = 'authenticated',
  UNKNOWN = ''
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
  workspaceId: z.string().optional(),
  roles2: z.array(RoleSchema).optional()
})

export const UserCreateSchema = z.object({
  username: z.string(),
  password: z.string(),
  firstName: z.string().min(2),
  lastName: z.string().min(2)
})

export const UserUpdateSchema = UserCreateSchema.extend({
  id: z.string()
})

export const UserEditFormSchema = UserCreateSchema

export type User = z.infer<typeof UserSchema>
export type UserCreateType = z.infer<typeof UserCreateSchema>
export type UserUpdateType = z.infer<typeof UserUpdateSchema>
