import { useEffect } from 'react'

import { useAppStateStore } from '~/stores/app-state-store'

export function useUploadWarning() {
  const hasActiveUploads = useAppStateStore((state) => state.hasActiveUploads)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasActiveUploads()) {
        e.preventDefault()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasActiveUploads])
}
