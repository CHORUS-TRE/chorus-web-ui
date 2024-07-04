'use client'

import ErrorBoundary from '@/components/error-boundary'
import useViewModel from './user-list-view-model'
import { useEffect } from 'react'

export default function Portal() {
  const { getUsers, users } = useViewModel()

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <ErrorBoundary>
      {users.length === 0 ? (
        <div>loading...</div>
      ) : (
        users.map((user) => <div key={user.id}>{user.firstName}</div>)
      )}
    </ErrorBoundary>
  )
}
