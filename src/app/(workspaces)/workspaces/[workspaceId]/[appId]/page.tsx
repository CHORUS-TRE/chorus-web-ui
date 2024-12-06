'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import { useNavigation } from '~/components/store/navigation-context'

import { Header } from './header'

export default function WorkbenchPage() {

  return (
    <>
      <div
        className={`absolute left-0 top-0 z-40 h-11 min-w-full transition-[top] duration-500 ease-in-out`}
        id="header"
      >
        <Header />
      </div>
    </>
  )
}
