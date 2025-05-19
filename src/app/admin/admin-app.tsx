'use client'

import { Package } from 'lucide-react'
import localStorageDataProvider from 'ra-data-local-storage'
import { Admin, EditGuesser, Resource } from 'react-admin'

import { data } from './data'
import { MyLayout } from './ra-layout'
import { WorkspaceList, WorkspaceShow } from './workspaces'

export default function AdminApp() {
  const dataProvider = localStorageDataProvider({
    localStorageKey: 'chorus-admin',
    defaultData: {
      workspaces: data
    }
  })

  return (
    <>
      {' '}
      <div className="flex w-full flex-col items-center justify-start">
        <div className="flex w-full flex-grow items-center justify-start">
          <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start text-white">
            <Package className="h-9 w-9 text-white" />
            <a href="/admin" className="text-white">
              Workspaces Admin
            </a>
          </h2>
        </div>

        <Admin
          dataProvider={dataProvider}
          defaultTheme="dark"
          layout={MyLayout}
          disableTelemetry
          // dashboard={Dashboard}
        >
          <Resource
            name="workspaces"
            list={WorkspaceList}
            edit={EditGuesser}
            show={WorkspaceShow}
          />
        </Admin>
      </div>
    </>
  )
}
