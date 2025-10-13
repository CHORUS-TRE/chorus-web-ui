'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAIChat } from '@/providers/ai-chat-provider'

export function AIChatTrigger() {
  const { isOpen, toggleChat } = useAIChat()

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 sm:bottom-6"
        >
          <Button
            onClick={toggleChat}
            size="icon"
            className="h-14 w-14 rounded-full bg-blue-600 shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl"
            aria-label="Open AI Chat"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
