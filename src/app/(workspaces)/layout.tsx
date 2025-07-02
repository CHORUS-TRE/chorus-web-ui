'use client'

import BackgroundIframe from "~/components/background-iframe"

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <BackgroundIframe />
      {children}
    </>
  )
}
