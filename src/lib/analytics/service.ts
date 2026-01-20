import { AnalyticsEvent, CustomDimension } from './types'

/**
 * Push an event to Matomo Tag Manager
 */
export const trackEvent = (event: AnalyticsEvent) => {
  if (typeof window === 'undefined' || !window._mtm) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics (Dev)]', event)
    }
    return
  }

  // Construct the MTM data layer push
  // MTM expects 'event', 'eventCategory', 'eventAction', 'eventName'
  // plus any custom variables.
  const mtmPush: Record<string, unknown> = {
    event: 'trackEvent', // Standard MTM trigger for custom events
    eventCategory: event.category,
    eventAction: event.action,
    eventName: event.name,
    eventValue: event.value
  }

  // Map custom dimensions to MTM format (usually dimension1, dimension2, etc.)
  if (event.customDimensions) {
    Object.entries(event.customDimensions).forEach(([key, value]) => {
      // We expect key to be 'dimensionX' or mapped via the Enum if strictly using indices
      // Ideally, pass the generic name and map it here if MTM requires 'dimensionX'
      // For now, assuming we pass names that MTM Data Layer understands or generic mapping
      mtmPush[key] = value
    })
  }

  window._mtm.push(mtmPush)
}

// --- Specific Event Creators ---

export const Analytics = {
  Auth: {
    signupStart: () =>
      trackEvent({ category: 'Auth', action: 'Signup', name: 'Start' }),
    signupSubmit: () =>
      trackEvent({ category: 'Auth', action: 'Signup', name: 'Submit' }),
    signupSuccess: () =>
      trackEvent({ category: 'Auth', action: 'Signup', name: 'Success' }),
    signupError: (errorCode: string) =>
      trackEvent({
        category: 'Auth',
        action: 'Signup',
        name: 'Error',
        value: errorCode,
        customDimensions: {
          [`dimension${CustomDimension.ErrorType}`]: errorCode
        }
      }),
    loginSuccess: () =>
      trackEvent({ category: 'Auth', action: 'Login', name: 'Success' }),
    logout: () =>
      trackEvent({ category: 'Auth', action: 'Logout', name: 'Click' })
  },
  Workspace: {
    createStart: () =>
      trackEvent({ category: 'Workspace', action: 'Create', name: 'Start' }),
    createSuccess: (workspaceId: string) =>
      trackEvent({
        category: 'Workspace',
        action: 'Create',
        name: 'Success',
        customDimensions: {
          [`dimension${CustomDimension.WorkspaceID}`]: workspaceId
        }
      }),
    createError: (errorType: string) =>
      trackEvent({
        category: 'Workspace',
        action: 'Create',
        name: 'Error',
        customDimensions: {
          [`dimension${CustomDimension.ErrorType}`]: errorType
        }
      })
  },
  Data: {
    uploadStart: (sizeBytes: number) =>
      trackEvent({
        category: 'Data',
        action: 'Upload',
        name: 'Start',
        value: sizeBytes
      }),
    uploadSuccess: () =>
      trackEvent({ category: 'Data', action: 'Upload', name: 'Success' }),
    uploadError: () =>
      trackEvent({ category: 'Data', action: 'Upload', name: 'Error' })
  },
  Session: {
    launchStart: () =>
      trackEvent({ category: 'Session', action: 'Launch', name: 'Start' }),
    launchSuccess: (sessionId: string) =>
      trackEvent({
        category: 'Session',
        action: 'Launch',
        name: 'Success',
        customDimensions: {
          [`dimension${CustomDimension.WorkspaceID}`]: sessionId
        } // Assuming ID mapping
      }),
    launchAppStart: (appName: string) =>
      trackEvent({
        category: 'AppInstance',
        action: 'Launch',
        name: 'Start',
        customDimensions: { [`dimension${CustomDimension.AppRef}`]: appName }
      }),
    launchAppSuccess: (appName: string) =>
      trackEvent({
        category: 'AppInstance',
        action: 'Launch',
        name: 'Success',
        customDimensions: { [`dimension${CustomDimension.AppRef}`]: appName }
      })
  }
}
