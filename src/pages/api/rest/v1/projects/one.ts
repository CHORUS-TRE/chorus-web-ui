import { Project } from '~/internal/client/models/Project'

const myProject: Project = {
  name: 'Biomedical Data Science Center',
  shortName: 'BDSC',
  owner: 'Manuel Spuhler',
  institution: 'Centre Hospitalier Universitaire de Lausanne (CHUV)',
  country: 'Lausanne, Switzerland',
  logo: '/chuv.png',
  type: 'personal',
  apps: [
    {
      name: 'Jupyter',
      icon: '/jupyter.png',
      status: 'running',
      mod: 777
    },
    {
      name: 'RStudio',
      icon: '/rstudio.png',
      status: 'running',
      mod: 760
    }
  ]
}

import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = Project
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json(myProject)
}