'use client'

import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  Download,
  FileText,
  Heart,
  MessageSquare,
  Shield,
  Upload,
  User,
  Users
} from 'lucide-react'
import React, { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ProjectSpecificDashboard() {
  const [activePhase, setActivePhase] = useState('project-authorization')
  const [selectedMilestone, setSelectedMilestone] = useState(null)

  // Project Information
  const projectInfo = {
    id: 'CVD-2024-001',
    title: 'Cardiovascular Risk Assessment in Type 2 Diabetes Patients',
    pi: 'Dr. Sarah Johnson',
    institution: 'CHUV - Department of Cardiology',
    startDate: '2024-01-15',
    estimatedEnd: '2025-06-30',
    actualProgress: 45,
    status: 'Project Authorization',
    totalBudget: '€350,000',
    participantsTarget: 250,
    participantsEnrolled: 0,
    ethicsRef: 'CER-VD-2024-00321'
  }

  // Workflow Phases with detailed tracking
  const workflowPhases = [
    {
      id: 'study-registration',
      title: 'Study Registration',
      status: 'completed',
      progress: 100,
      startDate: '2024-01-15',
      endDate: '2024-02-05',
      duration: '3 weeks',
      description: 'Initial feasibility and data access preparation',
      activities: [
        {
          name: 'Feasibility Analysis',
          status: 'completed',
          assignee: 'Dr. Johnson',
          dueDate: '2024-01-22',
          completedDate: '2024-01-20',
          notes: 'Identified 280 potential participants in HORUS database'
        },
        {
          name: 'Consent Status Review',
          status: 'completed',
          assignee: 'Research Coordinator',
          dueDate: '2024-01-29',
          completedDate: '2024-01-28',
          notes: '85% of potential participants have broad consent'
        },
        {
          name: 'Data Access Request',
          status: 'completed',
          assignee: 'Data Manager',
          dueDate: '2024-02-05',
          completedDate: '2024-02-03',
          notes: 'Formal request submitted to Data Access Committee'
        }
      ],
      deliverables: [
        'Feasibility Report',
        'Data Access Request Form',
        'Preliminary Cohort Definition'
      ],
      systems: ['HORUS Explorer', 'Web Consent Platform'],
      stakeholders: [
        'Principal Investigator',
        'Research Coordinator',
        'Data Manager'
      ],
      risks: []
    },
    {
      id: 'project-strategy',
      title: 'Project Strategy',
      status: 'completed',
      progress: 100,
      startDate: '2024-02-06',
      endDate: '2024-02-19',
      duration: '2 weeks',
      description: 'Define study methodology and approach',
      activities: [
        {
          name: 'Protocol Development',
          status: 'completed',
          assignee: 'Dr. Johnson',
          dueDate: '2024-02-12',
          completedDate: '2024-02-10',
          notes:
            'Primary endpoint: 10-year cardiovascular risk score improvement'
        },
        {
          name: 'Statistical Analysis Plan',
          status: 'completed',
          assignee: 'Biostatistician',
          dueDate: '2024-02-19',
          completedDate: '2024-02-17',
          notes: 'Power analysis confirms n=250 adequate for primary endpoint'
        }
      ],
      deliverables: [
        'Study Protocol v1.0',
        'Statistical Analysis Plan',
        'Risk Management Plan'
      ],
      systems: ['Protocol Management System'],
      stakeholders: [
        'Principal Investigator',
        'Biostatistician',
        'Clinical Research Team'
      ],
      risks: []
    },
    {
      id: 'project-writing',
      title: 'Project Writing',
      status: 'completed',
      progress: 100,
      startDate: '2024-02-20',
      endDate: '2024-03-15',
      duration: '4 weeks',
      description: 'Complete protocol documentation for ethics submission',
      activities: [
        {
          name: 'Ethics Application Preparation',
          status: 'completed',
          assignee: 'Dr. Johnson',
          dueDate: '2024-03-01',
          completedDate: '2024-02-28',
          notes:
            'Comprehensive ethics dossier prepared with all required documents'
        },
        {
          name: 'Patient Information Sheet',
          status: 'completed',
          assignee: 'Research Coordinator',
          dueDate: '2024-03-08',
          completedDate: '2024-03-06',
          notes:
            'Translated into French and German, reviewed by patient representatives'
        },
        {
          name: 'Data Management Plan',
          status: 'completed',
          assignee: 'Data Manager',
          dueDate: '2024-03-15',
          completedDate: '2024-03-12',
          notes: 'GDPR compliant data handling procedures defined'
        }
      ],
      deliverables: [
        'Ethics Application',
        'Patient Information Materials',
        'Data Management Plan',
        'Insurance Documentation'
      ],
      systems: ['BASEC Portal', 'Document Management System'],
      stakeholders: [
        'Principal Investigator',
        'Ethics Committee',
        'Legal Team'
      ],
      risks: []
    },
    {
      id: 'project-authorization',
      title: 'Project Authorization',
      status: 'in-progress',
      progress: 65,
      startDate: '2024-03-16',
      endDate: '2024-05-10',
      duration: '8 weeks',
      description: 'Obtain ethics approval and regulatory clearance',
      activities: [
        {
          name: 'Ethics Committee Review',
          status: 'in-progress',
          assignee: 'CER-VD Committee',
          dueDate: '2024-04-20',
          completedDate: null,
          notes: 'Submitted March 18, initial review scheduled for April 15'
        },
        {
          name: 'Address Ethics Feedback',
          status: 'pending',
          assignee: 'Dr. Johnson',
          dueDate: '2024-04-30',
          completedDate: null,
          notes: 'Awaiting committee feedback'
        },
        {
          name: 'Insurance Approval',
          status: 'completed',
          assignee: 'Legal Team',
          dueDate: '2024-04-01',
          completedDate: '2024-03-28',
          notes: 'Professional liability insurance confirmed'
        },
        {
          name: 'Regulatory Notification',
          status: 'in-progress',
          assignee: 'Regulatory Affairs',
          dueDate: '2024-05-10',
          completedDate: null,
          notes: 'Swissmedic notification in preparation'
        }
      ],
      deliverables: [
        'Ethics Approval Certificate',
        'Insurance Certificate',
        'Regulatory Approval'
      ],
      systems: ['BASEC Portal', 'SwissEthics Platform', 'Swissmedic Portal'],
      stakeholders: ['Ethics Committee', 'Swissmedic', 'Insurance Provider'],
      risks: [
        {
          type: 'medium',
          description:
            'Potential ethics committee questions may delay approval by 2-3 weeks'
        },
        {
          type: 'low',
          description: 'Regulatory notification timeline dependency'
        }
      ]
    },
    {
      id: 'data-reception',
      title: 'Data Reception',
      status: 'pending',
      progress: 0,
      startDate: '2024-05-11',
      endDate: '2024-05-24',
      duration: '2 weeks',
      description: 'Receive and validate authorized datasets',
      activities: [
        {
          name: 'Data Extraction',
          status: 'not-started',
          assignee: 'Data Engineer',
          dueDate: '2024-05-15',
          completedDate: null,
          notes: 'Awaiting ethics approval to proceed'
        },
        {
          name: 'Data Quality Assessment',
          status: 'not-started',
          assignee: 'Data Manager',
          dueDate: '2024-05-20',
          completedDate: null,
          notes: 'Validation protocols prepared'
        },
        {
          name: 'Secure Environment Setup',
          status: 'not-started',
          assignee: 'IT Security',
          dueDate: '2024-05-24',
          completedDate: null,
          notes: 'HORUS workspace configuration pending'
        }
      ],
      deliverables: [
        'Validated Dataset',
        'Data Quality Report',
        'Secure Analysis Environment'
      ],
      systems: ['HORUS Restitution', 'Secure Computing Environment'],
      stakeholders: [
        'Data Engineer',
        'IT Security Team',
        'Data Protection Officer'
      ],
      risks: [
        {
          type: 'medium',
          description:
            'Data quality issues may require additional cleaning time'
        }
      ]
    },
    {
      id: 'study-ongoing',
      title: 'Study Execution',
      status: 'pending',
      progress: 0,
      startDate: '2024-05-25',
      endDate: '2024-12-31',
      duration: '32 weeks',
      description: 'Conduct study activities and data collection',
      activities: [
        {
          name: 'Participant Recruitment',
          status: 'not-started',
          assignee: 'Clinical Research Team',
          dueDate: '2024-08-31',
          completedDate: null,
          notes: 'Target: 250 participants over 3 months'
        },
        {
          name: 'Baseline Data Collection',
          status: 'not-started',
          assignee: 'Research Nurses',
          dueDate: '2024-10-15',
          completedDate: null,
          notes: 'Clinical assessments, lab work, imaging'
        },
        {
          name: 'Follow-up Monitoring',
          status: 'not-started',
          assignee: 'Research Coordinator',
          dueDate: '2024-12-31',
          completedDate: null,
          notes: '6-month follow-up for all participants'
        }
      ],
      deliverables: ['Complete Dataset', 'Interim Reports', 'Safety Reports'],
      systems: [
        'REDCap',
        'Clinical Data Management System',
        'Adverse Event Reporting'
      ],
      stakeholders: [
        'Clinical Research Team',
        'Research Nurses',
        'Safety Monitor'
      ],
      risks: [
        {
          type: 'high',
          description: 'Recruitment challenges due to strict inclusion criteria'
        },
        {
          type: 'medium',
          description: 'Potential COVID-related disruptions to follow-up visits'
        }
      ]
    },
    {
      id: 'data-analysis',
      title: 'Data Analysis',
      status: 'pending',
      progress: 0,
      startDate: '2025-01-01',
      endDate: '2025-04-30',
      duration: '17 weeks',
      description: 'Statistical analysis and results generation',
      activities: [
        {
          name: 'Primary Analysis',
          status: 'not-started',
          assignee: 'Biostatistician',
          dueDate: '2025-02-28',
          completedDate: null,
          notes: 'Primary endpoint analysis per statistical plan'
        },
        {
          name: 'Secondary Analyses',
          status: 'not-started',
          assignee: 'Research Fellow',
          dueDate: '2025-03-31',
          completedDate: null,
          notes: 'Subgroup analyses and exploratory endpoints'
        },
        {
          name: 'Results Validation',
          status: 'not-started',
          assignee: 'Independent Statistician',
          dueDate: '2025-04-15',
          completedDate: null,
          notes: 'Independent verification of key results'
        }
      ],
      deliverables: [
        'Statistical Analysis Report',
        'Analysis Dataset',
        'Results Summary'
      ],
      systems: ['Statistical Software (R/SAS)', 'Data Visualization Tools'],
      stakeholders: [
        'Biostatistician',
        'Independent Statistician',
        'Principal Investigator'
      ],
      risks: [
        {
          type: 'medium',
          description:
            'Complex analyses may require additional statistical expertise'
        }
      ]
    },
    {
      id: 'end-study',
      title: 'Study Completion',
      status: 'not-started',
      progress: 0,
      startDate: '2025-05-01',
      endDate: '2025-06-30',
      duration: '8 weeks',
      description: 'Study closure and dissemination',
      activities: [
        {
          name: 'Final Study Report',
          status: 'not-started',
          assignee: 'Dr. Johnson',
          dueDate: '2025-05-31',
          completedDate: null,
          notes: 'Comprehensive final report for ethics committee'
        },
        {
          name: 'Manuscript Preparation',
          status: 'not-started',
          assignee: 'Writing Committee',
          dueDate: '2025-06-15',
          completedDate: null,
          notes: 'Target journal: European Heart Journal'
        },
        {
          name: 'Data Archiving',
          status: 'not-started',
          assignee: 'Data Manager',
          dueDate: '2025-06-30',
          completedDate: null,
          notes: 'Long-term storage in institutional repository'
        }
      ],
      deliverables: [
        'Final Study Report',
        'Scientific Publication',
        'Archived Dataset'
      ],
      systems: ['Data Archive', 'Publication Management System'],
      stakeholders: [
        'Ethics Committee',
        'Scientific Community',
        'Data Archive'
      ],
      risks: [
        {
          type: 'low',
          description: 'Journal review process timeline uncertainty'
        }
      ]
    }
  ]

  const teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Principal Investigator',
      email: 's.johnson@chuv.ch',
      phone: '+41 21 314 1234',
      workload: '40%',
      status: 'active'
    },
    {
      name: 'Marie Dubois',
      role: 'Research Coordinator',
      email: 'm.dubois@chuv.ch',
      phone: '+41 21 314 5678',
      workload: '80%',
      status: 'active'
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Biostatistician',
      email: 'm.chen@chuv.ch',
      phone: '+41 21 314 9012',
      workload: '30%',
      status: 'active'
    },
    {
      name: 'Sophie Martin',
      role: 'Data Manager',
      email: 's.martin@chuv.ch',
      phone: '+41 21 314 3456',
      workload: '60%',
      status: 'active'
    }
  ]

  const upcomingMilestones = [
    {
      date: '2024-04-15',
      title: 'Ethics Committee Review Meeting',
      type: 'critical',
      description: 'CER-VD committee will review the study protocol'
    },
    {
      date: '2024-04-30',
      title: 'Response to Ethics Feedback Due',
      type: 'important',
      description: 'Address any concerns raised by the ethics committee'
    },
    {
      date: '2024-05-10',
      title: 'Regulatory Notification Deadline',
      type: 'important',
      description: 'Complete Swissmedic notification process'
    },
    {
      date: '2024-05-25',
      title: 'Planned Study Start Date',
      type: 'milestone',
      description: 'Begin participant recruitment if all approvals obtained'
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

  const getRiskColor = (type: string) => {
    switch (type) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-16">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Project Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6 text-red-500" />
                  <h1 className="text-2xl font-bold text-gray-900">
                    {projectInfo.title}
                  </h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Project ID: {projectInfo.id}</span>
                  <span>•</span>
                  <span>PI: {projectInfo.pi}</span>
                  <span>•</span>
                  <span>Institution: {projectInfo.institution}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <Badge className={getStatusColor('in-progress')}>
                    {projectInfo.status}
                  </Badge>
                  <span className="text-gray-600">
                    Ethics Ref: {projectInfo.ethicsRef}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export Status
                </Button>
                <Button>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Communications
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div>
                <h4 className="mb-2 text-sm font-semibold">Overall Progress</h4>
                <Progress
                  value={projectInfo.actualProgress}
                  className="mb-2 w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{projectInfo.actualProgress}% Complete</span>
                  <span>
                    {projectInfo.startDate} - {projectInfo.estimatedEnd}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold">Participants</h4>
                <div className="text-2xl font-bold text-blue-600">
                  {projectInfo.participantsEnrolled}
                </div>
                <div className="text-sm text-gray-600">
                  of {projectInfo.participantsTarget} target
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold">Budget</h4>
                <div className="text-2xl font-bold text-green-600">
                  {projectInfo.totalBudget}
                </div>
                <div className="text-sm text-gray-600">Total allocated</div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold">Timeline</h4>
                <div className="text-2xl font-bold text-purple-600">17</div>
                <div className="text-sm text-gray-600">months duration</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard */}
        <Tabs defaultValue="workflow" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="activities">Current Activities</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="risks">Risks & Issues</TabsTrigger>
          </TabsList>

          {/* Workflow Timeline */}
          <TabsContent value="workflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Workflow Timeline</CardTitle>
                <CardDescription>
                  Track progress through each phase of the clinical study
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflowPhases.map((phase, index) => (
                    <div key={phase.id} className="relative">
                      {index < workflowPhases.length - 1 && (
                        <div className="absolute left-6 top-12 h-16 w-0.5 bg-gray-200"></div>
                      )}
                      <Card
                        className={`cursor-pointer transition-all ${activePhase === phase.id ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => setActivePhase(phase.id)}
                      >
                        <CardContent className="p-6">
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div
                                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                  phase.status === 'completed'
                                    ? 'bg-green-100'
                                    : phase.status === 'in-progress'
                                      ? 'bg-blue-100'
                                      : 'bg-gray-100'
                                }`}
                              >
                                {getStatusIcon(phase.status)}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold">
                                  {phase.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {phase.description}
                                </p>
                                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                  <Calendar className="h-3 w-3" />
                                  <span>
                                    {phase.startDate} - {phase.endDate}
                                  </span>
                                  <span>•</span>
                                  <span>{phase.duration}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(phase.status)}>
                                {phase.status.replace('-', ' ')}
                              </Badge>
                              <div className="mt-2">
                                <Progress
                                  value={phase.progress}
                                  className="w-24"
                                />
                                <span className="text-xs text-gray-500">
                                  {phase.progress}%
                                </span>
                              </div>
                            </div>
                          </div>
                          {activePhase === phase.id && (
                            <div className="mt-4 border-t pt-4">
                              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <div>
                                  <h4 className="mb-3 text-sm font-semibold">
                                    Activities
                                  </h4>
                                  <div className="space-y-2">
                                    {phase.activities.map((activity, idx) => (
                                      <div
                                        key={idx}
                                        className="rounded-lg border bg-gray-50 p-3"
                                      >
                                        <div className="mb-2 flex items-center justify-between">
                                          <span className="text-sm font-medium">
                                            {activity.name}
                                          </span>
                                          <Badge
                                            variant="outline"
                                            className={getStatusColor(
                                              activity.status
                                            )}
                                          >
                                            {activity.status.replace('-', ' ')}
                                          </Badge>
                                        </div>
                                        <div className="text-xs text-gray-600">
                                          <div>
                                            Assignee: {activity.assignee}
                                          </div>
                                          <div>Due: {activity.dueDate}</div>
                                          {activity.completedDate && (
                                            <div>
                                              Completed:{' '}
                                              {activity.completedDate}
                                            </div>
                                          )}
                                          {activity.notes && (
                                            <div className="mt-1 italic">
                                              {activity.notes}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="mb-3 text-sm font-semibold">
                                      Deliverables
                                    </h4>
                                    <div className="space-y-1">
                                      {phase.deliverables.map(
                                        (deliverable, idx) => (
                                          <div
                                            key={idx}
                                            className="flex items-center gap-2 text-sm"
                                          >
                                            <FileText className="h-3 w-3 text-gray-400" />
                                            <span>{deliverable}</span>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="mb-3 text-sm font-semibold">
                                      Systems
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {phase.systems.map((system, idx) => (
                                        <Badge key={idx} variant="secondary">
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
                                    <div className="flex flex-wrap gap-2">
                                      {phase.stakeholders.map(
                                        (stakeholder, idx) => (
                                          <Badge key={idx} variant="outline">
                                            <Users className="mr-1 h-3 w-3" />
                                            {stakeholder}
                                          </Badge>
                                        )
                                      )}
                                    </div>
                                  </div>
                                  {phase.risks.length > 0 && (
                                    <div>
                                      <h4 className="mb-3 text-sm font-semibold">
                                        Risks
                                      </h4>
                                      <div className="space-y-2">
                                        {phase.risks.map((risk, idx) => (
                                          <div
                                            key={idx}
                                            className="flex items-start gap-2 text-sm"
                                          >
                                            <AlertTriangle className="mt-0.5 h-4 w-4 text-orange-500" />
                                            <div>
                                              <Badge
                                                className={getRiskColor(
                                                  risk.type
                                                )}
                                                variant="outline"
                                              >
                                                {risk.type}
                                              </Badge>
                                              <p className="mt-1 text-gray-600">
                                                {risk.description}
                                              </p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Current Activities */}
          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Activities & Tasks</CardTitle>
                <CardDescription>
                  Active tasks requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {
                  <div className="space-y-4">
                    {workflowPhases
                      .filter((phase) => phase.status === 'in-progress')
                      .map((phase) => (
                        <div key={phase.id}>
                          <h3 className="mb-3 text-lg font-semibold">
                            {phase.title}
                          </h3>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {phase.activities
                              .filter(
                                (activity) =>
                                  activity.status === 'in-progress' ||
                                  activity.status === 'pending'
                              )
                              .map((activity, idx) => (
                                <Card key={idx} className="p-4">
                                  <div className="mb-3 flex items-start justify-between">
                                    <h4 className="font-medium">
                                      {activity.name}
                                    </h4>
                                    <Badge
                                      className={getStatusColor(
                                        activity.status
                                      )}
                                    >
                                      {activity.status}
                                    </Badge>
                                  </div>
                                  <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <User className="h-3 w-3" />
                                      <span>{activity.assignee}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-3 w-3" />
                                      <span>Due: {activity.dueDate}</span>
                                    </div>
                                    {activity.notes && (
                                      <p className="italic text-gray-500">
                                        {activity.notes}
                                      </p>
                                    )}
                                  </div>
                                </Card>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                }
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
