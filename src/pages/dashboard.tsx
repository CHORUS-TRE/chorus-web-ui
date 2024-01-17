'use client'

import React, { use, useEffect } from "react"
import Navbar from "../components/Navbar"
import Link from "next/link"
import { HiOutlineGlobe, HiDotsVertical, HiOutlineFolderOpen, HiViewGridAdd, HiUserGroup, HiFolderAdd, HiOutlineTrendingUp, HiOutlineTrendingDown, HiDatabase, HiOutlineWifi } from 'react-icons/hi'
import { HiArrowSmRight, HiChartPie, HiUser } from 'react-icons/hi'
import AppStore from "~/components/AppStore"

export default function Dashboard() {
  const [showModal, setShowModal] = React.useState(false)
  const [showAppMenu, setShowAppMenu] = React.useState(false)

  const getCurrentTime = () => new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const getCurrentDate = () => new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })


  return (
    <>
      {showModal && <AppStore setShowModal={setShowModal} />}
      <div
        className="bg-cover border-cyan-700 border-solid border-0 "
        style={{
          height: "100vh",
          backgroundImage:
            "url(" +
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1124&q=100" +
            ")",
        }}
      >
        <div className={`container h-full mx-auto px-16 py-4 flex flex-col gap-4 border-purple-600 border-solid border-0 ${showModal && 'opacity-30'}`}>
          <div className="bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border"><Navbar /></div>
          <div className="container flex gap-4 border-yellow-600 border-solid border-0">
            <div className="text-white basis-1/4 flex flex-col gap-4 border-orange-600 border-solid border-0">
              <div className="p-5 rounded-xl shadow-sm bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
                <h1 className="text-2xl" suppressHydrationWarning>{getCurrentTime()}</h1>
                <p className="text-[12px]">{getCurrentDate()}</p>
              </div>
              <div className="p-5 rounded-xl shadow-sm bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
                <h2 className="text-md mb-3">Eco Tracker</h2>
                <div className="flex flex-row gap-4 items-center">
                  <HiOutlineGlobe className="h-20 w-20" />
                  <div className="flex flex-col">
                    <p className="text-[12px]">Carbon Emissions: 0.5kg</p>
                    <p className="text-[12px]">Energy Consumption: 0.5kg</p>
                    <p className="text-[12px]">Emissions Over Time: +10%</p>
                    <p className="text-[12px]">Comparison to Average: -25%</p>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-xl shadow-sm bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
                <h2 className="text-md  mb-3">System Status</h2>
                <div className="flex flex-row gap-16">
                  <div className="flex flex-col">
                    <HiOutlineTrendingUp className="h-20 w-20" />
                    <p className="text-[12px] text-center">RAM: 32Mo</p>
                  </div>
                  <div className="flex flex-col">
                    <HiOutlineTrendingDown className="h-20 w-20" />
                    <p className="text-[12px] text-center">GPU: 58%</p>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-xl shadow-sm bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
                <h2 className="text-md mb-3">Storage</h2>
                <div className="flex flex-row gap-4 items-center">
                  <HiDatabase className="h-20 w-20" />
                  <div className="flex flex-col">
                    <p className="text-[12px]">Used: 17Mo</p>
                    <p className="text-[12px]">Total: 10Go</p>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-xl shadow-sm bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
                <h2 className="text-md mb-3">Network</h2>
                <HiOutlineWifi className="h-20 w-20" />
              </div>
            </div>
            <div className="flex flex-col gap-4 basis-3/4 ">
              <div className="flex flex-row gap-4">
                <div className="basis-1/2 p-5 rounded-xl text-white bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
                  <h2 className="mb-3">Important Announcement</h2>
                  <p className="text-[12px]">And I will strike down upon thee with great vengeance and furious anger those who attempt to poison and destroy my brothers. And you will know my name is the Lord when I lay my vengeance upon thee.</p>
                  <button className="bg-sky-500 hover:bg-sky-700 rounded px-2 py-1 text-[12px] float-right">
                    More...
                  </button>
                </div>
                <div className="basis-1/2 p-5 rounded-xl text-white bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
                  <h2 className="mb-3">CHUV Research Days 2024</h2>
                  <p className="text-[12px]">And I will strike down upon thee with great vengeance and furious anger those who attempt to poison and destroy my brothers. And you will know my name is the Lord when I lay my vengeance upon thee.</p>
                  <button className="bg-sky-500 hover:bg-sky-700 rounded px-2 py-1 text-[12px] float-right">
                    More...
                  </button>
                </div>
              </div>
              <div className="p-5 rounded-xl text-white  border-slate-700 border-solid border bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                <h1 className="text-md mb-3">CHUV</h1>
                <div className="flex flex-row gap-4">
                  <div className="w-64 h-32 flex flex-col p-3 rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                    <p className="text-sm font-bold">Data</p>
                    <p className="text-sm">Used: 16 Mo</p>
                    <p className="text-sm">Total: 32 Go</p>
                  </div>
                  <div className="w-32 h-32 flex justify-center items-center rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                    <Link href="/workbench" passHref className="text-center  hover:text-slate-500">
                      <HiOutlineFolderOpen className="w-12 h-12" />
                      <p className="text-[12px]">Files</p>
                    </Link>
                  </div>
                  <div className="w-32 h-32 flex justify-center items-center rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                    <Link legacyBehavior href="#" className="text-center  hover:text-slate-500">
                      <a onClick={() => setShowModal(true)} className=" hover:text-slate-500">
                        <HiViewGridAdd className="w-12 h-12" />
                        <p className="text-[12px]">App Store</p>
                      </a>
                    </Link>
                  </div>
                  {/* <div className="w-32 h-32 flex justify-center items-center rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                    <Link href="/" passHref className="text-center  hover:text-slate-500">
                      <HiFolderAdd className="w-12 h-12" />
                      <p className="text-[12px]">Services</p>
                    </Link>
                  </div> */}
                  <div className="w-32 h-32 flex justify-center items-center rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                    <Link href="/" passHref className="text-center  hover:text-slate-500">
                      <HiUserGroup className="w-12 h-12" />
                      <p className="text-[12px]">Members</p>
                    </Link>
                  </div>
                  <div>
                    <div className="w-32 h-32 flex flex-col justify-center items-center rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                      <button onClick={() => (setShowAppMenu(!showAppMenu))}
                        className="text-white hover:text-slate-500 absolute top-1 right-1">
                        <HiDotsVertical />
                      </button>
                      {showAppMenu && <div className={`absolute left-32 flex-auto
                      border-cyan-700 border-solid border-0 rounded-md p-3
                      bg-white bg-opacity-30 backdrop-blur-lg backdrop-filter shadow-md
                      `} aria-label="Horus Analytics">
                        <ul className="space-y-1">
                          <li>
                            <Link href="/workbench" className="flex items-center gap-2 rounded-lg px-4 py-2  hover:text-slate-400">
                              <HiChartPie />
                              <span className="text-sm font-medium"> Open</span>
                            </Link>
                          </li>
                          <li>
                            <a href="" className="flex items-center gap-2 rounded-lg px-4 py-2 hover:text-slate-400">
                              <HiUser />
                              <span className="text-sm font-medium"> Uninstall </span>
                            </a>
                          </li>
                          <li>
                            <a href="" className="flex items-center gap-2 rounded-lg px-4 py-2 hover:text-slate-400">
                              <HiArrowSmRight />
                              <span className="text-sm font-medium"> Pause </span>
                            </a>
                          </li>
                          <li>
                            <a href="" className="flex items-center gap-2 rounded-lg px-4 py-2 hover:text-slate-400">
                              <HiArrowSmRight />
                              <span className="text-sm font-medium"> Settings </span>
                            </a>
                          </li>

                        </ul>
                      </div>}
                      <Link href="/workbench" passHref className="text-center  hover:opacity-40">
                        <img src="/jupyter.png" className="w-12 h-12 rounded-xl mb-1" />
                        <p className="text-[12px]">Jupyter</p>
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
              <div className="p-5 rounded-xl text-white border-slate-700 border-solid border bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                <h1 className="text-md mb-3">Integrated analysis of tumor vessels and immune cells in
                  glioblastoma</h1>
                <div className="flex flex-row gap-4">
                  <div className="w-64 h-32 flex flex-col p-3 rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                    <p className="text-sm mb-2">PI: Pr. Jean-François Tliuageqwf</p>
                    <p className="text-sm font-bold">Data</p>
                    <p className="text-sm">Used: 16 Mo</p>
                    <p className="text-sm">Total: 32 Go</p>
                  </div>
                  <div className="w-32 h-32 flex justify-center items-center rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                    <Link href="/workbench" passHref className="text-center  hover:text-slate-500">
                      <HiOutlineFolderOpen className="w-12 h-12" />
                      <p className="text-[12px]">Files</p>
                    </Link>
                  </div>
                  <div className="w-32 h-32 flex justify-center items-center rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                    <Link legacyBehavior href="#" className="text-center  hover:text-slate-500">
                      <a onClick={() => setShowModal(true)} className="hover:text-slate-500">
                        <HiViewGridAdd className="w-12 h-12" />
                        <p className="text-[12px]">App Store</p>
                      </a>
                    </Link>
                  </div>
                  <div className="w-32 h-32 flex justify-center items-center rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                    <Link href="/" passHref className="text-center  hover:text-slate-500">
                      <HiUserGroup className="w-12 h-12" />
                      <p className="text-[12px]">Members</p>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-xl text-white  border-slate-700 border-solid border bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                <h1 className="text-md mb-3">Hypnosis-aided awake craniotomy versus monitored anesthesia care for brain tumors (HAMAC Study)</h1>
                <div className="flex flex-row gap-4">
                  <div className="w-32 h-32 flex justify-center items-center rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                    <Link href="/workbench" passHref className="text-center  hover:text-slate-500">
                      <HiOutlineFolderOpen className="w-12 h-12" />
                      <p className="text-[12px]">Files</p>
                    </Link>
                  </div>
                  <div className="w-32 h-32 flex justify-center items-center rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                    <Link legacyBehavior href="#" className="text-center  hover:text-slate-500">
                      <a onClick={() => setShowModal(true)} className="hover:text-slate-500">
                        <HiViewGridAdd className="w-12 h-12" />
                        <p className="text-[12px]">App Store</p>
                      </a>
                    </Link>
                  </div>
                  <div className="w-32 h-32 flex justify-center items-center rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                    <Link href="/" passHref className="text-center  hover:text-slate-500">
                      <HiFolderAdd className="w-12 h-12" />
                      <p className="text-[12px]">Services</p>
                    </Link>
                  </div>
                  <div className="w-32 h-32 flex justify-center items-center rounded-xl bg-slate-900 bg-opacity-50 backdrop-blur-sm">
                    <Link href="/" passHref className="text-center  hover:text-slate-500">
                      <HiUserGroup className="w-12 h-12" />
                      <p className="text-[12px]">Members</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}