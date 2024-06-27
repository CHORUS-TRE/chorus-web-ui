export interface Project {
  name: string
  shortName: string
  owner: string
  institution: string
  country: string
  logo?: string
  apps: {
    name: string
    icon?: string
    status?: string
    mod: number
  }[]
  type?: 'personal' | 'project'
}
