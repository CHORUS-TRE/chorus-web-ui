'use client'

// import { WorkbenchCreateForm } from './forms/workbench-forms'
import Image from 'next/image'
import Link from 'next/link'

import { useNavigation } from './store/navigation-context'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './button'

import placeholder from '/public/placeholder.svg'

export default function RightSidebar({ show }: { show?: boolean }) {
  const { showRightSidebar, toggleRightSidebar } = useNavigation()

  return (
    <div
      className={`fixed right-0 top-0 z-50 h-full w-[50vw] bg-slate-100 p-10 pl-20 text-white duration-300 ease-in-out ${
        showRightSidebar ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <Button onClick={toggleRightSidebar} className="absolute right-5 top-5">
        {showRightSidebar ? 'Close' : 'Open'}
      </Button>

      <div className="">
        <h2 className="mb-4 text-xl text-background">
          Getting started with CHORUS
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <Link href="#">
              <div className="relative max-w-xs overflow-hidden bg-cover bg-no-repeat">
                <Image
                  src={placeholder}
                  alt="Placeholder user"
                  className="aspect-video"
                />
                <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-accent bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-60"></div>
              </div>
            </Link>
            <CardHeader>
              <CardTitle>Getting started</CardTitle>
              <CardDescription>Get started with your research.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <Link href="#">
              <div className="relative max-w-xs overflow-hidden bg-cover bg-no-repeat">
                <Image
                  src={placeholder}
                  alt="Placeholder user"
                  className="aspect-video"
                />
                <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-accent bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-60"></div>
              </div>
            </Link>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Learn more about the platform.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <Link href="#">
              <div className="relative max-w-xs overflow-hidden bg-cover bg-no-repeat">
                <Image
                  src={placeholder}
                  alt="Placeholder user"
                  className="aspect-video"
                />
                <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-accent bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-60"></div>
              </div>
            </Link>
            <CardHeader>
              <CardTitle>Footprint</CardTitle>
              <CardDescription>Your environmental impact.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <Link href="#">
              <div className="relative max-w-xs overflow-hidden bg-cover bg-no-repeat">
                <Image
                  src={placeholder}
                  alt="Placeholder user"
                  className="aspect-video"
                />
                <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-accent bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-60"></div>
              </div>
            </Link>
            <CardHeader>
              <CardTitle>Poll</CardTitle>
              <CardDescription>
                What would you like to see in the next release?
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
