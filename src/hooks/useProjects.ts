import React from 'react'
import useSWR from 'swr'
import fetcher from '../utils/fetch'
import { Project } from '../internal/client/models/Project'

export function useProject() {
  const { data, error, isLoading } = useSWR<Project>(`/api/rest/v1/projects/one`, fetcher)

  return {
    project: data,
    isLoading,
    isError: error
  }
}

export function useProjects() {
  const { data, error, isLoading } = useSWR<Project[]>(`/api/rest/v1/projects`, fetcher)

  return {
    projects: data,
    isLoading,
    isError: error
  }
}