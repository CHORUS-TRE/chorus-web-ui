'use client'

import { ArrowUp, Paperclip } from 'lucide-react'
import { type KeyboardEvent, useRef } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '~/components/ui/button'

interface ChatInputProps {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  onFileSelect?: (file: File) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onFileSelect,
  disabled,
  placeholder = 'Ask Chorus anything…'
}: ChatInputProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onFileSelect) onFileSelect(file)
    e.target.value = ''
  }

  return (
    <div className="space-y-2 p-3">
      {/* Input row */}
      <div className="flex items-end gap-2 rounded-xl border border-muted/40 bg-background/40 px-3 py-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            'flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/50',
            'max-h-32 overflow-y-auto',
            disabled && 'opacity-50'
          )}
          style={{ height: 'auto', minHeight: '1.5rem' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement
            target.style.height = 'auto'
            target.style.height = `${Math.min(target.scrollHeight, 128)}px`
          }}
        />
        <div className="flex items-center gap-1">
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.md"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 flex-shrink-0 text-muted-foreground/60 hover:text-muted-foreground"
            onClick={() => fileRef.current?.click()}
            disabled={disabled}
            title="Upload document"
          >
            <Paperclip className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            className={cn(
              'h-7 w-7 flex-shrink-0 rounded-lg',
              value.trim()
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/30 text-muted-foreground'
            )}
            onClick={onSubmit}
            disabled={disabled || !value.trim()}
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
