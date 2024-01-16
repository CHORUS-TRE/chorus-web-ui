import React from "react"

export default function Navbar() {
  return (
      <nav className="w-full bg-transparent flex items-center p-4">
        <div className="w-full mx-auto items-center flex justify-between flex-wrap px-4">
          <a
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            href="/"
            onClick={e => e.preventDefault()}
          >
            Dashboard
          </a>
        </div>
      </nav>
  )
}
