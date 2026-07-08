import { act, renderHook } from '@testing-library/react'

import { useFileSystem } from '../use-file-system'

describe('useFileSystem request queue state', () => {
  it('adds an item to the download queue when toggled on', () => {
    const { result } = renderHook(() => useFileSystem())

    act(() => {
      result.current.toggleDownloadItem('file-1')
    })

    expect(result.current.state.downloadQueueItems).toEqual(['file-1'])
    expect(result.current.state.transferQueueItems).toEqual([])
  })

  it('removes an item from the download queue when toggled again', () => {
    const { result } = renderHook(() => useFileSystem())

    act(() => {
      result.current.toggleDownloadItem('file-1')
    })
    act(() => {
      result.current.toggleDownloadItem('file-1')
    })

    expect(result.current.state.downloadQueueItems).toEqual([])
  })

  it('respects the force parameter', () => {
    const { result } = renderHook(() => useFileSystem())

    act(() => {
      result.current.toggleDownloadItem('file-1', true)
    })
    act(() => {
      result.current.toggleDownloadItem('file-1', true)
    })

    expect(result.current.state.downloadQueueItems).toEqual(['file-1'])
  })

  it('allows the same item in both the download and transfer queues independently', () => {
    const { result } = renderHook(() => useFileSystem())

    act(() => {
      result.current.toggleDownloadItem('file-1')
      result.current.toggleTransferItem('file-1')
    })

    expect(result.current.state.downloadQueueItems).toEqual(['file-1'])
    expect(result.current.state.transferQueueItems).toEqual(['file-1'])

    act(() => {
      result.current.toggleDownloadItem('file-1')
    })

    expect(result.current.state.downloadQueueItems).toEqual([])
    expect(result.current.state.transferQueueItems).toEqual(['file-1'])
  })

  it('clearRequestQueue empties both download and transfer queues', () => {
    const { result } = renderHook(() => useFileSystem())

    act(() => {
      result.current.toggleDownloadItem('file-1')
      result.current.toggleTransferItem('file-2')
    })
    act(() => {
      result.current.clearRequestQueue()
    })

    expect(result.current.state.downloadQueueItems).toEqual([])
    expect(result.current.state.transferQueueItems).toEqual([])
  })
})
