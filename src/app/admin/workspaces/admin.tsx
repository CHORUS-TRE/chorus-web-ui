'use client'
import dynamic from 'next/dynamic'

const AdminApp = dynamic(() => import('./admin-app'), {
  ssr: false // Required to avoid react-router related errors
})

export default AdminApp
