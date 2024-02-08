'use client'

import Link from "next/link"
import React, { useState, useEffect } from "react"
import AppStore from "../components/AppStore"
import ProjectCard from "../components/ProjectCard"
import Layout from "~/components/Layout"
import SidebarWidgets from "~/components/SidebarWidgets"
import ProjectList from "~/components/ProjectList"
import { useProject } from "~/hooks/useProjects"

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    document.body.classList.add('body-fixed')
    return () => {
      document.body.classList.remove('body-fixed')
    }
  }, [])

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

  const { project, isLoading, isError } = useProject()

  if (isLoading) return <div>loading</div>
  if (isError) return <div>error</div>

  return (
    <Layout>
      {showModal && <div className="p-5 h-full w-fit rounded-xl mx-auto absolute bg-white z-50 "><AppStore setShowModal={setShowModal} /></div>}
      <div className="container flex gap-4 h-full text-white">
        <div className="flex flex-col gap-4">
          <div className="p-5 rounded-xl shadow-sm bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
            <h1 className="text-2xl" suppressHydrationWarning>{getCurrentTime()}</h1>
            <p className="text-[12px] suppressHydrationWarning">{getCurrentDate()}</p>
          </div>
          <div className="gap-4 p-5 rounded-xl text-white  border-slate-700 border-solid border bg-slate-900 bg-opacity-50 backdrop-blur-sm h-full">
            <h3 className="text-xl text-white mb-2">My Projects</h3>
            <ProjectList />
            <h3 className="text-xl text-white mb-2 mt-5">Services</h3>
            <div className="text-white">GitLab</div>
            <div className="text-white">Sarus</div>
            <div className="text-white">Data Catalog</div>
            <div className="text-white">Kedro</div>
            <div className="text-white">Query</div>
            <div className="text-white">I2B2</div>
          </div>
        </div>
        <div className="flex flex-col gap-4 basis-3/4 _overflow-y-scroll h-full">
          <div className="gap-4 p-5 rounded-xl text-white  border-slate-700 border-solid border bg-slate-900 bg-opacity-50 backdrop-blur-sm h-full">
            <h3 className="text-xl text-white mb-2">Personal Workspace</h3>
            <ProjectCard key={'personal'} setShowModal={setShowModal} project={project!} />
          </div>
        </div>

        <SidebarWidgets />
      </div>
    </Layout>
  )
}