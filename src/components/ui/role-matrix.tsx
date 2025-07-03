'use client'

import { Permission, Role } from '@/domain/model'

import { Checkbox } from './checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './table'

interface RoleMatrixProps {
  roles: Role[]
  permissions: Permission[]
}

export const RoleMatrix = ({ roles, permissions }: RoleMatrixProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Permission</TableHead>
          {roles.map((role) => (
            <TableHead key={role.name} className="text-center">
              {role.name}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {permissions.map((permission) => (
          <TableRow key={permission.name}>
            <TableCell>{permission.name}</TableCell>
            {roles.map((role) => (
              <TableCell
                key={`${role.name}-${permission.name}`}
                className="text-center"
              >
                <Checkbox
                  checked={role.permissions.some(
                    (p) => p.name === permission.name
                  )}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
