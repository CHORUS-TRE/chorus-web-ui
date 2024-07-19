'use client'

import { Home } from '@/components/home'
import ErrorBoundary from '@/components/error-boundary'
import { Header } from '~/components/header'

export default function Portal() {
  return (
    <ErrorBoundary>
      <Header />
      <Home />
    </ErrorBoundary>
  )
}
