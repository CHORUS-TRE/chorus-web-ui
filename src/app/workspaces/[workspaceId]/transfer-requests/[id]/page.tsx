'use client'

import { useParams } from 'next/navigation'

import { RequestDetailView } from '@/app/messages/requests/_components/request-detail-view'

export default function WorkspaceTransferRequestDetailPage() {
  const { id } = useParams() as { workspaceId: string; id: string }
  return <RequestDetailView id={id} />
}
