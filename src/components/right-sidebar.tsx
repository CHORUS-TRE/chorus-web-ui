'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Frown, Github, Meh, Smile } from 'lucide-react'

import packageInfo from '../../package.json'

import packageInfo from '../../package.json'
import { useNavigation } from './store/navigation-context'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from './ui/card'
import { Button as CButton } from './button'

import placeholder from '/public/placeholder.svg'

export default function RightSidebar({ show }: { show?: boolean }) {
  const { showRightSidebar, toggleRightSidebar } = useNavigation()

  return (
    <div
      className={`fixed right-0 top-0 z-50 h-full w-[50vw] bg-slate-100 p-10 pl-20 text-white duration-300 ease-in-out ${
        showRightSidebar ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <CButton onClick={toggleRightSidebar} className="absolute right-5 top-5">
        {showRightSidebar ? 'Close' : 'Open'}
      </CButton>

      <div className="flex h-full flex-col justify-between">
        <div>
          <h2 className="mb-4 text-xl text-background">
            Getting started with CHORUS
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <Link href="#" className="cursor-default">
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
                <CardDescription>
                  Get started with your research.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <Link href="#" className="cursor-default">
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
                <CardDescription>
                  Learn more about the platform.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <Link href="#" className="cursor-default">
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
                <CardDescription>
                  Research Environmental Impact.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <Link href="#" className="cursor-default">
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
                <CardTitle>Survey</CardTitle>
                <CardDescription>What do you think of CHORUS?</CardDescription>
                <CardFooter className="flex gap-4">
                  <CButton disabled className="">
                    <Smile />
                  </CButton>
                  <CButton disabled className="bg-orange-400">
                    <Meh />
                  </CButton>
                  <CButton disabled className="bg-red-400">
                    <Frown />
                  </CButton>
                </CardFooter>
              </CardHeader>
            </Card>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-sm text-black">
            Web-UI Version: {packageInfo.version}
          </div>
          <CButton
            className="mt-4"
            onClick={() =>
              window.open('https://github.com/CHORUS-TRE/chorus-web-ui/')
            }
            aria-label="CHORUS github repository"
          >
            <Github className="h-4 w-4" />
          </CButton>
        </div>
      </div>
    </div>
  )
}
