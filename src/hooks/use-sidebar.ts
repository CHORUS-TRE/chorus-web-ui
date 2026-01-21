'use client'

import { create } from 'zustand'

interface SidebarStore {
  isOpen: boolean
  toggle: () => void
  setOpen: (open: boolean) => void
}

export const useSidebar = create<SidebarStore>((set) => ({
  isOpen:
    typeof window !== 'undefined'
      ? (() => {
          try {
            const saved = localStorage.getItem('leftSidebarOpen')
            return saved !== null ? JSON.parse(saved) : true
          } catch {
            return true
          }
        })()
      : true,
  toggle: () =>
    set((state) => {
      const newState = !state.isOpen
      if (typeof window !== 'undefined') {
        localStorage.setItem('leftSidebarOpen', JSON.stringify(newState))
      }
      return { isOpen: newState }
    }),
  setOpen: (open) =>
    set(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('leftSidebarOpen', JSON.stringify(open))
      }
      return { isOpen: open }
    })
}))
