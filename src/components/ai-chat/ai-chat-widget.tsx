'use client'

import { AIChatInterface } from './ai-chat-interface'
import { AIChatTrigger } from './ai-chat-trigger'

export function AIChatWidget() {
  return (
    <>
      <AIChatTrigger />
      <AIChatInterface />
    </>
  )
}
