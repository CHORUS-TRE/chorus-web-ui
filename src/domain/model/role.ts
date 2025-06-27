import { z } from 'zod'

// =================================================================================
// Permission
// =================================================================================

export const PermissionSchema = z.object({
  name: z.string(),
  description: z.string(),
  context: z.record(z.string())
})

export type Permission = z.infer<typeof PermissionSchema>

// =================================================================================
// Role
// =================================================================================

// We need a base schema for the recursion to work
const RoleSchemaBase = z.object({
  name: z.string(),
  description: z.string(),
  permissions: z.array(PermissionSchema),
  attributes: z.record(z.string())
})

// Define the recursive type for Role
type RoleWithInheritance = z.infer<typeof RoleSchemaBase> & {
  inheritsFrom: RoleWithInheritance[]
}

// Use z.lazy to handle the recursive relationship
export const RoleSchema: z.ZodType<RoleWithInheritance> = RoleSchemaBase.extend(
  {
    inheritsFrom: z.lazy(() => z.array(RoleSchema))
  }
)

export type Role = z.infer<typeof RoleSchema>

// We will need to define Create/Update schemas as well, but let's
// get the base schema in first. We can add those later if needed.

// =================================================================================
// Authorization Schema
// =================================================================================

export const AuthorizationSchema = z.object({
  roles: z.array(RoleSchema),
  permissions: z.array(PermissionSchema)
})

export type AuthorizationSchemaType = z.infer<typeof AuthorizationSchema>
