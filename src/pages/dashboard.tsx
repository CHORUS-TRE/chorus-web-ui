'use client'

import React, { useState, useEffect } from "react"
import AppStore from "../components/AppStore"
import ProjectCard from "../components/ProjectCard"
import Layout from "~/components/Layout"
import SidebarWidgets from "~/components/SidebarWidgets"
import { useProject } from "~/hooks/useProjects"
import Sidebar from "~/components/Sidebar"

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    document.body.classList.add('body-fixed')
    return () => {
      document.body.classList.remove('body-fixed')
    }
  }, [])


  const { project, isLoading, isError } = useProject()


  return (
    <Layout>
      {isLoading && <div className="text-white">loading</div>}
      {isError && <div className="text-white">error</div>}
      {showModal && <div className="p-5 h-full w-fit rounded-xl mx-auto absolute bg-white z-50 "><AppStore setShowModal={setShowModal} /></div>}
      {!isLoading && !isError &&
        <div className="container flex gap-3 h-full text-white">
          <Sidebar />
          <div className="flex flex-col gap-3 basis-3/4 _overflow-y-scroll h-full">
            <div className="gap-3 p-5 rounded-xl text-white  border-slate-700 border-solid border bg-slate-900 bg-opacity-50 backdrop-blur-sm h-full">
              <h3 className="text-xl text-white mb-2">Personal Workspace</h3>
              <ProjectCard key={'personal'} setShowModal={setShowModal} project={project!} />
            </div>
          </div>
          <SidebarWidgets />
        </div>
      }

    </Layout>
  )
}
