'use client'

import { redirect } from 'next/navigation'

export default function RequestsRedirect() {
  redirect('/messages?type=requests')
}
