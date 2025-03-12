import { cookies } from 'next/headers'

import { userMe } from '@/components/actions/user-view-model'
import { AppStateProvider } from '@/components/store/app-state-context'
import { AuthProvider } from '@/components/store/auth-context'

async function getInitialAuthState() {
  const cookieStore = cookies()
  const session = cookieStore.get('session')

  if (!session?.value) {
    return { authenticated: false, user: undefined }
  }

  try {
    const { data } = await userMe()
    return { authenticated: true, user: data }
  } catch (error) {
    console.error('Failed to get initial user state:', error)
    return { authenticated: false, user: undefined }
  }
}

export async function Providers({ children }: { children: React.ReactNode }) {
  const { authenticated, user } = await getInitialAuthState()

  return (
    <AuthProvider authenticated={authenticated} initialUser={user}>
      <AppStateProvider>{children}</AppStateProvider>
    </AuthProvider>
  )
}
