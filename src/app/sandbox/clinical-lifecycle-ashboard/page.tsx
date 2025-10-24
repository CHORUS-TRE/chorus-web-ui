'use client'

import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  Download,
  FileText,
  Settings,
  Shield,
  Upload,
  Users
} from 'lucide-react'
import React, { useState } from 'react'

import { Button } from '@/components/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ClinicalLifecycleDashboard() {
  const [selectedProject, setSelectedProject] = useState('project-001')
  const [activeStage, setActiveStage] = useState('project-authorization')

  // Clinical Research Lifecycle Stages
  const lifecycleStages = [
    {
      id: 'study-registration',
      title: 'Study Registration',
      description: 'Define feasibility and ensure ethical use of patient data',
      status: 'completed',
      progress: 100,
      activities: [
        'Perform feasibility analysis for cohort selection',
        'Check patient consent status',
        'Request data access'
      ],
      systems: ['Data Explorer', 'Web Consent', 'Access Request System'],
      stakeholders: ['Researcher', 'Ethics Committee'],
      duration: '2-3 weeks'
    },
    {
      id: 'project-strategy',
      title: 'Project Strategy',
      description: 'Define overall study approach',
      status: 'completed',
      progress: 100,
      activities: [
        'Develop data-driven project strategy based on feasibility',
        'Review consent status requirements'
      ],
      systems: ['Data Explorer'],
      stakeholders: ['Researcher'],
      duration: '1-2 weeks'
    },
    {
      id: 'project-writing',
      title: 'Project Writing',
      description: 'Create study protocol',
      status: 'completed',
      progress: 100,
      activities: [
        'Write protocol including objectives and methodology',
        'Define data handling procedures',
        'Establish governance measures'
      ],
      systems: ['Platform Guidelines/Templates'],
      stakeholders: ['Researcher'],
      duration: '3-4 weeks'
    },
    {
      id: 'project-authorization',
      title: 'Project Authorization',
      description: 'Obtain ethics approval before accessing real data',
      status: 'in-progress',
      progress: 65,
      activities: [
        'Submit protocol to Ethics Committee',
        'Await approval decision',
        'Address any committee feedback'
      ],
      systems: ['Ethics Portal', 'BASEC'],
      stakeholders: ['Researcher', 'Ethics Committee'],
      duration: '4-8 weeks'
    },
    {
      id: 'data-reception',
      title: 'Data Reception',
      description: 'Securely receive authorized data for analysis',
      status: 'pending',
      progress: 0,
      activities: [
        'Receive de-identified data after approval',
        'Validate data integrity',
        'Set up secure analysis environment'
      ],
      systems: ['Data Restitution System', 'HORUS'],
      stakeholders: ['Researcher', 'Data Engineer'],
      duration: '1-2 weeks'
    },
    {
      id: 'study-ongoing',
      title: 'Study Ongoing',
      description: 'Conduct analysis and generate research outputs',
      status: 'pending',
      progress: 0,
      activities: [
        'Collect additional data if needed',
        'Analyze data and generate outputs',
        'Prepare reports and publications'
      ],
      systems: ['Data Management Tools', 'DiData'],
      stakeholders: ['Researcher', 'Data Analyst'],
      duration: '6-12 months'
    },
    {
      id: 'end-data-collection',
      title: 'End of Data Collection',
      description: 'Conclude data acquisition as per protocol',
      status: 'not-started',
      progress: 0,
      activities: [
        'Stop data collection at protocol-defined point',
        'Finalize dataset',
        'Prepare for analysis closure'
      ],
      systems: ['Data Management Tools'],
      stakeholders: ['Researcher'],
      duration: '1 week'
    },
    {
      id: 'end-study',
      title: 'End of Study',
      description: 'Close study and archive datasets',
      status: 'not-started',
      progress: 0,
      activities: [
        'Declare study closure',
        'Archive dataset in Data Catalog',
        'Complete final reporting'
      ],
      systems: ['Data Catalog'],
      stakeholders: ['Researcher', 'Data Protection Officer'],
      duration: '2-3 weeks'
    }
  ]

  const currentProjects = [
    {
      id: 'project-001',
      title: 'Cardiovascular Risk Assessment Study',
      status: 'Project Authorization',
      progress: 45,
      startDate: '2024-01-15',
      estimatedCompletion: '2025-06-30',
      pi: 'Dr. Sarah Johnson',
      participants: 250
    },
    {
      id: 'project-002',
      title: 'Diabetes Management Outcomes',
      status: 'Study Ongoing',
      progress: 75,
      startDate: '2023-08-01',
      estimatedCompletion: '2024-12-15',
      pi: 'Dr. Michael Chen',
      participants: 180
    },
    {
      id: 'project-003',
      title: 'Oncology Treatment Response',
      status: 'Data Reception',
      progress: 20,
      startDate: '2024-03-01',
      estimatedCompletion: '2025-08-30',
      pi: 'Dr. Emily Rodriguez',
      participants: 320
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen p-16">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Clinical Studies Dashboard</h1>
            <p className="text-muted-foreground">
              Manage and monitor clinical research projects from design to
              completion
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="accent-filled">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button variant="accent-filled">
              <Upload className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card className="card-glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Projects
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          <Card className="card-glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Participants
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">+180 this month</p>
            </CardContent>
          </Card>
          <Card className="card-glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Approvals
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">
                Ethics review pending
              </p>
            </CardContent>
          </Card>
          <Card className="card-glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">+5% vs target</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="lifecycle" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="lifecycle">Lifecycle Overview</TabsTrigger>
            <TabsTrigger value="projects">Active Projects</TabsTrigger>
            <TabsTrigger value="workflow">Workflow Status</TabsTrigger>
            <TabsTrigger value="systems">System Integration</TabsTrigger>
          </TabsList>

          {/* Lifecycle Overview */}
          <TabsContent value="lifecycle" className="space-y-6">
            <Card className="card-glass">
              <CardHeader>
                <CardTitle>Clinical Research Lifecycle Stages</CardTitle>
                <CardDescription>
                  Track progress through each phase of clinical research
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {lifecycleStages.map((stage) => (
                    <Card
                      key={stage.id}
                      className={`card-glass cursor-pointer transition-all ${activeStage === stage.id ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setActiveStage(stage.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {stage.title}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(stage.status)}
                            <Badge className={getStatusColor(stage.status)}>
                              {stage.status.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription>{stage.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div>
                            <div className="mb-2 flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{stage.progress}%</span>
                            </div>
                            <Progress
                              value={stage.progress}
                              className="w-full"
                            />
                          </div>
                          <div className="text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Duration: {stage.duration}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stage Details */}
            {activeStage && (
              <Card className="card-glass">
                <CardHeader>
                  <CardTitle>
                    {lifecycleStages.find((s) => s.id === activeStage)?.title} -
                    Detailed View
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div>
                      <h4 className="mb-3 text-sm font-semibold">
                        Key Activities
                      </h4>
                      <ul className="space-y-2 text-sm">
                        {lifecycleStages
                          .find((s) => s.id === activeStage)
                          ?.activities.map((activity, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                              <span>{activity}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-3 text-sm font-semibold">
                        Systems Involved
                      </h4>
                      <div className="space-y-2">
                        {lifecycleStages
                          .find((s) => s.id === activeStage)
                          ?.systems.map((system, idx) => (
                            <Badge key={idx} variant="outline" className="mr-2">
                              <Database className="mr-1 h-3 w-3" />
                              {system}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-3 text-sm font-semibold">
                        Stakeholders
                      </h4>
                      <div className="space-y-2">
                        {lifecycleStages
                          .find((s) => s.id === activeStage)
                          ?.stakeholders.map((stakeholder, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="mr-2"
                            >
                              <Users className="mr-1 h-3 w-3" />
                              {stakeholder}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Active Projects */}
          <TabsContent value="projects" className="space-y-6">
            <Card className="card-glass">
              <CardHeader>
                <CardTitle>Current Projects</CardTitle>
                <CardDescription>
                  Monitor active clinical research projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentProjects.map((project) => (
                    <Card key={project.id} className="card-glass p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {project.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Principal Investigator: {project.pi}
                          </p>
                        </div>
                        <Badge className={getStatusColor('in-progress')}>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                        <div>
                          <span className="text-gray-600">Progress:</span>
                          <div className="mt-1">
                            <Progress
                              value={project.progress}
                              className="w-full"
                            />
                            <span className="text-xs text-gray-500">
                              {project.progress}% complete
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Participants:</span>
                          <div className="font-semibold">
                            {project.participants}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Timeline:</span>
                          <div className="font-semibold">
                            {project.startDate} - {project.estimatedCompletion}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflow Status */}
          <TabsContent value="workflow" className="space-y-6">
            <Card className="card-glass">
              <CardHeader>
                <CardTitle>Workflow Monitoring</CardTitle>
                <CardDescription>
                  Track workflow bottlenecks and system performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="card-glass p-4">
                    <h4 className="mb-2 font-semibold">
                      Ethics Approval Queue
                    </h4>
                    <div className="text-2xl font-bold text-blue-600">7</div>
                    <p className="text-sm text-gray-600">
                      Avg processing time: 6 weeks
                    </p>
                  </Card>
                  <Card className="card-glass p-4">
                    <h4 className="mb-2 font-semibold">Data Access Requests</h4>
                    <div className="text-2xl font-bold text-green-600">3</div>
                    <p className="text-sm text-gray-600">
                      Avg processing time: 2 weeks
                    </p>
                  </Card>
                  <Card className="card-glass p-4">
                    <h4 className="mb-2 font-semibold">System Integrations</h4>
                    <div className="text-2xl font-bold text-purple-600">12</div>
                    <p className="text-sm text-gray-600">
                      Active API connections
                    </p>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Integration */}
          <TabsContent value="systems" className="space-y-6">
            <Card className="card-glass">
              <CardHeader>
                <CardTitle>System Integration Status</CardTitle>
                <CardDescription>
                  Monitor connected systems and data flows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-4 font-semibold">Core Systems</h4>
                    <div className="space-y-3">
                      {[
                        'HORUS Explorer',
                        'BASEC Portal',
                        'Ethics Portal',
                        'Data Restitution System',
                        'Web Consent'
                      ].map((system) => (
                        <div
                          key={system}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-blue-500" />
                            <span>{system}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">
                              Connected
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-4 font-semibold">Data Flow Status</h4>
                    <div className="space-y-3">
                      <div className="rounded-lg border p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span>Feasibility Queries</span>
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                        <Progress value={95} className="w-full" />
                        <span className="text-xs text-gray-500">
                          95% uptime
                        </span>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span>Data Extraction</span>
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                        <Progress value={87} className="w-full" />
                        <span className="text-xs text-gray-500">
                          87% uptime
                        </span>
                      </div>
                      <div className="rounded-lg border p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span>Consent Management</span>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Maintenance
                          </Badge>
                        </div>
                        <Progress value={60} className="w-full" />
                        <span className="text-xs text-gray-500">
                          Scheduled maintenance
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
