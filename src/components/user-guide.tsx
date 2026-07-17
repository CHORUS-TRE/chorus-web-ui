'use client'

import { BookOpen, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import { userGuide } from '@/generated/user-guide'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'chorus-user-guide-location'
const SCROLL_KEY = 'chorus-user-guide-scroll'

function savedScrollPositions() {
  try {
    return JSON.parse(localStorage.getItem(SCROLL_KEY) ?? '{}') as Record<
      string,
      number
    >
  } catch {
    return {}
  }
}

export function UserGuide() {
  const [location, setLocation] = useState({
    section: 'getting-started',
    page: 'home'
  })
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? '{}'
      )
      if (
        typeof saved === 'object' &&
        saved !== null &&
        'section' in saved &&
        'page' in saved &&
        typeof saved.section === 'string' &&
        typeof saved.page === 'string'
      ) {
        setLocation({ section: saved.section, page: saved.page })
      }
    } catch {
      // Ignore invalid preferences from older versions.
    }
  }, [])

  const pages = useMemo(
    () =>
      userGuide.flatMap((section) =>
        section.pages.map((page) => ({ ...page, sectionId: section.id }))
      ),
    []
  )
  const section =
    userGuide.find((item) => item.id === location.section) ?? userGuide[0]
  const current =
    section.pages.find((item) => item.id === location.page) ?? section.pages[0]
  const pageIndex = pages.findIndex(
    (item) => item.id === current.id && item.sectionId === section.id
  )

  const navigate = (sectionId: string, pageId: string) => {
    setLocation({ section: sectionId, page: pageId })
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ section: sectionId, page: pageId })
    )
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const saved = savedScrollPositions()
    const frame = requestAnimationFrame(() =>
      contentRef.current?.scrollTo({
        top: saved[`${section.id}/${current.id}`] ?? 0
      })
    )
    return () => cancelAnimationFrame(frame)
  }, [section.id, current.id])

  const saveScroll = () => {
    const saved = savedScrollPositions()
    saved[`${section.id}/${current.id}`] = contentRef.current?.scrollTop ?? 0
    localStorage.setItem(SCROLL_KEY, JSON.stringify(saved))
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background/70">
      <nav
        className="custom-scrollbar flex flex-none gap-2 overflow-x-auto border-b border-muted/30 px-3 py-3"
        aria-label="Guide sections"
      >
        {userGuide.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id, item.pages[0].id)}
            className={cn(
              'flex-none rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
              item.id === section.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted bg-background text-muted-foreground hover:text-foreground'
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex-none border-b border-muted/30 bg-muted/10 p-3">
        <div className="custom-scrollbar flex gap-2 overflow-x-auto">
          {section.pages.map((item, index) => (
            <button
              key={item.id}
              onClick={() => navigate(section.id, item.id)}
              className={cn(
                'min-h-16 min-w-24 rounded-xl border p-2 text-left transition-colors',
                item.id === current.id
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-muted/40 bg-background hover:border-primary/30'
              )}
            >
              <span
                className={cn(
                  'mb-1.5 grid h-5 w-5 place-items-center rounded-md text-[10px] font-bold',
                  item.id === current.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {index + 1}
              </span>
              <strong className="block text-[11px] leading-tight">
                {item.shortTitle}
              </strong>
            </button>
          ))}
        </div>
      </div>

      <div
        ref={contentRef}
        onScroll={saveScroll}
        className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-6"
      >
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
          <BookOpen className="h-3 w-3" />
          {section.label}
        </div>
        <h1 className="mb-4 text-2xl font-bold leading-tight tracking-tight">
          {current.title}
        </h1>
        <div className="text-sm leading-6 text-muted-foreground">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
              ul: ({ children }) => (
                <ul className="mb-4 ml-5 list-disc space-y-2 marker:text-primary">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-4 ml-5 list-decimal space-y-2 marker:font-semibold marker:text-primary">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="pl-1">{children}</li>,
              h2: ({ children }) => (
                <h2 className="mb-3 mt-7 text-lg font-bold leading-tight text-foreground first:mt-0">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mb-2 mt-5 text-base font-semibold text-foreground">
                  {children}
                </h3>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">
                  {children}
                </strong>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="font-medium text-primary underline underline-offset-2"
                  target="_blank"
                  rel="noreferrer"
                >
                  {children}
                </a>
              )
            }}
          >
            {current.content}
          </ReactMarkdown>
        </div>
        <a
          href={current.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View on documentation site <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <footer className="grid flex-none grid-cols-2 border-t border-muted/30 bg-background/90">
        <PagerButton
          direction="previous"
          page={pages[pageIndex - 1]}
          onNavigate={navigate}
        />
        <PagerButton
          direction="next"
          page={pages[pageIndex + 1]}
          onNavigate={navigate}
        />
      </footer>
    </div>
  )
}

function PagerButton({
  direction,
  page,
  onNavigate
}: {
  direction: 'previous' | 'next'
  page?: (typeof userGuide)[number]['pages'][number] & { sectionId: string }
  onNavigate: (section: string, page: string) => void
}) {
  return (
    <button
      disabled={!page}
      onClick={() => page && onNavigate(page.sectionId, page.id)}
      className={cn(
        'flex min-w-0 items-center gap-2 px-3 py-3 text-left hover:bg-muted/20 disabled:opacity-30',
        direction === 'next' &&
          'justify-end border-l border-muted/30 text-right'
      )}
    >
      {direction === 'previous' && (
        <ChevronLeft className="h-4 w-4 flex-none" />
      )}
      <span className="min-w-0">
        <small className="block text-[9px] uppercase text-muted-foreground">
          {direction}
        </small>
        <strong className="block truncate text-xs">
          {page?.shortTitle ??
            (direction === 'previous' ? 'Start of guide' : 'End of guide')}
        </strong>
      </span>
      {direction === 'next' && <ChevronRight className="h-4 w-4 flex-none" />}
    </button>
  )
}
