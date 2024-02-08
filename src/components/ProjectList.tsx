'use client'

import React from 'react'
import { useProjects } from '~/hooks/useProjects'

export default function ProjectList() {
  const { projects, isLoading, isError } = useProjects()

  if (isLoading) return <div>loading</div>
  if (isError) return <div>error</div>

  return (
    <nav className=' text-white '>
      {projects?.map((project, index) => (
        <div className="text-white" key={project.name}>{project.shortName}</div>
      ))}
    </nav>
  )
}