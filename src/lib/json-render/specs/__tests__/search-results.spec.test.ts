import { buildSearchResultsSpec } from '../search-results.spec'

const results = [
  {
    passage: 'text one',
    document: '/bpr/sop-01.md',
    title: 'SOP 01',
    collection: 'bpr' as const,
    score: 0.9
  },
  {
    passage: 'text two',
    document: '/dsi/form.md',
    title: 'Form',
    collection: 'dsi' as const,
    score: 0.7
  }
]

describe('buildSearchResultsSpec', () => {
  test('root element is a Card', () => {
    const spec = buildSearchResultsSpec({
      query: 'ethics',
      collection: 'bpr',
      results
    })
    expect(spec.elements['root'].type).toBe('Card')
  })

  test('results are set in initial state', () => {
    const spec = buildSearchResultsSpec({
      query: 'ethics',
      collection: 'bpr',
      results
    })
    const state = spec.state as Record<string, unknown>
    expect((state.results as unknown[]).length).toBe(2)
    expect((state.results as Array<{ title: string }>)[0].title).toBe('SOP 01')
  })

  test('results-list uses repeat over /results', () => {
    const spec = buildSearchResultsSpec({
      query: 'ethics',
      collection: 'bpr',
      results
    })
    const list = spec.elements['results-list']
    expect(list.repeat?.statePath).toBe('/results')
  })

  test('result-item is a SearchResultItem with $item bindings', () => {
    const spec = buildSearchResultsSpec({
      query: 'ethics',
      collection: 'bpr',
      results
    })
    const item = spec.elements['result-item']
    const props = item.props as Record<string, unknown>
    expect(item.type).toBe('SearchResultItem')
    expect(props.title).toEqual({ $item: 'title' })
    expect(props.passage).toEqual({ $item: 'passage' })
    expect(props.document).toEqual({ $item: 'document' })
    expect(props.collection).toEqual({ $item: 'collection' })
  })

  test('error element is visible when state.error is set', () => {
    const spec = buildSearchResultsSpec({
      query: 'q',
      collection: 'all',
      results: [],
      error: 'fail'
    })
    expect((spec.state as Record<string, unknown>).error).toBe('fail')
    const errorEl = spec.elements['error-view']
    expect(errorEl.visible).toEqual({ $state: '/error' })
  })

  test('subtitle shows result count and query', () => {
    const spec = buildSearchResultsSpec({
      query: 'consent',
      collection: 'bpr',
      results
    })
    const subtitle = spec.elements['subtitle']
    const props = subtitle.props as Record<string, unknown>
    expect(props.text).toContain('consent')
    expect(props.text).toContain('2')
  })
})
