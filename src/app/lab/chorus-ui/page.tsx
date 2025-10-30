'use client'

import {
  Bell,
  Briefcase,
  ChevronRight,
  Database,
  Edit,
  FileText,
  Folder,
  FolderOpen,
  Home,
  Layers,
  LogOut,
  MoreVertical,
  Pause,
  Play,
  Plus,
  Search,
  Settings,
  Trash2,
  Users
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { Alert, AlertDescription } from '~/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Textarea } from '~/components/ui/textarea'

export default function ChorusClientApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<{
    name: string
    email: string
    avatar: string
    role: string
  } | null>(null)
  const [currentView, setCurrentView] = useState('dashboard')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Mock data states
  const [workspaces, setWorkspaces] = useState([
    {
      id: '1',
      name: 'Research Project Alpha',
      description: 'Main research workspace',
      owner: 'John Doe',
      created: '2024-01-15',
      files: 45
    },
    {
      id: '2',
      name: 'Data Analysis Q1',
      description: 'Quarterly analysis workspace',
      owner: 'Jane Smith',
      created: '2024-02-01',
      files: 23
    },
    {
      id: '3',
      name: 'Clinical Trial Study',
      description: 'Patient data workspace',
      owner: 'Dr. Brown',
      created: '2024-01-20',
      files: 67
    }
  ])

  const [workbenches, setWorkbenches] = useState([
    {
      id: '1',
      name: 'Python Analysis',
      type: 'Jupyter',
      status: 'running',
      workspace: 'Research Project Alpha',
      cpu: '2 cores',
      memory: '4GB'
    },
    {
      id: '2',
      name: 'R Studio Environment',
      type: 'RStudio',
      status: 'stopped',
      workspace: 'Data Analysis Q1',
      cpu: '4 cores',
      memory: '8GB'
    },
    {
      id: '3',
      name: 'VS Code Dev',
      type: 'VSCode',
      status: 'running',
      workspace: 'Research Project Alpha',
      cpu: '2 cores',
      memory: '4GB'
    }
  ])

  const [apps, setApps] = useState([
    {
      id: '1',
      name: 'Data Pipeline',
      type: 'Processing',
      version: '2.1.0',
      status: 'active',
      instances: 3
    },
    {
      id: '2',
      name: 'ML Model Training',
      type: 'Machine Learning',
      version: '1.5.2',
      status: 'active',
      instances: 1
    },
    {
      id: '3',
      name: 'Visualization Dashboard',
      type: 'Dashboard',
      version: '3.0.1',
      status: 'inactive',
      instances: 0
    }
  ])

  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'info',
      message: 'Workspace "Research Project Alpha" has new files',
      time: '5 min ago',
      read: false
    },
    {
      id: '2',
      type: 'success',
      message: 'Workbench "Python Analysis" started successfully',
      time: '1 hour ago',
      read: false
    },
    {
      id: '3',
      type: 'warning',
      message: 'App instance memory usage high (85%)',
      time: '2 hours ago',
      read: true
    }
  ])

  const [newWorkspaceDialog, setNewWorkspaceDialog] = useState(false)
  const [newWorkbenchDialog, setNewWorkbenchDialog] = useState(false)

  // Login handler
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoginError('')

    // Mock authentication
    if (loginEmail && loginPassword) {
      setIsAuthenticated(true)
      setCurrentUser({
        name: 'John Doe',
        email: loginEmail,
        avatar: '',
        role: 'Researcher'
      })
    } else {
      setLoginError('Please enter valid credentials')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setCurrentView('dashboard')
  }

  const unreadNotifications = notifications.filter((n) => !n.read).length

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="space-y-3 pb-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600">
              <Database className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl">CHORUS</CardTitle>
            <CardDescription>
              Trusted Research Environment Platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {loginError}
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Sign In
              </Button>
              <div className="text-center text-sm text-slate-500">
                Demo: Use any email and password to login
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main App UI
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="flex w-64 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">CHORUS</h1>
              <p className="text-xs text-slate-500">TRE Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
              currentView === 'dashboard'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView('workspaces')}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
              currentView === 'workspaces'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FolderOpen className="h-5 w-5" />
            <span className="font-medium">Workspaces</span>
            <Badge className="ml-auto">{workspaces.length}</Badge>
          </button>

          <button
            onClick={() => setCurrentView('workbenches')}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
              currentView === 'workbenches'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Briefcase className="h-5 w-5" />
            <span className="font-medium">Workbenches</span>
            <Badge className="ml-auto">
              {workbenches.filter((w) => w.status === 'running').length}
            </Badge>
          </button>

          <button
            onClick={() => setCurrentView('apps')}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
              currentView === 'apps'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="h-5 w-5" />
            <span className="font-medium">Applications</span>
          </button>
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3 px-4 py-3">
            <Avatar>
              <AvatarFallback className="bg-indigo-600 text-white">
                {currentUser?.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {currentUser?.name}
              </p>
              <p className="truncate text-xs text-slate-500">
                {currentUser?.role}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
          <div>
            <h2 className="text-2xl font-bold capitalize text-slate-900">
              {currentView}
            </h2>
            <p className="text-sm text-slate-500">
              Manage your research environment
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input placeholder="Search..." className="w-64 pl-9" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notif) => (
                  <DropdownMenuItem
                    key={notif.id}
                    className="flex flex-col items-start py-3"
                  >
                    <div className="flex w-full items-center gap-2">
                      {!notif.read && (
                        <div className="h-2 w-2 rounded-full bg-indigo-600" />
                      )}
                      <span className="flex-1 text-sm">{notif.message}</span>
                    </div>
                    <span className="ml-4 text-xs text-slate-500">
                      {notif.time}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-8">
          {currentView === 'dashboard' && (
            <DashboardView
              workspaces={workspaces}
              workbenches={workbenches}
              apps={apps}
            />
          )}
          {currentView === 'workspaces' && (
            <WorkspacesView
              workspaces={workspaces}
              setWorkspaces={setWorkspaces}
            />
          )}
          {currentView === 'workbenches' && (
            <WorkbenchesView
              workbenches={workbenches}
              setWorkbenches={setWorkbenches}
            />
          )}
          {currentView === 'apps' && <AppsView apps={apps} setApps={setApps} />}
        </main>
      </div>
    </div>
  )
}

function DashboardView({
  workspaces,
  workbenches,
  apps
}: {
  workspaces: {
    id: string
    name: string
    description: string
    owner: string
    created: string
    files: number
  }[]
  workbenches: {
    id: string
    name: string
    type: string
    status: string
    workspace: string
  }[]
  apps: {
    id: string
    name: string
    type: string
    version: string
    status: string
    instances: number
  }[]
}) {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Workspaces</p>
                <p className="mt-1 text-3xl font-bold">{workspaces.length}</p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3">
                <FolderOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Workbenches</p>
                <p className="mt-1 text-3xl font-bold">
                  {workbenches.filter((w) => w.status === 'running').length}
                </p>
              </div>
              <div className="rounded-lg bg-green-100 p-3">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Applications</p>
                <p className="mt-1 text-3xl font-bold">{apps.length}</p>
              </div>
              <div className="rounded-lg bg-purple-100 p-3">
                <Layers className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Files</p>
                <p className="mt-1 text-3xl font-bold">
                  {workspaces.reduce((acc, w) => acc + w.files, 0)}
                </p>
              </div>
              <div className="rounded-lg bg-orange-100 p-3">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Workspaces */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Workspaces</CardTitle>
            <CardDescription>
              Your most recently accessed workspaces
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {workspaces.slice(0, 3).map((workspace) => (
              <div
                key={workspace.id}
                className="flex cursor-pointer items-center justify-between rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded bg-blue-100 p-2">
                    <Folder className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{workspace.name}</p>
                    <p className="text-xs text-slate-500">
                      {workspace.files} files
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Workbenches */}
        <Card>
          <CardHeader>
            <CardTitle>Active Workbenches</CardTitle>
            <CardDescription>Currently running environments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {workbenches
              .filter((w) => w.status === 'running')
              .map((workbench) => (
                <div
                  key={workbench.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded bg-green-100 p-2">
                      <Briefcase className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{workbench.name}</p>
                      <p className="text-xs text-slate-500">{workbench.type}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Running</Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function WorkspacesView({
  workspaces,
  setWorkspaces
}: {
  workspaces: {
    id: string
    name: string
    description: string
    owner: string
    created: string
    files: number
  }[]
  setWorkspaces: (
    workspaces: {
      id: string
      name: string
      description: string
      owner: string
      created: string
      files: number
    }[]
  ) => void
}) {
  const [newWorkspaceOpen, setNewWorkspaceOpen] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState('')
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState('')

  const handleCreateWorkspace = () => {
    if (newWorkspaceName) {
      const newWorkspace = {
        id: String(workspaces.length + 1),
        name: newWorkspaceName,
        description: newWorkspaceDesc,
        owner: 'John Doe',
        created: new Date().toISOString().split('T')[0],
        files: 0
      }
      setWorkspaces([...workspaces, newWorkspace])
      setNewWorkspaceOpen(false)
      setNewWorkspaceName('')
      setNewWorkspaceDesc('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">All Workspaces</h3>
          <p className="text-sm text-slate-500">
            Manage your research workspaces
          </p>
        </div>
        <Dialog open={newWorkspaceOpen} onOpenChange={setNewWorkspaceOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" />
              New Workspace
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Workspace</DialogTitle>
              <DialogDescription>
                Set up a new workspace for your research project
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace Name</Label>
                <Input
                  id="workspace-name"
                  placeholder="My Research Workspace"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workspace-desc">Description</Label>
                <Textarea
                  id="workspace-desc"
                  placeholder="Describe your workspace..."
                  value={newWorkspaceDesc}
                  onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                />
              </div>
              <Button
                onClick={handleCreateWorkspace}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Create Workspace
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {workspaces.map((workspace) => (
          <Card
            key={workspace.id}
            className="transition-shadow hover:shadow-lg"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-blue-100 p-3">
                  <FolderOpen className="h-6 w-6 text-blue-600" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="mt-4">{workspace.name}</CardTitle>
              <CardDescription>{workspace.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Owner:</span>
                  <span className="font-medium">{workspace.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Files:</span>
                  <span className="font-medium">{workspace.files}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Created:</span>
                  <span className="font-medium">{workspace.created}</span>
                </div>
              </div>
              <Button className="mt-4 w-full" variant="outline">
                Open Workspace
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function WorkbenchesView({
  workbenches,
  setWorkbenches
}: {
  workbenches: {
    id: string
    name: string
    type: string
    status: string
    workspace: string
    cpu: string
    memory: string
  }[]
  setWorkbenches: React.Dispatch<
    React.SetStateAction<
      {
        id: string
        name: string
        type: string
        status: string
        workspace: string
        cpu: string
        memory: string
      }[]
    >
  >
}) {
  const [newWorkbenchOpen, setNewWorkbenchOpen] = useState(false)

  const toggleWorkbench = (id: string) => {
    setWorkbenches(
      workbenches.map((w) =>
        w.id === id
          ? { ...w, status: w.status === 'running' ? 'stopped' : 'running' }
          : w
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">All Workbenches</h3>
          <p className="text-sm text-slate-500">
            Manage your development environments
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          New Workbench
        </Button>
      </div>

      <div className="space-y-3">
        {workbenches.map((workbench) => (
          <Card key={workbench.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center gap-4">
                  <div className="rounded-lg bg-green-100 p-3">
                    <Briefcase className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{workbench.name}</h4>
                    <p className="text-sm text-slate-500">
                      {workbench.type} • {workbench.workspace}
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">CPU:</span>{' '}
                      <span className="font-medium">
                        {workbench.cpu || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Memory:</span>{' '}
                      <span className="font-medium">
                        {workbench.memory || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <Badge
                    className={
                      workbench.status === 'running'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-slate-100 text-slate-800'
                    }
                  >
                    {workbench.status}
                  </Badge>
                </div>
                <div className="ml-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleWorkbench(workbench.id)}
                  >
                    {workbench.status === 'running' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Configure
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AppsView({
  apps,
  setApps
}: {
  apps: {
    id: string
    name: string
    type: string
    version: string
    status: string
    instances: number
  }[]
  setApps: (
    apps: {
      id: string
      name: string
      type: string
      version: string
      status: string
      instances: number
    }[]
  ) => void
}) {
  const [newAppOpen, setNewAppOpen] = useState(false)
  const [newAppName, setNewAppName] = useState('')
  const [newAppType, setNewAppType] = useState('')
  const [newAppVersion, setNewAppVersion] = useState('')

  const handleCreateApp = () => {
    if (newAppName && newAppType && newAppVersion) {
      const newApp = {
        id: String(apps.length + 1),
        name: newAppName,
        type: newAppType,
        version: newAppVersion,
        status: 'inactive',
        instances: 0
      }
      setApps([...apps, newApp])
      setNewAppOpen(false)
      setNewAppName('')
      setNewAppType('')
      setNewAppVersion('')
    }
  }

  const toggleAppStatus = (id: string) => {
    setApps(
      apps.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' }
          : a
      )
    )
  }

  const deleteApp = (id: string) => {
    setApps(apps.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">All Applications</h3>
          <p className="text-sm text-slate-500">
            Manage your research applications
          </p>
        </div>
        <Dialog open={newAppOpen} onOpenChange={setNewAppOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" />
              New Application
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Application</DialogTitle>
              <DialogDescription>
                Set up a new application to run in your workspaces
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">Application Name</Label>
                <Input
                  id="app-name"
                  placeholder="e.g. Data Processing Pipeline"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="app-type">Application Type</Label>
                <Input
                  id="app-type"
                  placeholder="e.g. Processing"
                  value={newAppType}
                  onChange={(e) => setNewAppType(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="app-version">Version</Label>
                <Input
                  id="app-version"
                  placeholder="e.g. 1.0.0"
                  value={newAppVersion}
                  onChange={(e) => setNewAppVersion(e.target.value)}
                />
              </div>
              <Button
                onClick={handleCreateApp}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Create Application
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {apps.map(
          (app: {
            id: string
            name: string
            type: string
            version: string
            status: string
            instances: number
          }) => (
            <Card key={app.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <Layers className="h-6 w-6 text-purple-600" />
                  </div>
                  <Badge
                    className={
                      app.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-slate-100 text-slate-800'
                    }
                  >
                    {app.status}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{app.name}</CardTitle>
                <CardDescription>{app.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Version:</span>
                    <span className="font-medium">{app.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Instances:</span>
                    <span className="font-medium">{app.instances}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" variant="outline" size="sm">
                    Configure
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleAppStatus(app.id)}>
                        {app.status === 'active' ? (
                          <Pause className="mr-2 h-4 w-4" />
                        ) : (
                          <Play className="mr-2 h-4 w-4" />
                        )}
                        {app.status === 'active' ? 'Stop' : 'Start'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => deleteApp(app.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  )
}
