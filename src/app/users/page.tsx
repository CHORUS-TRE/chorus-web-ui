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
      <div>
        {users?.data === null && <div>loading...</div>}
        {users?.error && <div>error: {JSON.stringify(users?.error)}</div>}
        {users?.data &&
          users.data.map((user) => (
            <pre key={user.id}>{JSON.stringify(user, null, 2)}</pre>
          ))}
      </div>
    </ErrorBoundary>
  )
}
