'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Github } from 'lucide-react'

import { useAppState } from '@/components/store/app-state-context'

import packageInfo from '../../package.json'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './ui/card'
import { Button } from './button'

import placeholder from '/public/placeholder.svg'

export default function RightSidebar({ show }: { show?: boolean }) {
  const { showRightSidebar, toggleRightSidebar } = useAppState()
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        showRightSidebar
      ) {
        toggleRightSidebar()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showRightSidebar, toggleRightSidebar])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showRightSidebar) {
        toggleRightSidebar()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showRightSidebar, toggleRightSidebar])

  return (
    <>
      {showRightSidebar && (
        <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
      )}
      <div
        ref={sidebarRef}
        className={`fixed right-0 top-0 z-50 h-full w-[50vw] bg-white/95 p-10 pl-20 text-white duration-300 ease-in-out ${
          showRightSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="complementary"
        aria-label="Right sidebar"
        aria-hidden={!showRightSidebar}
      >
        <Button
          onClick={toggleRightSidebar}
          className="absolute right-5 top-5 bg-accent text-primary"
          aria-label={showRightSidebar ? 'Close sidebar' : 'Open sidebar'}
        >
          {showRightSidebar ? 'Close' : 'Open'}
        </Button>

        <div className="flex h-full flex-col justify-between">
          <div>
            <h2 className="mb-4 text-xl text-background">CHORUS Help Center</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Getting started</CardTitle>
                  <CardDescription>
                    Get started with your research.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="#" className="cursor-default">
                    <div className="relative max-w-xs overflow-hidden bg-cover bg-no-repeat">
                      <Image
                        src={placeholder}
                        alt="Placeholder user"
                        className="aspect-video"
                      />
                    </div>
                  </Link>
                </CardContent>
              </Card>
              <Card className="cursor-pointer">
                <CardHeader>
                  <CardTitle>Documentation</CardTitle>
                  <CardDescription>
                    Learn more about the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href="https://docs.chorus-tre.ch/"
                    target="_blank"
                    className=""
                  >
                    <div className="relative w-full max-w-xs overflow-hidden bg-cover bg-no-repeat">
                      <Image
                        src={placeholder}
                        alt="Placeholder user"
                        className="aspect-video"
                      />
                      <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-accent bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-60"></div>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ContactSupport</CardTitle>
                  <CardDescription>
                    Get help from the CHORUS team.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        disabled
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="How can we help?"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled
                      className="w-full bg-primary text-white hover:bg-primary/90"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* <Card>
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
              </Card> */}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-sm text-black">
              Web-UI Version: {packageInfo.version}
            </div>
            <Button
              className="mt-4 bg-accent text-primary"
              onClick={() =>
                window.open('https://github.com/CHORUS-TRE/chorus-web-ui/')
              }
              aria-label="CHORUS github repository"
            >
              <Github className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
