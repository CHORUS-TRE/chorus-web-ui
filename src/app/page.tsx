'use client'

import { Home } from '@/components/home'
import ErrorBoundary from '~/components/error-boundary'

export default function Portal() {
  return (
    <ErrorBoundary>
      <Home />
    </ErrorBoundary>
  )
}
