'use client'

import React from 'react'

import { Header } from '../header'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div
        className={`absolute left-0 top-0 z-40 h-11 min-w-full transition-[top] duration-500 ease-in-out`}
        id="header"
      >
        <Header />
      </div>

      <div
        className="absolute left-1/2 top-24 z-30 min-h-[75vh] w-full max-w-6xl -translate-x-1/2 rounded-2xl border border-secondary bg-black bg-opacity-85 p-8"
        id="content"
      >
        {children}
      </div>
    </>
  )
}
