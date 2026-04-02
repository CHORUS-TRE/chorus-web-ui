'use client'

import { AlertCircle, FileText, Search } from 'lucide-react'

import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'

interface SearchResult {
  passage: string
  document: string
  title: string
  collection: string
  score: number
}

interface SearchResultsRendererProps {
  query: string
  collection: string
  results: SearchResult[]
  error?: string
}

const COLLECTION_LABELS: Record<string, string> = {
  bpr: 'BPR QMS',
  dsi: 'DSI',
  chorus: 'Chorus',
  all: 'All Collections'
}

export function SearchResultsRenderer({
  query,
  collection,
  results,
  error
}: SearchResultsRendererProps) {
  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-xs text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {error}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          Documentation Search
        </CardTitle>
        <CardDescription className="text-xs">
          {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;
          {query}&rdquo; in {COLLECTION_LABELS[collection] ?? collection}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {results.length === 0 && (
          <p className="py-4 text-center text-xs text-muted-foreground">
            No matching documents found.
          </p>
        )}
        {results.map((r, i) => (
          <div
            key={i}
            className="space-y-1 rounded-lg border border-muted/30 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="text-xs font-medium">{r.title}</span>
              </div>
              <Badge variant="secondary" className="shrink-0 text-[10px]">
                {COLLECTION_LABELS[r.collection] ?? r.collection}
              </Badge>
            </div>
            <p className="line-clamp-3 text-xs text-muted-foreground">
              {r.passage}
            </p>
            <p className="text-[10px] text-muted-foreground/60">{r.document}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
