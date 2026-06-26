import { TermsOfUseApiDataSourceImpl } from '@/data/data-source'

import { TermsOfUseRepositoryImpl } from '../terms-of-use-repository-impl'

const makeDs = (
  overrides: Partial<TermsOfUseApiDataSourceImpl>
): TermsOfUseApiDataSourceImpl => {
  const ds = Object.create(TermsOfUseApiDataSourceImpl.prototype)
  return Object.assign(ds, overrides)
}

describe('TermsOfUseRepositoryImpl.getMyStatus', () => {
  it('returns true when user has accepted', async () => {
    const ds = makeDs({
      getMyStatus: () =>
        Promise.resolve({ result: { status: { accepted: true } } })
    })
    const repo = new TermsOfUseRepositoryImpl(ds)
    const result = await repo.getMyStatus()
    expect(result.error).toBeUndefined()
    expect(result.data).toBe(true)
  })

  it('returns false when user has not accepted', async () => {
    const ds = makeDs({
      getMyStatus: () =>
        Promise.resolve({ result: { status: { accepted: false } } })
    })
    const repo = new TermsOfUseRepositoryImpl(ds)
    const result = await repo.getMyStatus()
    expect(result.data).toBe(false)
  })

  it('returns false when status is missing', async () => {
    const ds = makeDs({
      getMyStatus: () => Promise.resolve({ result: {} })
    })
    const repo = new TermsOfUseRepositoryImpl(ds)
    const result = await repo.getMyStatus()
    expect(result.data).toBe(false)
  })

  it('returns error on network failure', async () => {
    const ds = makeDs({
      getMyStatus: () => Promise.reject(new Error('network error'))
    })
    const repo = new TermsOfUseRepositoryImpl(ds)
    const result = await repo.getMyStatus()
    expect(result.error?.message).toBe('network error')
  })
})

describe('TermsOfUseRepositoryImpl.getCurrentVersion', () => {
  it('returns null when no published version exists', async () => {
    const ds = makeDs({
      getCurrentVersion: () => Promise.resolve({ result: {} })
    })
    const repo = new TermsOfUseRepositoryImpl(ds)
    const result = await repo.getCurrentVersion()
    expect(result.error).toBeUndefined()
    expect(result.data).toBeNull()
  })

  it('returns version when published version exists', async () => {
    const ds = makeDs({
      getCurrentVersion: () =>
        Promise.resolve({
          result: {
            termsOfUseVersion: {
              id: '1',
              content: 'You agree to...',
              status: 'TERMS_OF_USE_VERSION_STATUS_PUBLISHED'
            }
          }
        })
    })
    const repo = new TermsOfUseRepositoryImpl(ds)
    const result = await repo.getCurrentVersion()
    expect(result.error).toBeUndefined()
    expect(result.data?.id).toBe('1')
    expect(result.data?.content).toBe('You agree to...')
  })

  it('returns error on network failure', async () => {
    const ds = makeDs({
      getCurrentVersion: () => Promise.reject(new Error('timeout'))
    })
    const repo = new TermsOfUseRepositoryImpl(ds)
    const result = await repo.getCurrentVersion()
    expect(result.error?.message).toBe('timeout')
  })
})

describe('TermsOfUseRepositoryImpl.listVersions', () => {
  it('returns empty array when no versions exist', async () => {
    const ds = makeDs({
      listVersions: () => Promise.resolve({ result: {} })
    })
    const repo = new TermsOfUseRepositoryImpl(ds)
    const result = await repo.listVersions()
    expect(result.data).toEqual([])
  })

  it('returns parsed versions', async () => {
    const ds = makeDs({
      listVersions: () =>
        Promise.resolve({
          result: {
            termsOfUseVersions: [
              { id: '1', status: 'TERMS_OF_USE_VERSION_STATUS_DRAFT' },
              { id: '2', status: 'TERMS_OF_USE_VERSION_STATUS_PUBLISHED' }
            ]
          }
        })
    })
    const repo = new TermsOfUseRepositoryImpl(ds)
    const result = await repo.listVersions()
    expect(result.data).toHaveLength(2)
    expect(result.data![0].id).toBe('1')
  })
})
