'use client'

import { CornerDownLeft, Mic, Paperclip } from 'lucide-react'
import { Label } from 'recharts'

import { Button } from '~/components/ui/button'
import { Card, CardDescription, CardHeader } from '~/components/ui/card'
import { Textarea } from '~/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '~/components/ui/tooltip'

export default function HomePage() {
  return (
    <Card className="w-1/3 p-4">
      <div className="flex gap-4">
        <Card>
          <CardHeader>
            <CardDescription>
              Quel est le cycle d&apos;un projet de recherche ?
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>
              Combien de projets de recherches sont en cours au CHUV?
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>
              Que dois-je faire pour commencer un projet de recherche ?
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>
              Comment puis-je accéder à mes données ?
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      <br />
      <div>
        <form className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
          <Label className="sr-only">Message</Label>
          <Textarea
            id="message"
            placeholder="I'm an AI bot for all health research at CHUV hospital. How can I help you today?"
            className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Paperclip className="size-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Attach File</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Mic className="size-4" />
                    <span className="sr-only">Use Microphone</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Use Microphone</TooltipContent>
              </Tooltip>
              <Button type="submit" size="sm" className="ml-auto gap-1.5">
                Send Message
                <CornerDownLeft className="size-3.5" />
              </Button>
            </TooltipProvider>
          </div>
        </form>
      </div>
    </Card>
  )
}
