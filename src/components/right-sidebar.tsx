'use client'

import { useState } from 'react'

import { Button } from './ui/button'

export default function RightSidebar() {
  const [showRightSidebar, setShowRightSidebar] = useState(true)

  return (
    <div
      className={`fixed right-0 top-0 z-40  h-full w-[35vw] bg-primary p-10 pl-20 text-white  duration-300 ease-in-out ${
        showRightSidebar ? 'translate-x-0 ' : 'translate-x-full'
      }`}
    >
      <Button
        onClick={() => setShowRightSidebar(!showRightSidebar)}
        className="absolute right-5 top-5"
      >
        {showRightSidebar ? 'Close' : 'Open'}
      </Button>

      <h3 className="mt-20 text-4xl font-semibold text-white">
        I am a sidebar
      </h3>
    </div>
  )
}
