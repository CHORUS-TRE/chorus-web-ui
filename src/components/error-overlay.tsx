'use client'

import { AlertCircle } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ErrorOverlayProps {
  error: Error
}

export function ErrorOverlay({ error }: ErrorOverlayProps) {
  return (
    <div className="fixed inset-0 top-11 z-30 flex items-center justify-center bg-background/80">
      <Alert variant="destructive" className="w-[400px]">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    </div>
  )
}
