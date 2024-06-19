import Link from 'next/link'
import Router from 'next/router'
import React, { useState, useEffect, useRef } from 'react'
import { HiFilm, HiArrowsExpand, HiOutlineCloudDownload, HiOutlineCloudUpload, HiArrowSmLeft, HiLogout, HiOutlineUsers, HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/hi'

export default function Component() {
  const [showSidebar, setShowSidebar] = useState(true)
  const sidebarRef = useRef(null)

  useEffect(() => {
    const handleOutSideClick = (event: MouseEvent) => {
      if (sidebarRef.current && !(sidebarRef.current as HTMLElement).contains(event.target as Node)) {
        setShowSidebar(false)
      }
    }

    window.addEventListener("mousedown", handleOutSideClick)

    return () => {
      window.removeEventListener("mousedown", handleOutSideClick)
    }
  }, [sidebarRef])

  return (
    <div
      ref={sidebarRef}
      className={`absolute flex items-center
      transform transition-transform ${showSidebar ? "translate-x-0" : "-translate-x-[calc(100%-2rem)]"}
      border-yellow-400 border-solid border-0`}
    >
      <div className={`flex-auto
        border-cyan-700 border-solid border-0 rounded-md p-3
        bg-white bg-opacity-70 backdrop-blur-lg backdrop-filter shadow-md
        `} aria-label="Horus Analytics">
        <h1 className='text-md  mb-2 text-gray-800'>Jupyter</h1>
        <p className='text-xs mb-2 text-gray-800'>CHUV - Albert Leevert</p>
        <hr />
        <ul className="space-y-1 mt-2">
          <li>
            <Link href="/dashboard" onClick={() => Router.back()} className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700 hover:text-gray-500 active:text-gray-300">
              <HiArrowSmLeft />
              <span className="text-sm font-medium"> Return to Dashboard </span>
            </Link>
            <hr />
          </li>
          <li>
            <Link href="/dashboard" onClick={e => e.preventDefault()} className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700">
              <HiOutlineCloudUpload />
              <span className="text-sm font-medium"> Upload </span>
            </Link>
            <hr />
          </li>
          <li>
            <Link href="/dashboard" onClick={e => e.preventDefault()} className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700">
              <HiOutlineCloudDownload />
              <span className="text-sm font-medium"> Download </span>
            </Link>
            <hr />
          </li>
          <li>
            <Link href="/dashboard" onClick={e => e.preventDefault()} className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700">
              <HiOutlineUsers />
              <span className="text-sm font-medium"> Collaborate </span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard" onClick={e => e.preventDefault()} className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700">
              <HiArrowsExpand />
              <span className="text-sm font-medium"> Fullscreen </span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard" onClick={e => e.preventDefault()} className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700">
              <HiFilm />
              <span className="text-sm font-medium"> Screenshot </span>
            </Link>
          </li>
          <li>
            <Link href="/dashboard" onClick={e => e.preventDefault()} className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-700">
              <HiLogout />
              <span className="text-sm font-medium"> Logout </span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-wrap">
        <button className="p-1 ml-1 bg-green-400 text-white
          bg-opacity-60 backdrop-blur-lg backdrop-filter
          rounded" onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? <HiOutlineChevronDoubleLeft /> : <HiOutlineChevronDoubleRight />}
        </button>
      </div>
    </div>
  )
}
