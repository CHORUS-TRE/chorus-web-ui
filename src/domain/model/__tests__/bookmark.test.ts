import {
  BOOKMARK_LABEL_MAX,
  normalizeRoute,
  validateLabel
} from '@/domain/model/bookmark'

describe('normalizeRoute', () => {
  it('keeps simple paths unchanged', () => {
    expect(normalizeRoute('/dashboard')).toBe('/dashboard')
    expect(normalizeRoute('/')).toBe('/')
  })

  it('strips trailing slashes except for root', () => {
    expect(normalizeRoute('/workspaces/')).toBe('/workspaces')
    expect(normalizeRoute('/workspaces/20/')).toBe('/workspaces/20')
    expect(normalizeRoute('/workspaces///')).toBe('/workspaces')
    expect(normalizeRoute('/')).toBe('/')
  })

  it('strips query params', () => {
    expect(normalizeRoute('/app-store?tab=services')).toBe('/app-store')
    expect(normalizeRoute('/data?filter=images')).toBe('/data')
  })

  it('strips hash fragments', () => {
    expect(normalizeRoute('/settings#profile')).toBe('/settings')
  })

  it('strips both query and hash', () => {
    expect(normalizeRoute('/app-store?tab=services#foo')).toBe('/app-store')
  })

  it('keeps dynamic segments', () => {
    expect(normalizeRoute('/workspaces/20/sessions/28')).toBe(
      '/workspaces/20/sessions/28'
    )
  })
})

describe('validateLabel', () => {
  it('trims and accepts valid labels', () => {
    expect(validateLabel('Dashboard')).toBe('Dashboard')
    expect(validateLabel('  Dashboard  ')).toBe('Dashboard')
  })

  it('rejects empty / whitespace-only labels', () => {
    expect(validateLabel('')).toBe(null)
    expect(validateLabel('   ')).toBe(null)
  })

  it(`rejects labels longer than ${BOOKMARK_LABEL_MAX}`, () => {
    expect(validateLabel('a'.repeat(BOOKMARK_LABEL_MAX))).toBe(
      'a'.repeat(BOOKMARK_LABEL_MAX)
    )
    expect(validateLabel('a'.repeat(BOOKMARK_LABEL_MAX + 1))).toBe(null)
  })
})
