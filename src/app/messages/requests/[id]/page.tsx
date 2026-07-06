'use client'

import { useParams } from 'next/navigation'

import { RequestDetailView } from '../_components/request-detail-view'

export default function RequestDetailPage() {
  const { id } = useParams() as { id: string }
  return <RequestDetailView id={id} />
}
