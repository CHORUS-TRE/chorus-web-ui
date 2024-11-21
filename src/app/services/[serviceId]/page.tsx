'use client'

import { useRef, useState } from 'react'
import { useEffect } from 'react'
import { notFound, useParams } from 'next/navigation'
import { Maximize2 } from 'lucide-react'

import { appList } from '@/components/actions/app-view-model'
import { Button } from '@/components/ui/button'

import { App } from '~/domain/model/app'

export default function ServicePage() {
  const [service, setService] = useState<App>()

  const params = useParams<{ serviceId: string }>()
  const serviceId = params?.serviceId

  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    appList().then((res) => {
      if (res.error) {
        return
      }

      if (!res.data) {
        return
      }

      setService(res.data.find((app) => app.id === serviceId))
    })
  }, [serviceId])

  const handleFullscreen = () => {
    if (iframeRef.current) {
      iframeRef.current.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err)
      })
    }
  }

  return (
    service && (
      <div className="flex h-screen w-full flex-col">
        <div className="flex justify-end pb-2">
          <Button
            size="sm"
            onClick={handleFullscreen}
            className={`flex items-center justify-start gap-1 bg-accent text-sm text-black transition-[gap] duration-500 ease-in-out hover:gap-2 hover:bg-accent-background focus:bg-accent-background focus:ring-2 focus:ring-accent`}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        <iframe
          ref={iframeRef}
          src={service?.url}
          className="h-[calc(100vh-3rem)] w-full border-0"
          allow="fullscreen"
          title={service?.name}
        />
      </div>
    )
  )
}
