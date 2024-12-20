import Link from 'next/link'
import { Settings } from 'lucide-react'

import ServiceStore from '~/components/service-store'

export default function Page() {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="mt-5 text-white">Services</h2>
        <Link href="#" className="mt-5 cursor-default text-muted">
          <Settings />
        </Link>
      </div>
      <ServiceStore />
    </>
  )
}
