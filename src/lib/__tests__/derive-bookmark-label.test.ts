import { deriveBookmarkLabel } from '@/lib/derive-bookmark-label'

describe('deriveBookmarkLabel', () => {
  describe('static routes', () => {
    it('handles root as Dashboard', () => {
      expect(deriveBookmarkLabel('/')).toEqual({
        label: 'Dashboard',
        icon: 'GaugeCircle'
      })
    })

    it('handles /dashboard as Dashboard', () => {
      expect(deriveBookmarkLabel('/dashboard')).toEqual({
        label: 'Dashboard',
        icon: 'GaugeCircle'
      })
    })

    it('handles /workspaces', () => {
      expect(deriveBookmarkLabel('/workspaces')).toEqual({
        label: 'Workspaces',
        icon: 'Package'
      })
    })

    it('handles /sessions', () => {
      expect(deriveBookmarkLabel('/sessions')).toEqual({
        label: 'Sessions',
        icon: 'LaptopMinimal'
      })
    })

    it('handles /data', () => {
      expect(deriveBookmarkLabel('/data')).toEqual({
        label: 'Data',
        icon: 'Database'
      })
    })

    it('handles /app-store', () => {
      expect(deriveBookmarkLabel('/app-store')).toEqual({
        label: 'App Store',
        icon: 'Store'
      })
    })

    it('handles /messages', () => {
      expect(deriveBookmarkLabel('/messages')).toEqual({
        label: 'Messages',
        icon: 'Mail'
      })
    })

    it('handles /settings', () => {
      expect(deriveBookmarkLabel('/settings')).toEqual({
        label: 'Settings',
        icon: 'Settings'
      })
    })

    it('handles /admin', () => {
      expect(deriveBookmarkLabel('/admin')).toEqual({
        label: 'Admin',
        icon: 'Shield'
      })
    })
  })

  describe('dynamic routes', () => {
    it('uses workspace name from context', () => {
      expect(
        deriveBookmarkLabel('/workspaces/20', { workspaceName: 'Genomics' })
      ).toEqual({ label: 'Genomics', icon: 'Package' })
    })

    it('falls back to Workspace {id} without context', () => {
      expect(deriveBookmarkLabel('/workspaces/20')).toEqual({
        label: 'Workspace 20',
        icon: 'Package'
      })
    })

    it('uses session name from context', () => {
      expect(
        deriveBookmarkLabel('/workspaces/20/sessions/28', {
          sessionName: 'Analysis'
        })
      ).toEqual({ label: 'Analysis', icon: 'LaptopMinimal' })
    })

    it('falls back to Session {id} without context', () => {
      expect(deriveBookmarkLabel('/workspaces/20/sessions/28')).toEqual({
        label: 'Session 28',
        icon: 'LaptopMinimal'
      })
    })

    it('handles /data/{folder}', () => {
      expect(deriveBookmarkLabel('/data/genomics')).toEqual({
        label: 'Data > Genomics',
        icon: 'Database'
      })
    })
  })

  describe('admin routes', () => {
    it('handles /admin/{section}', () => {
      expect(deriveBookmarkLabel('/admin/users')).toEqual({
        label: 'Admin > Users',
        icon: 'Shield'
      })
    })

    it('title-cases hyphenated admin sections', () => {
      expect(deriveBookmarkLabel('/admin/data-requests')).toEqual({
        label: 'Admin > Data Requests',
        icon: 'Shield'
      })
    })

    it('handles /admin/{section}/{id} with entityName context', () => {
      expect(
        deriveBookmarkLabel('/admin/users/42', { entityName: 'Ada Lovelace' })
      ).toEqual({ label: 'Admin > Users > Ada Lovelace', icon: 'Shield' })
    })

    it('falls back to id for /admin/{section}/{id} without context', () => {
      expect(deriveBookmarkLabel('/admin/users/42')).toEqual({
        label: 'Admin > Users > 42',
        icon: 'Shield'
      })
    })
  })

  describe('unknown routes', () => {
    it('title-cases the last path segment', () => {
      expect(deriveBookmarkLabel('/some-random/nested-path')).toEqual({
        label: 'Nested Path',
        icon: 'Bookmark'
      })
    })
  })

  it('normalizes routes before matching', () => {
    expect(deriveBookmarkLabel('/workspaces/?foo=1')).toEqual({
      label: 'Workspaces',
      icon: 'Package'
    })
    expect(deriveBookmarkLabel('/admin/users/')).toEqual({
      label: 'Admin > Users',
      icon: 'Shield'
    })
  })
})
