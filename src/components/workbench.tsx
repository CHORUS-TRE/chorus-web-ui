'use client'

import Image from 'next/image'
import cover from '/public/cover.jpeg'

export default function Workbench() {
  return (
    // <iframe
    //   title="Workbench"
    //   src="https://xpra.dev.chorus-tre.ch/"
    //   allow="autoplay; fullscreen; clipboard-write;"
    //   style={{ width: '100vw', height: '100vh' }}
    //   className="h-full w-full"
    // />
    <Image
      alt="Workbench"
      src={cover}
      placeholder="blur"
      quality={75}
      priority={true}
      fill
      sizes="100vw"
    />
  )
}
