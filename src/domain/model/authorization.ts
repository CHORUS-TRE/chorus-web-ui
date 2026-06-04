import { z } from 'zod'

export const AuthorizationRoleSchema = z.object({
  name: z.string(),
  description: z.string().default(''),
  scope: z.enum(['platform', 'workspace', 'session']).catch('platform'),
  permissions: z.array(z.string()).default([]),
  context: z.array(z.string()).default([]),
  dynamic: z.boolean().default(false)
})

export type AuthorizationRole = z.infer<typeof AuthorizationRoleSchema>

export const AuthorizationPermissionSchema = z.object({
  name: z.string(),
  description: z.string().default(''),
  context: z.array(z.string()).default([])
})

export type AuthorizationPermission = z.infer<typeof AuthorizationPermissionSchema>
