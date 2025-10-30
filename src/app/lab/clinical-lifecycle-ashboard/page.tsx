'use client'

import {
  AlertCircle,
  BarChart3,
  Bell,
  CheckCircle,
  Clock,
  Database,
  Download,
  FileDown,
  FileText,
  Filter,
  MessageSquare,
  Play,
  Plus,
  Search,
  Settings,
  Shield,
  Users
} from 'lucide-react'
import React, { useState } from 'react'

import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

export default function CHORUSResearchDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const project = {
    title: 'Overall Survival Prediction in Brain Tumor Patients',
    id: 'PRJ-2024-001',
    pi: 'Dr. Marie Fischer',
    status: 'Active',
    phase: 'Data Analysis',
    progress: 65,
    startDate: '2024-01-15',
    members: 5,
    datasets: 3,
    notifications: 4
  }

  const lifecycleSteps = [
    { name: 'Project Setup', status: 'completed', date: '2024-01-15' },
    { name: 'Dataset Access', status: 'completed', date: '2024-02-01' },
    { name: 'Data De-identification', status: 'completed', date: '2024-02-15' },
    { name: 'Workspace Creation', status: 'completed', date: '2024-03-01' },
    { name: 'Data Analysis', status: 'active', date: 'In Progress' },
    { name: 'Results Review', status: 'pending', date: 'Pending' },
    { name: 'Publication', status: 'pending', date: 'Pending' }
  ]

  const datasets = [
    {
      id: 'DS-001',
      name: 'Brain Tumor Radiotherapy Cohort',
      patients: 342,
      status: 'Accessed',
      lastUsed: '2 hours ago',
      deidentified: true
    },
    {
      id: 'DS-002',
      name: 'Pharmacological Treatment Registry',
      patients: 287,
      status: 'Accessed',
      lastUsed: '1 day ago',
      deidentified: true
    },
    {
      id: 'DS-003',
      name: 'Imaging Data Collection',
      patients: 412,
      status: 'Pending Approval',
      lastUsed: 'N/A',
      deidentified: false
    }
  ]

  const teamMembers = [
    {
      name: 'Dr. Marie Fischer',
      role: 'Principal Investigator',
      access: 'Full'
    },
    {
      name: 'Prof. Jean-Luc Bernard',
      role: 'AI Researcher (EPFL)',
      access: 'Full',
      external: true
    },
    { name: 'Sarah Chen', role: 'Data Analyst', access: 'Analysis' },
    {
      name: 'Dr. Thomas Meyer',
      role: 'Clinical Researcher',
      access: 'Read/Write'
    },
    { name: 'Lisa Schmidt', role: 'Research Assistant', access: 'Read' }
  ]

  const recentActivity = [
    {
      action: 'Dataset DS-002 accessed',
      user: 'Sarah Chen',
      time: '2 hours ago'
    },
    {
      action: 'Analysis script uploaded',
      user: 'Prof. Bernard',
      time: '5 hours ago'
    },
    { action: 'New results generated', user: 'System', time: '1 day ago' },
    { action: 'Team member added', user: 'Dr. Fischer', time: '2 days ago' }
  ]

  const notifications = [
    {
      type: 'success',
      message: 'Dataset DS-003 approval pending - review required',
      time: '1 hour ago'
    },
    {
      type: 'info',
      message: 'Weekly backup completed successfully',
      time: '3 hours ago'
    },
    {
      type: 'warning',
      message: 'Project milestone review due in 5 days',
      time: '1 day ago'
    },
    {
      type: 'info',
      message: 'New collaboration request from Dr. Anderson',
      time: '2 days ago'
    }
  ]

  type LifecycleStatus = 'completed' | 'active' | 'pending'
  const getStatusIcon = (status: LifecycleStatus): JSX.Element => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'active':
        return <Play className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {project.title}
              </h1>
              <Badge className="border-green-200 bg-green-100 text-green-800">
                {project.status}
              </Badge>
            </div>
            <p className="text-gray-600">
              Project ID: {project.id} | PI: {project.pi}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Bell className="h-4 w-4" />
              {project.notifications}
            </Button>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Project Progress</p>
                  <p className="text-2xl font-bold">{project.progress}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <Progress value={project.progress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Team Members</p>
                  <p className="text-2xl font-bold">{project.members}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Datasets</p>
                  <p className="text-2xl font-bold">{project.datasets}</p>
                </div>
                <Database className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Phase</p>
                  <p className="text-lg font-bold">{project.phase}</p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lifecycle">Project Lifecycle</TabsTrigger>
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Lifecycle Status</CardTitle>
                  <CardDescription>
                    Track your project progress through key milestones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lifecycleSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(step.status)}
                          <div>
                            <p className="font-medium text-gray-900">
                              {step.name}
                            </p>
                            <p className="text-sm text-gray-500">{step.date}</p>
                          </div>
                        </div>
                        {step.status === 'active' && (
                          <Badge className="bg-blue-100 text-blue-800">
                            In Progress
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest actions in your project workspace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 border-b pb-3 last:border-0"
                      >
                        <div className="mt-2 h-2 w-2 rounded-full bg-blue-600"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.user} • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {notifications.map((notif, index) => (
                      <div key={index} className="rounded-lg bg-gray-50 p-3">
                        <div className="flex items-start gap-2">
                          {notif.type === 'warning' && (
                            <AlertCircle className="mt-0.5 h-4 w-4 text-orange-600" />
                          )}
                          {notif.type === 'success' && (
                            <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                          )}
                          {notif.type === 'info' && (
                            <Bell className="mt-0.5 h-4 w-4 text-blue-600" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              {notif.message}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-3 w-full">
                    View All
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full gap-2" variant="outline">
                    <Plus className="h-4 w-4" />
                    Request Dataset Access
                  </Button>
                  <Button className="w-full gap-2" variant="outline">
                    <Users className="h-4 w-4" />
                    Add Team Member
                  </Button>
                  <Button className="w-full gap-2" variant="outline">
                    <FileDown className="h-4 w-4" />
                    Export Results
                  </Button>
                  <Button className="w-full gap-2" variant="outline">
                    <MessageSquare className="h-4 w-4" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Datasets Tab */}
        <TabsContent value="datasets" className="space-y-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Search className="h-4 w-4" />
                Search Datasets
              </Button>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Request New Dataset
            </Button>
          </div>

          <div className="grid gap-4">
            {datasets.map((dataset) => (
              <Card key={dataset.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <Database className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">
                          {dataset.name}
                        </h3>
                        <Badge
                          variant={
                            dataset.status === 'Accessed'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {dataset.status}
                        </Badge>
                        {dataset.deidentified && (
                          <Badge className="gap-1 bg-green-100 text-green-800">
                            <Shield className="h-3 w-3" />
                            De-identified
                          </Badge>
                        )}
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Dataset ID</p>
                          <p className="font-medium">{dataset.id}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Patients</p>
                          <p className="font-medium">{dataset.patients}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Last Used</p>
                          <p className="font-medium">{dataset.lastUsed}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Team Members ({teamMembers.length})
            </h2>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </div>

          <div className="grid gap-4">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-blue-600 text-white">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{member.name}</p>
                          {member.external && (
                            <Badge variant="outline" className="text-xs">
                              External
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Access Level</p>
                        <p className="font-medium">{member.access}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Tools & Environment</CardTitle>
              <CardDescription>
                Access computational resources and analytical tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <Card className="cursor-pointer border-2 transition-colors hover:border-blue-500">
                  <CardContent className="pt-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="mb-1 font-semibold">Python Environment</h3>
                    <p className="text-sm text-gray-600">
                      Jupyter, NumPy, Pandas, Scikit-learn
                    </p>
                    <Button className="mt-4 w-full">Launch</Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer border-2 transition-colors hover:border-blue-500">
                  <CardContent className="pt-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                      <Database className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="mb-1 font-semibold">3D Slicer</h3>
                    <p className="text-sm text-gray-600">
                      Medical image analysis
                    </p>
                    <Button className="mt-4 w-full">Launch</Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer border-2 transition-colors hover:border-blue-500">
                  <CardContent className="pt-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                      <BarChart3 className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="mb-1 font-semibold">FreeSurfer</h3>
                    <p className="text-sm text-gray-600">
                      Neuroimaging analysis suite
                    </p>
                    <Button className="mt-4 w-full">Launch</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analysis Scripts & Notebooks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">
                        ML_survival_prediction.ipynb
                      </p>
                      <p className="text-sm text-gray-600">
                        Modified 3 hours ago by Prof. Bernard
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Open
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">data_preprocessing.py</p>
                      <p className="text-sm text-gray-600">
                        Modified 1 day ago by Sarah Chen
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Open
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Results & Publications</CardTitle>
              <CardDescription>
                View, discuss, and export research findings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Overall Survival Model Performance
                      </h3>
                      <p className="text-sm text-gray-600">
                        Generated on Oct 25, 2024
                      </p>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                  <div className="flex h-64 items-center justify-center rounded bg-gray-100 text-gray-500">
                    [Visualization: ML Model Results]
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      Discuss (3)
                    </Button>
                    <Button variant="outline" size="sm">
                      Add to Report
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Treatment Efficacy Comparison
                      </h3>
                      <p className="text-sm text-gray-600">
                        Generated on Oct 20, 2024
                      </p>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                  <div className="flex h-64 items-center justify-center rounded bg-gray-100 text-gray-500">
                    [Visualization: Treatment Comparison Charts]
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      Discuss (7)
                    </Button>
                    <Button variant="outline" size="sm">
                      Add to Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lifecycle Tab */}
        <TabsContent value="lifecycle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Lifecycle Guide</CardTitle>
              <CardDescription>
                Detailed view of project phases, tasks, and contacts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {lifecycleSteps.map((step, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-gray-300 pb-6 pl-4 last:pb-0"
                    style={{
                      borderColor:
                        step.status === 'completed'
                          ? '#16a34a'
                          : step.status === 'active'
                            ? '#2563eb'
                            : '#d1d5db'
                    }}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(step.status)}
                        <h3 className="text-lg font-semibold">{step.name}</h3>
                      </div>
                      <span className="text-sm text-gray-600">{step.date}</span>
                    </div>
                    <p className="mb-3 text-sm text-gray-600">
                      {step.name === 'Data Analysis'
                        ? 'Perform statistical and machine learning analysis on approved datasets using provided tools.'
                        : 'Phase description and requirements will be displayed here.'}
                    </p>
                    {step.status === 'active' && (
                      <div className="mt-2 rounded-lg bg-blue-50 p-3">
                        <p className="mb-1 text-sm font-medium text-blue-900">
                          Next Steps:
                        </p>
                        <ul className="list-inside list-disc text-sm text-blue-800">
                          <li>Complete statistical analysis</li>
                          <li>Validate ML model performance</li>
                          <li>Document methodology</li>
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
