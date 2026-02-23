import {
  Brain,
  Briefcase,
  Code,
  Database,
  Globe,
  Grid,
  Hospital,
  Shield
} from 'lucide-react'
import React from 'react'

import { App } from '~/domain/model'

export const CATEGORIES = [
  { id: 'all', label: 'All Apps', icon: <Grid className="h-4 w-4" /> },
  {
    id: 'productivity',
    label: 'Productivity',
    icon: <Briefcase className="h-4 w-4" />
  },
  { id: 'dev', label: 'Development', icon: <Code className="h-4 w-4" /> },
  { id: 'data', label: 'Data Science', icon: <Database className="h-4 w-4" /> },
  { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
  { id: 'neuro', label: 'Neuroscience', icon: <Brain className="h-4 w-4" /> },
  { id: 'chuv', label: 'CHUV', icon: <Hospital className="h-4 w-4" /> },
  { id: 'webapps', label: 'Web Apps', icon: <Globe className="h-4 w-4" /> }
]

export const filterApps = (
  apps: App[] | null | undefined,
  selectedCategory: string,
  searchQuery: string
) => {
  let result = apps || []

  // Category filtering logic
  if (selectedCategory !== 'all') {
    result = result.filter((app) => {
      const name = app.name?.toLowerCase() || ''
      if (selectedCategory === 'dev')
        return (
          name.includes('code') ||
          name.includes('dev') ||
          name.includes('git') ||
          name.includes('jupyter') ||
          name.includes('sciterminal') ||
          name.includes('rstudio') ||
          name.includes('benchmark')
        )
      if (selectedCategory === 'data')
        return (
          name.includes('arx') ||
          name.includes('jupyter') ||
          name.includes('code') ||
          name.includes('rstudio') ||
          name.includes('meditron') ||
          name.includes('privacy') ||
          name.includes('tune')
        )
      if (selectedCategory === 'security')
        return (
          name.includes('secure') ||
          name.includes('vault') ||
          name.includes('security') ||
          name.includes('privacy')
        )
      if (selectedCategory === 'productivity')
        return (
          name.includes('office') ||
          name.includes('file') ||
          name.includes('zenodo')
        )
      if (selectedCategory === 'neuro')
        return (
          name.includes('bids') ||
          name.includes('brain') ||
          name.includes('btv') ||
          name.includes('ciclone') ||
          name.includes('dcm2') ||
          name.includes('meg') ||
          name.includes('dti') ||
          name.includes('fsl') ||
          name.includes('itk') ||
          name.includes('localizer') ||
          name.includes('slicer') ||
          name.includes('trc')
        )
      if (selectedCategory === 'chuv') return name.includes('horus')
      if (selectedCategory === 'webapps') {
        return false
      }
      return false
    })
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    result = result.filter(
      (app) =>
        app.name?.toLowerCase().includes(query) ||
        app.description?.toLowerCase().includes(query)
    )
  }
  return result
}
