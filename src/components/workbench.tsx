'use client'

import Image from 'next/image'

import { useNavigation } from './navigation-context'

import workbenchPlaceholder from '/public/workbench-placeholder.png'
import workbenchPlaceholder2 from '/public/workbench-placeholder-2.png'

export default function Workbench() {
  const { background } = useNavigation()

  return background ? (
    <iframe
      title="Workbench"
      src={`http://localhost:5000/api/rest/v1/workbenchs/50/stream/`}
      allow="autoplay; fullscreen; clipboard-write;"
      style={{ width: '100vw', height: '100vh' }}
      className="fixed left-0 top-11 z-10 h-full w-full"
      id="iframe"
    />
  ) : // <Image alt="Workbench" src={Number(background.workbenchId) % 2 === 0 ? workbenchPlaceholder : workbenchPlaceholder2} placeholder="blur" quality={100} priority={true} sizes="100vw" className="fixed left-0 top-11 z-10 h-full w-full aspect-video" id="iframe"/>
  null
}
