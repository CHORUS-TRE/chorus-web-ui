import { AnalyticsEvent, CustomDimension } from './types'

/**
 * Push an event to both Matomo Tracking API (_paq) and Tag Manager (_mtm).
 *
 * _paq: Direct tracking — required for Goals to fire correctly.
 *       Custom dimensions must be set BEFORE the trackEvent call.
 * _mtm: Tag Manager data layer — kept for backward compatibility.
 *
 * Event Action values use the underscore format required by Matomo Goals
 * (e.g., "Signup_Success" instead of just "Signup").
 */
export const trackEvent = (event: AnalyticsEvent) => {
  if (typeof window === 'undefined') {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics (Dev)]', event)
    }
    return
  }

  // --- _paq: Direct Matomo Tracking API ---
  if (window._paq) {
    // Set custom dimensions BEFORE the trackEvent call (Matomo requirement)
    if (event.customDimensions) {
      Object.entries(event.customDimensions).forEach(([key, value]) => {
        // Extract dimension index from key like "dimension2"
        const match = key.match(/dimension(\d+)/)
        if (match) {
          window._paq!.push([
            'setCustomDimension',
            parseInt(match[1], 10),
            String(value)
          ])
        }
      })
    }

    // Push the event — [category, action, name, value]
    const paqArgs: unknown[] = [
      'trackEvent',
      event.category,
      event.action,
      event.name
    ]
    if (event.value !== undefined) {
      paqArgs.push(event.value)
    }
    window._paq.push(paqArgs)
  }

  // --- _mtm: Tag Manager Data Layer (backward compat) ---
  if (window._mtm) {
    const mtmPush: Record<string, unknown> = {
      event: 'trackEvent',
      eventCategory: event.category,
      eventAction: event.action,
      eventName: event.name,
      eventValue: event.value
    }

    if (event.customDimensions) {
      Object.entries(event.customDimensions).forEach(([key, value]) => {
        mtmPush[key] = value
      })
    }

    window._mtm.push(mtmPush)
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event)
  }
}

/**
 * Set the UserRole custom dimension (index 1) for the current visit.
 * Should be called once after login.
 */
export const setUserRole = (role: 'Researcher' | 'Admin') => {
  if (typeof window === 'undefined' || !window._paq) return

  window._paq.push(['setCustomDimension', CustomDimension.UserRole, role])

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] UserRole set to:', role)
  }
}

// --- Specific Event Creators ---
// Event Action values use underscore format to match Matomo Goal configuration.
// e.g., Goal "Sign-up Success" triggers on Event Action = "Signup_Success"

export const Analytics = {
  Auth: {
    signupStart: () =>
      trackEvent({ category: 'Auth', action: 'Signup_Start', name: 'Start' }),
    signupSubmit: () =>
      trackEvent({
        category: 'Auth',
        action: 'Signup_Submit',
        name: 'Submit'
      }),
    signupSuccess: () =>
      trackEvent({
        category: 'Auth',
        action: 'Signup_Success',
        name: 'Success'
      }),
    signupError: (errorCode: string) =>
      trackEvent({
        category: 'Auth',
        action: 'Signup_Error',
        name: 'Error',
        value: errorCode,
        customDimensions: {
          [`dimension${CustomDimension.ErrorType}`]: errorCode
        }
      }),
    loginSuccess: () =>
      trackEvent({
        category: 'Auth',
        action: 'Login_Success',
        name: 'Success'
      }),
    logout: () =>
      trackEvent({ category: 'Auth', action: 'Logout_Click', name: 'Click' })
  },

  Workspace: {
    createStart: () =>
      trackEvent({
        category: 'Workspace',
        action: 'Workspace_Create_Start',
        name: 'Start'
      }),
    createSuccess: (workspaceId: string) =>
      trackEvent({
        category: 'Workspace',
        action: 'Workspace_Create_Success',
        name: 'Success',
        customDimensions: {
          [`dimension${CustomDimension.WorkspaceID}`]: workspaceId
        }
      }),
    createError: (errorType: string) =>
      trackEvent({
        category: 'Workspace',
        action: 'Workspace_Create_Error',
        name: 'Error',
        customDimensions: {
          [`dimension${CustomDimension.ErrorType}`]: errorType
        }
      }),
    deleteSuccess: () =>
      trackEvent({
        category: 'Workspace',
        action: 'Workspace_Delete_Success',
        name: 'Success'
      })
  },

  Data: {
    uploadStart: (sizeBytes: number) =>
      trackEvent({
        category: 'Data',
        action: 'Data_Upload_Start',
        name: 'Start',
        value: sizeBytes
      }),
    uploadSuccess: () =>
      trackEvent({
        category: 'Data',
        action: 'Data_Upload_Success',
        name: 'Success'
      }),
    uploadError: () =>
      trackEvent({
        category: 'Data',
        action: 'Data_Upload_Error',
        name: 'Error'
      })
  },

  Session: {
    launchStart: () =>
      trackEvent({
        category: 'Session',
        action: 'Session_Launch_Start',
        name: 'Start'
      }),
    launchSuccess: (sessionId: string) =>
      trackEvent({
        category: 'Session',
        action: 'Session_Launch_Success',
        name: 'Success',
        customDimensions: {
          [`dimension${CustomDimension.WorkspaceID}`]: sessionId
        }
      }),
    terminateClick: (durationSeconds: number) =>
      trackEvent({
        category: 'Session',
        action: 'Session_Terminate_Click',
        name: 'Click',
        value: durationSeconds
      }),
    launchAppStart: (appName: string) =>
      trackEvent({
        category: 'AppInstance',
        action: 'AppInstance_Launch_Start',
        name: 'Start',
        customDimensions: { [`dimension${CustomDimension.AppRef}`]: appName }
      }),
    launchAppSuccess: (appName: string) =>
      trackEvent({
        category: 'AppInstance',
        action: 'AppInstance_Launch_Success',
        name: 'Success',
        customDimensions: { [`dimension${CustomDimension.AppRef}`]: appName }
      })
  },

  User: {
    consentUpdate: (status: boolean) =>
      trackEvent({
        category: 'User',
        action: 'User_Consent_Update',
        name: 'Update',
        value: status ? 'true' : 'false'
      })
  },

  /** Set UserRole custom dimension (call once after login) */
  setUserRole
}
