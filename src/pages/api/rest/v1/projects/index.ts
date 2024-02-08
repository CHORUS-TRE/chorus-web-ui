import { Project } from '~/internal/client/models/Project'

const projects: Project[] = [
  {
    name: 'Integrated analysis of tumor vessels and immune cells in glioblastoma',
    shortName: 'Tumor Vessels and Immune Cells',
    owner: 'Pr. Jean-François Tliuageqwf',
    institution: 'Centre Hospitalier Universitaire de Lausanne (CHUV)',
    country: 'Lausanne, Switzerland',
    logo: '/chuv.png',
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
  }, {
    name: 'Hypnosis-aided awake craniotomy versus monitored anesthesia care for brain tumors (HAMAC Study)',
    shortName: 'HAMAC Study',
    owner: 'Pr. Jean-François Dufour',
    institution: 'Centre Hospitalier Universitaire de Lausanne (CHUV)',
    country: 'Lausanne, Switzerland',
    logo: '/chuv.png',
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
  }, {
    name: 'Hypnosis-aided awake craniotomy versus monitored anesthesia care for brain tumors (HAMAC Study)',
    shortName: 'HAMAC Study',
    owner: 'Pr. Jean-François Dufour',
    institution: 'Centre Hospitalier Universitaire de Lausanne (CHUV)',
    country: 'Lausanne, Switzerland',
    logo: '/chuv.png',
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
]

import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = Project[]
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json(projects)
}