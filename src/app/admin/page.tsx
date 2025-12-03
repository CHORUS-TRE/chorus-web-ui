'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAuthorizationViewModel } from '~/view-model/authorization-view-model'

const AdminPage = () => {
  const router = useRouter()
  const { canManageUsers, canManageSettings } = useAuthorizationViewModel()

  useEffect(() => {
    // Redirect to first authorized tab
    if (canManageSettings) {
      router.replace('/admin/theme')
    } else if (canManageUsers) {
      router.replace('/admin/users')
    }
  }, [router, canManageUsers, canManageSettings])

  return (
    <div className="flex h-full w-full items-center justify-center">
      Select a section to manage
    </div>
  )
}

export default AdminPage
