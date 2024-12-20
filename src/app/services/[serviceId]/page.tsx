'use client'

import { useRef } from 'react'
import { notFound, useParams } from 'next/navigation'
import { Maximize2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import customServices from '@/data/data-source/chorus-api/custom-services.json'

import { App } from '~/domain/model/app'

export default function ServicePage() {
  const params = useParams<{ serviceId: string }>()
  const serviceId = params?.serviceId

  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Find service directly from the static data
  const service = customServices.find((app) => app.id === serviceId)

  // Handle 404 case
  if (!service) {
    notFound()
  }

  const handleFullscreen = () => {
    if (iframeRef.current) {
      iframeRef.current.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err)
      })
    }
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex justify-end pb-2">
        <Button
          size="sm"
          onClick={handleFullscreen}
          aria-label={`View ${service.name} in fullscreen`}
          className={`flex items-center justify-start gap-1 bg-accent text-sm text-black transition-[gap] duration-500 ease-in-out hover:gap-2 hover:bg-accent-background focus:bg-accent-background focus:ring-2 focus:ring-accent`}
        >
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
      <iframe
        ref={iframeRef}
        src={service.url}
        className="h-[calc(100vh-3rem)] w-full border-0"
        allow="fullscreen"
        title={service.name}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      />
    </div>
  )
}
