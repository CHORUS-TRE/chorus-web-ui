'use client'

import { Shield } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { RoleMatrix } from '@/components/ui/role-matrix'
import { MockRoleDataSource } from '@/data/data-source/chorus-api/role-data-source'
import { RoleRepositoryImpl } from '@/data/repository/role-repository-impl'
import { Permission, Role } from '@/domain/model'
import { RoleListUseCase } from '@/domain/use-cases/role/role-list'
import { Button } from '~/components/ui/button'

const RolesPage = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])

  useEffect(() => {
    const fetchRoles = async () => {
      const dataSource = new MockRoleDataSource()
      const repo = new RoleRepositoryImpl(dataSource)
      const useCase = new RoleListUseCase(repo)
      const result = await useCase.execute()

      if (result.data) {
        setRoles(result.data)
        // Extract all unique permissions from the roles
        const allPermissions = result.data.flatMap((role) => role.permissions)
        const uniquePermissions = Array.from(
          new Map(allPermissions.map((p) => [p.name, p])).values()
        )
        setPermissions(uniquePermissions)
      }
    }

    fetchRoles()
  }, [])

  return (
    <>
      <div className="w-full text-white">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start text-white">
              <Shield className="h-9 w-9 text-white" />
              Role Management
            </h2>
            <div className="">
              <p className="text-sm text-muted-foreground">
                Manage roles and their assigned permissions.
              </p>
            </div>
          </div>
          <Button
            type="submit"
            className="bg-transparent text-accent ring-1 ring-accent hover:bg-accent-background hover:text-black focus:bg-accent-background"
          >
            Add Role
          </Button>
        </div>
      </div>

      <div className="w-full text-white">
        <RoleMatrix roles={roles} permissions={permissions} />
      </div>
    </>
  )
}

export default RolesPage
