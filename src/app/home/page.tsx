'use client'

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '~/components/ui/tooltip'
import { Paperclip, Mic, CornerDownLeft } from 'lucide-react'
import { Label } from 'recharts'
import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardDescription } from '~/components/ui/card'
import { Textarea } from '~/components/ui/textarea'
import { remark } from 'remark'
import html from 'remark-html'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [chatOutput, setChatOutput] = useState('')
  const [message, setMessage] = useState('')
  const [md, setMd] = useState('')

  const renderMarkdown = async (text: string) => {
    const processedContent = await remark().use(html).process(text)
    return processedContent.toString()
  }

  useEffect(() => {
    renderMarkdown(chatOutput).then((content) => setMd(content))
  }, [chatOutput])

  const handleFetchStream = async () => {
    setChatOutput('')
    const response = await fetch('/home/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ message })
    })
    const reader = response.body?.getReader()

    if (reader) {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setChatOutput((prev) => prev + new TextDecoder().decode(value))
      }
    }
  }

  return (
    <div className="w-2/3 p-4">
      <div className="flex gap-4">
        <Card>
          <CardHeader>
            <CardDescription>
              Quel est le cycle d'un projet de recherche ?
            </CardDescription>
            <Textarea
              id="message"
              name="message"
              value="Quel est le cycle d'un projet de recherche ?"
              className="hidden"
            />
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
        <Label className="sr-only">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="How can I help you today?"
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex w-auto items-center p-3 pt-0">
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
            <Button
              size="sm"
              className="ml-auto gap-1.5"
              onClick={() => {
                handleFetchStream()
              }}
            >
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </TooltipProvider>
        </div>
        {chatOutput && (
          <div className="mt-4 p-2" dangerouslySetInnerHTML={{ __html: md }} />
        )}
      </div>
    </div>
  )
}
