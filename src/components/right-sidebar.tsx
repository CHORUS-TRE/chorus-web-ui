'use client'

import { owl } from '@lucide/lab'
import { CircleX } from 'lucide-react'
import { Icon } from 'lucide-react'
import Link from 'next/link'
import { useNextStep } from 'nextstepjs'
import { useCallback, useEffect } from 'react'

import { useAppState } from '@/providers/app-state-provider'
import { Button } from '~/components/ui/button'

import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'

export default function RightSidebar() {
  const { startNextStep } = useNextStep()
  const { toggleRightSidebar, showRightSidebar, hasSeenGettingStartedTour } =
    useAppState()

  const handleStartTour = useCallback(() => {
    startNextStep('gettingStartedTour')
  }, [startNextStep])

  useEffect(() => {
    if (!showRightSidebar) return
    if (hasSeenGettingStartedTour) return

    handleStartTour()
  }, [showRightSidebar, hasSeenGettingStartedTour, handleStartTour])

  return (
    <>
      <Button
        size="icon"
        className="absolute right-2 top-2 overflow-hidden text-muted hover:bg-inherit hover:text-accent"
        variant="ghost"
        onClick={toggleRightSidebar}
      >
        <CircleX />
      </Button>

      <div className="flex h-full w-[300px] flex-col justify-between pr-8">
        <div>
          <h2 className="mb-8 flex items-center gap-2 text-xl">
            <Icon iconNode={owl} />
            Help
          </h2>
          <div className="flex flex-col gap-4">
            <Link
              href="https://docs.chorus-tre.ch/docs/category/getting-started"
              className="cursor"
              target="_blank"
            >
              <Card
                className={`flex h-full flex-col justify-between rounded-2xl border-muted/40 bg-background/40 transition-colors duration-300 hover:border-accent hover:bg-background/80 hover:shadow-lg`}
                id="getting-started-step1"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Getting started</CardTitle>
                  <CardDescription className="text-sm">
                    Get started with your research.
                  </CardDescription>
                </CardHeader>
                {/* <CardContent>
                  <div className="relative max-w-xs overflow-hidden bg-cover bg-no-repeat">
                    <Image
                      src={placeholder}
                      alt="Placeholder user"
                      className="aspect-video"
                    />
                  </div>
                </CardContent> */}
              </Card>
            </Link>
            <Link
              href="https://docs.chorus-tre.ch"
              target="_blank"
              className="cursor"
            >
              <Card
                className={`flex h-full flex-col justify-between rounded-2xl border-muted/40 bg-background/40 transition-colors duration-300 hover:border-accent hover:bg-background/80 hover:shadow-lg`}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Documentation</CardTitle>
                  <CardDescription className="text-sm">
                    Learn more about the platform.
                  </CardDescription>
                </CardHeader>
                {/* <CardContent>
                  <div className="relative w-full max-w-xs overflow-hidden bg-cover bg-no-repeat">
                    <Image
                      src={placeholder}
                      alt="Placeholder user"
                      className="aspect-video"
                    />
                    <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-accent bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-60"></div>
                  </div>
                </CardContent> */}
              </Card>
            </Link>

            {/* <Card className="bg-opacity-85 bg-black">
              <CardHeader className="pb-4">
                <CardTitle>Contact Support</CardTitle>
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
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card> */}

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
                <CardHeader className="pb-4">
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
      </div>
    </>
  )
}
