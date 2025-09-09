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
  id: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  source: z.string().optional(),
  password: z.string().optional(),
  status: z.string().optional(),
  roles: z
    .array(
      z.object({
        name: z.string().optional(),
        context: z.record(z.string()).optional()
      })
    )
    .optional(),
  totpEnabled: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
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
