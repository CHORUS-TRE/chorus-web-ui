import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  source: z.string(),
  password: z.string().optional(),
  status: z.string(),
  roles: z.array(z.string()).optional(),
  rolesWithContext: z
    .array(
      z.object({
        name: z.string(),
        context: z.record(z.string())
      })
    )
    .optional(),
  totpEnabled: z.boolean().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  passwordChanged: z.boolean().optional(),

  // webui extra fields
  workspaceId: z.string().optional()
})

export const RoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  context: z.record(z.string())
})

export const UserCreateSchema = z.object({
  username: z.string(),
  password: z.string(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  rolesWithContext: z.array(RoleSchema).optional()
})

export const UserRoleCreateSchema = z.object({
  userId: z.string(),
  role: RoleSchema
})

export const UserUpdateSchema = UserCreateSchema.extend({
  id: z.string()
})

export const UserEditFormSchema = UserCreateSchema

export type User = z.infer<typeof UserSchema>
export type Role = z.infer<typeof RoleSchema>
export type UserCreateType = z.infer<typeof UserCreateSchema>
export type UserUpdateType = z.infer<typeof UserUpdateSchema>
export type UserRoleCreateType = z.infer<typeof UserRoleCreateSchema>
