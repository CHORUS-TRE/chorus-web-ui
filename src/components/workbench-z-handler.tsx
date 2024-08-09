'use client'

import '@/app/build.css'
import '@/styles/globals.css'
import { useState } from 'react'
import Workbench from '~/components/workbench'
import { Button } from './ui/button'

export default function WorkbenchZHandler() {
  const [workbenchZTop, setWorkbenchZTop] = useState(false)

  return (
    <>
      <Button onClick={() => setWorkbenchZTop(!workbenchZTop)}>Toggle</Button>
      <div
        className={`fixed left-0 top-0 h-full w-full ${workbenchZTop ? 'z-10' : '-z-10'} cursor-pointer`}
        onClick={() => setWorkbenchZTop(!workbenchZTop)}
      >
        <Workbench />
      </div>
    </>
  )
}
