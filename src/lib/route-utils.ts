/**
 * Utility to check if a pathname represents a session or webapp page that should
 * have its iframe rendered (either active or in the background).
 */
export const isSessionPath = (pathname: string): boolean => {
  // Matches:
  // /sessions/id
  // /sessions/id/subpath
  // /workspaces/id/sessions/id
  // /workspaces/id/sessions/id/subpath
  const sessionPageRegex = /^(\/workspaces\/[^/]+)?\/sessions\/[^/]+(\/.*)?$/
  return sessionPageRegex.test(pathname)
}

export const isWebappPath = (pathname: string): boolean => {
  // Matches:
  // /sessions/id
  // /sessions/id/subpath
  const sessionPageRegex = /^\/sessions\/[^/]+(\/.*)?$/
  return sessionPageRegex.test(pathname)
}
