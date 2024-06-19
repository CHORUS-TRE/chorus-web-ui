import React from "react"
import Link from 'next/link'

export default function Navbar() {
  return (
      <nav className="w-full bg-transparent flex items-center p-4">
        <div className="w-full mx-auto items-center flex justify-between flex-wrap">
          <Link
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            href="/"
            onClick={e => e.preventDefault()}
          >
            Dashboard
          </Link>
        </div>
      </nav>
  )
}
