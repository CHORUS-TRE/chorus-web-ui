'use client'

import { ReactNode, useEffect, useState } from 'react'

import { LoadingOverlay } from '@/components/loading-overlay'
import { ConsentScreen } from '@/components/terms-of-use/consent-screen'
import type { TermsOfUseVersion } from '@/domain/model/terms-of-use'
import { useAuthentication } from '@/providers/authentication-provider'
import {
  acceptTermsOfUse,
  getCurrentTermsOfUseVersion,
  getMyTermsOfUseStatus
} from '@/view-model/terms-of-use-view-model'

type GateState =
  | { phase: 'loading' }
  | { phase: 'pass' }
  | { phase: 'pending'; version: TermsOfUseVersion }

export function TermsOfUseGate({ children }: { children: ReactNode }) {
  const { user } = useAuthentication()
  const userId = user?.id
  const [state, setState] = useState<GateState>({ phase: 'loading' })

  useEffect(() => {
    if (!userId) {
      setState({ phase: 'pass' })
      return
    }

    let ignored = false
    setState({ phase: 'loading' })

    Promise.all([getMyTermsOfUseStatus(), getCurrentTermsOfUseVersion()])
      .then(([statusResult, versionResult]) => {
        if (ignored) return
        const version = versionResult.data
        if (!version) {
          setState({ phase: 'pass' })
          return
        }
        if (statusResult.data === true) {
          setState({ phase: 'pass' })
        } else {
          setState({ phase: 'pending', version })
        }
      })
      .catch(() => {
        if (ignored) return
        // On API error, let user through rather than blocking indefinitely
        setState({ phase: 'pass' })
      })

    return () => {
      ignored = true
    }
  }, [userId])

  const handleAccept = async () => {
    await acceptTermsOfUse()
    setState({ phase: 'pass' })
  }

  if (state.phase === 'loading') {
    return <LoadingOverlay isLoading={true} />
  }

  if (state.phase === 'pending') {
    return <ConsentScreen version={state.version} onAccept={handleAccept} />
  }

  return <>{children}</>
}
