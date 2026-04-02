import { type Spec } from '@json-render/core'

interface SearchResult {
  passage: string
  document: string
  title: string
  collection: 'bpr' | 'dsi' | 'chorus' | 'all'
  score: number
}

interface SearchResultsSpecInput {
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

export function buildSearchResultsSpec({
  query,
  collection,
  results,
  error
}: SearchResultsSpecInput): Spec {
  const elements: Spec['elements'] = {}
  const count = results.length

  elements['title'] = {
    type: 'Heading',
    props: { text: 'Documentation Search', level: null }
  }

  elements['subtitle'] = {
    type: 'Text',
    props: {
      text: `${count} result${count !== 1 ? 's' : ''} for "${query}" in ${COLLECTION_LABELS[collection] ?? collection}`,
      variant: 'muted'
    }
  }

  elements['header'] = {
    type: 'Stack',
    props: { direction: 'vertical', gap: 'sm', align: null, justify: null },
    children: ['title', 'subtitle']
  }

  elements['result-item'] = {
    type: 'SearchResultItem',
    props: {
      title: { $item: 'title' },
      collection: { $item: 'collection' },
      passage: { $item: 'passage' },
      document: { $item: 'document' }
    }
  }

  elements['results-list'] = {
    type: 'Stack',
    props: { direction: 'vertical', gap: 'sm', align: null, justify: null },
    repeat: { statePath: '/results', key: 'document' },
    children: ['result-item']
  }

  elements['empty-view'] = {
    type: 'Text',
    props: { text: 'No matching documents found.', variant: 'muted' },
    visible: { $state: '/empty' }
  }

  elements['error-view'] = {
    type: 'Alert',
    props: {
      title: { $state: '/error' } as Record<string, string>,
      message: null,
      type: 'error'
    },
    visible: { $state: '/error' }
  }

  elements['content'] = {
    type: 'Stack',
    props: { direction: 'vertical', gap: 'sm', align: null, justify: null },
    children: ['error-view', 'empty-view', 'results-list']
  }

  elements['root'] = {
    type: 'Card',
    props: { title: null, description: null, maxWidth: null, centered: null },
    children: ['header', 'content']
  }

  return {
    root: 'root',
    elements,
    state: {
      results,
      error: error ?? null,
      empty: !error && results.length === 0
    }
  }
}
