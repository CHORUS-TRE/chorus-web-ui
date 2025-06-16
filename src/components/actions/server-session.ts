'use server'

import { cookies } from 'next/headers'

export const getSession = async () => {
  const cookieStore = await cookies()
  return cookieStore.get('session')?.value || ''
}
