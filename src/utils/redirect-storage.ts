/**
 * Utility for managing redirect URLs during OAuth authentication flow
 * Uses sessionStorage to preserve redirect URLs across OAuth redirects
 */

const REDIRECT_KEY = 'oauth_redirect_url'

/**
 * Validates if a redirect URL is safe to use
 * - Must be relative (starts with /)
 * - Cannot contain protocol or domain (no //)
 * - Cannot be empty or just /
 */
export function isValidRedirectUrl(url: string): boolean {
  if (!url || url === '/') return false

  // Must be relative and not contain protocol/domain
  if (!url.startsWith('/') || url.includes('//')) return false

  // Additional security checks
  if (url.includes('javascript:') || url.includes('data:')) return false

  return true
}

/**
 * Stores a redirect URL in sessionStorage for use after OAuth flow
 */
export function storeRedirectUrl(url: string): void {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      console.warn(
        'SessionStorage not available, redirect URL cannot be stored'
      )
      return
    }

    if (isValidRedirectUrl(url)) {
      sessionStorage.setItem(REDIRECT_KEY, url)
    } else {
      console.warn('Invalid redirect URL, not storing:', url)
    }
  } catch (error) {
    console.error('Failed to store redirect URL:', error)
  }
}

/**
 * Retrieves and clears the stored redirect URL from sessionStorage
 * Returns null if no valid URL is stored
 */
export function getAndClearRedirectUrl(): string | null {
  try {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return null
    }

    const storedUrl = sessionStorage.getItem(REDIRECT_KEY)

    if (storedUrl) {
      // Clear immediately after reading
      sessionStorage.removeItem(REDIRECT_KEY)

      // Validate before returning
      if (isValidRedirectUrl(storedUrl)) {
        return storedUrl
      }
    }

    return null
  } catch (error) {
    console.error('Failed to retrieve redirect URL:', error)
    return null
  }
}

/**
 * Clears any stored redirect URL without returning it
 * Useful for cleanup on authentication errors
 */
export function clearRedirectUrl(): void {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem(REDIRECT_KEY)
    }
  } catch (error) {
    console.error('Failed to clear redirect URL:', error)
  }
}
