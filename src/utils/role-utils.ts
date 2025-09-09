import { User } from '@/domain/model/user'

/**
 * Utility functions for working with user roles
 */

/**
 * Check if a user has a specific role
 * @param user - The user object
 * @param roleName - The role name to check for
 * @returns true if the user has the role, false otherwise
 */
export const hasRole = (
  user: User | null | undefined,
  roleName: string
): boolean => {
  if (!user?.roles) {
    return false
  }

  return user.roles.some((role) => role.name === roleName)
}

/**
 * Check if a user is an admin
 * @param user - The user object
 * @returns true if the user is an admin, false otherwise
 */
export const isAdmin = (user: User | null | undefined): boolean => {
  return hasRole(user, 'admin')
}

/**
 * Check if a user has any of the specified roles
 * @param user - The user object
 * @param roleNames - Array of role names to check for
 * @returns true if the user has any of the roles, false otherwise
 */
export const hasAnyRole = (
  user: User | null | undefined,
  roleNames: string[]
): boolean => {
  if (!user?.roles) {
    return false
  }

  return user.roles.some((role) => roleNames.includes(role.name || ''))
}

/**
 * Get all role names for a user
 * @param user - The user object
 * @returns Array of role names
 */
export const getUserRoleNames = (user: User | null | undefined): string[] => {
  if (!user?.roles) {
    return []
  }

  return user.roles.map((role) => role.name || '').filter(Boolean)
}

/**
 * Get role context for a specific role
 * @param user - The user object
 * @param roleName - The role name to get context for
 * @returns The context object for the role, or empty object if not found
 */
export const getRoleContext = (
  user: User | null | undefined,
  roleName: string
): Record<string, string> => {
  if (!user?.roles) {
    return {}
  }

  const role = user.roles.find((role) => role.name === roleName)
  return role?.context || {}
}
