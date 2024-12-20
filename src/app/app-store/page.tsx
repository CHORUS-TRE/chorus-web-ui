import Link from 'next/link'
import { Settings } from 'lucide-react'

import { AppStoreView } from '~/components/app-store-view'

export default function Page() {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="mt-5 text-white">App Store</h2>
        <Link href="#" className="mt-5 cursor-default text-muted">
          <Settings />
        </Link>
      </div>
      <AppStoreView />
    </>
  )
}
