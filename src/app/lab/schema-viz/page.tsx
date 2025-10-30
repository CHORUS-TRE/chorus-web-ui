'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Space } from 'react-zoomable-ui'
import { Canvas, Edge, EdgeData, Node, NodeData, useSelection } from 'reaflow'

import { roleCategories, schemaData, serviceGroups } from './data'

// Responsive container size will be measured with ResizeObserver

// Define types for our schema data
interface Permission {
  name: string
  description: string
  context: string[]
}

interface Role {
  name: string
  description: string
  attributes?: Record<string, string>
  inherits_from?: string[]
  permissions: string[]
}

interface SchemaData {
  permissions: Permission[]
  roles: Role[]
}

export default function RoleHierarchyPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [showPermissions, setShowPermissions] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const viewPortRef = useRef<HTMLDivElement | null>(null)
  const [size, setSize] = useState({ width: 1200, height: 800 })

  // Observe container size to keep the canvas responsive
  useEffect(() => {
    if (!containerRef.current) return
    const element = containerRef.current
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect
        const width = Math.max(600, Math.floor(cr.width))
        const height = Math.max(400, Math.floor(cr.height))
        setSize({ width, height })
      }
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Generate nodes and edges from schema data
  const { nodes, edges } = useMemo(() => {
    const nodes: NodeData[] = []
    const edges: EdgeData[] = []

    // Filter roles based on search term
    const filteredRoles = schemaData.roles.filter(
      (role) =>
        !searchTerm ||
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Create role nodes
    filteredRoles.forEach((role) => {
      const category =
        Object.entries(roleCategories).find(([, roles]) =>
          roles.includes(role.name)
        )?.[0] || 'Platform'

      nodes.push({
        id: `role-${role.name}`,
        text: role.name,
        data: {
          type: 'role',
          category,
          description: role.description,
          permissions: role.permissions,
          attributes: role.attributes || {}
        }
      })

      // Create inheritance edges
      if (role.inherits_from) {
        role.inherits_from.forEach((parentRole) => {
          edges.push({
            id: `inherit-${parentRole}-${role.name}`,
            from: `role-${parentRole}`,
            to: `role-${role.name}`,
            data: { type: 'inheritance' }
          })
        })
      }
    })

    // Create permission nodes if enabled
    if (showPermissions) {
      schemaData.permissions.forEach((permission) => {
        const service =
          Object.entries(serviceGroups).find(([, perms]) =>
            perms.includes(permission.name)
          )?.[0] || 'Other'

        nodes.push({
          id: `perm-${permission.name}`,
          text: permission.name,
          data: {
            type: 'permission',
            service,
            description: permission.description,
            context: permission.context
          }
        })
      })

      // Create permission-to-role edges
      schemaData.roles.forEach((role) => {
        role.permissions.forEach((permissionName) => {
          edges.push({
            id: `perm-${permissionName}-${role.name}`,
            from: `role-${role.name}`,
            to: `perm-${permissionName}`,
            data: { type: 'permission' }
          })
        })
      })
    }

    return { nodes, edges }
  }, [showPermissions, searchTerm])

  // Selection management
  const { selections, onCanvasClick, onClick, onKeyDown, clearSelections } =
    useSelection({
      nodes,
      edges,
      onSelection: (selectedIds) => {
        const roleId = selectedIds.find((id) => id.startsWith('role-'))
        if (roleId) {
          setSelectedRole(roleId.replace('role-', ''))
        } else {
          setSelectedRole(null)
        }
      }
    })

  return (
    <div className="">
      <div className="py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Role Hierarchy & Permissions</h1>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showPermissions}
                onChange={(e) => setShowPermissions(e.target.checked)}
                className="mr-2"
              />
              Show Permissions
            </label>
            <button
              type="button"
              className="rounded border px-3 py-1 text-sm"
              onClick={() => {
                if (!viewPortRef.current) return
                viewPortRef.current.setBounds({
                  x: [0, size.width],
                  y: [0, size.height]
                })
                viewPortRef.current.camera.centerFitAreaIntoView({
                  left: 0,
                  top: 0,
                  width: size.width,
                  height: size.height
                })
              }}
            >
              Fit to screen
            </button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: 'calc(100vh - 180px)',
          position: 'relative'
        }}
      >
        <Space
          onCreate={(viewPort) => {
            viewPortRef.current = viewPort
            viewPort.setBounds({ x: [0, size.width], y: [0, size.height] })
            viewPort.camera.centerFitAreaIntoView({
              left: 0,
              top: 0,
              width: size.width,
              height: size.height
            })
          }}
        >
          <Canvas
            nodes={nodes}
            edges={edges}
            selections={selections}
            onCanvasClick={onCanvasClick}
            className="border border-secondary"
            pannable={true}
            panType={'drag'}
            zoomable={true}
            minZoom={0.05}
            maxZoom={2}
            direction="UP"
            layoutOptions={{
              spacing: '25',
              levelSeparation: '25',
              nodeSpacing: '25',
              treeSpacing: '25'
            }}
            width={size.width}
            height={size.height}
            maxWidth={4000}
            maxHeight={4000}
          />
        </Space>
      </div>
    </div>
  )
}
