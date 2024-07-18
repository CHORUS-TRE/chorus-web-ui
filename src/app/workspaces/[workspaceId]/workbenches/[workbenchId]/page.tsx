import React from 'react'
import Workbench from '@/components/workbench'

export default function Page({ params }: { params: { slug: string } }) {
  return <Workbench />
}
