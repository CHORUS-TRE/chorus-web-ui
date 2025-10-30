'use client'

import {
  Activity,
  Bell,
  Briefcase,
  ChevronRight,
  Database,
  Download,
  Edit,
  FileText,
  FolderOpen,
  Home,
  Key,
  Layers,
  LogIn,
  LogOut,
  Menu,
  Play,
  Plus,
  Save,
  Search,
  Settings,
  Shield,
  Trash2,
  Upload,
  User,
  Users,
  X
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { useToast } from '~/components/hooks/use-toast'
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

// Mock API base URL - replace with actual API
const API_BASE = 'https://api.chorus-tre.ch/api/rest/v1'

export default function ChorusApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [currentView, setCurrentView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [workspaces, setWorkspaces] = useState([])
  const [workbenches, setWorkbenches] = useState([])
  const [apps, setApps] = useState([])
  const [appInstances, setAppInstances] = useState([])
  const { toast } = useToast()

  // Mock data for demo purposes
  useEffect(() => {
    if (isAuthenticated) {
      setWorkspaces([
        {
          id: 1,
          name: 'Research Project Alpha',
          description: 'Main research workspace',
          createdAt: '2024-01-15',
          files: 42
        },
        {
          id: 2,
          name: 'Data Analysis Q1',
          description: 'Q1 2024 analysis',
          createdAt: '2024-02-01',
          files: 28
        },
        {
          id: 3,
          name: 'Clinical Trial Study',
          description: 'Phase 2 trial data',
          createdAt: '2024-03-10',
          files: 156
        }
      ])

      setWorkbenches([
        {
          id: 1,
          name: 'Python Analysis Environment',
          type: 'Jupyter',
          status: 'running',
          workspaceId: 1
        },
        {
          id: 2,
          name: 'R Studio Environment',
          type: 'RStudio',
          status: 'stopped',
          workspaceId: 1
        },
        {
          id: 3,
          name: 'Data Processing',
          type: 'Custom',
          status: 'running',
          workspaceId: 2
        }
      ])

      setApps([
        {
          id: 1,
          name: 'Statistical Analysis Tool',
          category: 'Analytics',
          version: '2.1.0',
          instances: 3
        },
        {
          id: 2,
          name: 'Data Visualization Suite',
          category: 'Visualization',
          version: '1.5.2',
          instances: 2
        },
        {
          id: 3,
          name: 'Machine Learning Pipeline',
          category: 'ML',
          version: '3.0.1',
          instances: 1
        }
      ])

      setAppInstances([
        {
          id: 1,
          appId: 1,
          name: 'Stats Analysis - Workspace 1',
          status: 'active',
          workspaceId: 1
        },
        {
          id: 2,
          appId: 2,
          name: 'Viz Suite - Project Alpha',
          status: 'active',
          workspaceId: 1
        },
        {
          id: 3,
          appId: 1,
          name: 'Stats Analysis - Q1 Data',
          status: 'inactive',
          workspaceId: 2
        }
      ])

      setNotifications([
        {
          id: 1,
          message: 'Workbench "Python Analysis" started successfully',
          time: '5 min ago',
          read: false
        },
        {
          id: 2,
          message: 'New files uploaded to Research Project Alpha',
          time: '1 hour ago',
          read: false
        },
        {
          id: 3,
          message: 'App instance deployment completed',
          time: '2 hours ago',
          read: true
        }
      ])
    }
  }, [isAuthenticated])

  // Authentication
  const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e) => {
      e.preventDefault()
      // Mock login - in real app, call API
      setTimeout(() => {
        setIsAuthenticated(true)
        setUser({
          name: 'Dr. Jane Smith',
          email: 'jane.smith@research.org',
          role: 'Researcher',
          id: 1
        })
        setToken('mock-jwt-token')
        toast({
          title: 'Login Successful',
          description: 'Welcome back to CHORUS!'
        })
      }, 500)
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-indigo-600 p-4">
                <Database className="h-12 w-12 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">CHORUS</CardTitle>
            <CardDescription>
              Trusted Research Environment Platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@organization.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
              <div className="text-center text-sm text-slate-500">
                <a href="#" className="hover:text-indigo-600">
                  Forgot password?
                </a>
                {' · '}
                <a href="#" className="hover:text-indigo-600">
                  Register
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Sidebar Navigation
  const Sidebar = () => {
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'workspaces', label: 'Workspaces', icon: FolderOpen },
      { id: 'workbenches', label: 'Workbenches', icon: Briefcase },
      { id: 'apps', label: 'Apps', icon: Layers },
      { id: 'instances', label: 'App Instances', icon: Database }
    ]

    return (
      <div
        className={`${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col bg-slate-900 text-white transition-all duration-300`}
      >
        <div className="flex items-center justify-between border-b border-slate-700 p-4">
          {sidebarOpen && <h1 className="text-xl font-bold">CHORUS</h1>}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:bg-slate-800"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg p-3 transition-colors ${
                  currentView === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {sidebarOpen && (
          <div className="border-t border-slate-700 p-4">
            <div className="mb-3 flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-indigo-600">JS</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">{user?.name}</p>
                <p className="truncate text-xs text-slate-400">{user?.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-slate-300 hover:bg-slate-800"
              onClick={() => {
                setIsAuthenticated(false)
                setUser(null)
                setToken(null)
                toast({ title: 'Logged out successfully' })
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Top Navigation Bar
  const TopBar = () => {
    const unreadCount = notifications.filter((n) => !n.read).length

    return (
      <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4">
        <div className="max-w-xl flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search workspaces, apps, files..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadCount}
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
                  <p className="text-sm">{notif.message}</p>
                  <p className="mt-1 text-xs text-slate-500">{notif.time}</p>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    )
  }

  // Dashboard View
  const DashboardView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="mt-1 text-slate-500">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Workspaces</p>
                <p className="mt-1 text-3xl font-bold">{workspaces.length}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-indigo-600" />
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
              <Briefcase className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Apps</p>
                <p className="mt-1 text-3xl font-bold">{apps.length}</p>
              </div>
              <Layers className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">App Instances</p>
                <p className="mt-1 text-3xl font-bold">{appInstances.length}</p>
              </div>
              <Database className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Workspaces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workspaces.slice(0, 3).map((ws) => (
                <div
                  key={ws.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg border p-3 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <FolderOpen className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="font-medium">{ws.name}</p>
                      <p className="text-sm text-slate-500">{ws.files} files</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Workbenches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workbenches
                .filter((wb) => wb.status === 'running')
                .map((wb) => (
                  <div
                    key={wb.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{wb.name}</p>
                        <p className="text-sm text-slate-500">{wb.type}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Running
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Workspaces View
  const WorkspacesView = () => {
    const [createDialogOpen, setCreateDialogOpen] = useState(false)

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Workspaces</h2>
            <p className="mt-1 text-slate-500">
              Manage your research workspaces
            </p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Workspace
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workspace</DialogTitle>
                <DialogDescription>
                  Set up a new research workspace
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="ws-name">Workspace Name</Label>
                  <Input id="ws-name" placeholder="My Research Project" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ws-desc">Description</Label>
                  <Textarea
                    id="ws-desc"
                    placeholder="Describe your workspace..."
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    setCreateDialogOpen(false)
                    toast({ title: 'Workspace created successfully' })
                  }}
                >
                  Create Workspace
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {workspaces.map((ws) => (
            <Card
              key={ws.id}
              className="cursor-pointer transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FolderOpen className="h-8 w-8 text-indigo-600" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Files
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="mt-2">{ws.name}</CardTitle>
                <CardDescription>{ws.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{ws.files} files</span>
                  <span className="text-slate-400">{ws.createdAt}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Workbenches View
  const WorkbenchesView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Workbenches</h2>
          <p className="mt-1 text-slate-500">
            Manage your computational environments
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Workbench
        </Button>
      </div>

      <div className="space-y-3">
        {workbenches.map((wb) => (
          <Card key={wb.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-indigo-100 p-3">
                    <Briefcase className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{wb.name}</h3>
                    <p className="text-sm text-slate-500">
                      {wb.type} • Workspace ID: {wb.workspaceId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={
                      wb.status === 'running'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-slate-100 text-slate-800'
                    }
                  >
                    {wb.status}
                  </Badge>
                  {wb.status === 'running' ? (
                    <Button variant="outline" size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Open
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // Apps View
  const AppsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Apps</h2>
          <p className="mt-1 text-slate-500">
            Available applications and tools
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          Add App
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {apps.map((app) => (
          <Card key={app.id} className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Layers className="h-8 w-8 text-purple-600" />
                <Badge>{app.category}</Badge>
              </div>
              <CardTitle className="mt-2">{app.name}</CardTitle>
              <CardDescription>Version {app.version}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {app.instances} instances
                </span>
                <Button size="sm">
                  <Play className="mr-2 h-4 w-4" />
                  Deploy
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // App Instances View
  const InstancesView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">App Instances</h2>
          <p className="mt-1 text-slate-500">Running application instances</p>
        </div>
      </div>

      <div className="space-y-3">
        {appInstances.map((instance) => {
          const app = apps.find((a) => a.id === instance.appId)
          return (
            <Card key={instance.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-purple-100 p-3">
                      <Database className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{instance.name}</h3>
                      <p className="text-sm text-slate-500">
                        {app?.name} • Workspace ID: {instance.workspaceId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        instance.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-slate-100 text-slate-800'
                      }
                    >
                      {instance.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      Open
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'workspaces' && <WorkspacesView />}
          {currentView === 'workbenches' && <WorkbenchesView />}
          {currentView === 'apps' && <AppsView />}
          {currentView === 'instances' && <InstancesView />}
        </main>
      </div>
    </div>
  )
}
