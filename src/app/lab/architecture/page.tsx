'use client'

import {
  Activity,
  AlertCircle,
  Box,
  CheckCircle,
  Cloud,
  Container,
  Database,
  Eye,
  FileText,
  Layers,
  Lock,
  Network,
  Server,
  Settings,
  Shield,
  Users
} from 'lucide-react'
import React, { useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '~/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

export default function ArchitectureDashboard() {
  const [selectedLevel, setSelectedLevel] = useState('context')

  const architectureLevels = [
    { id: 'context', label: 'Level 1: Context', icon: Users },
    { id: 'container', label: 'Level 2: Containers', icon: Box },
    { id: 'component', label: 'Level 3: Components', icon: Layers },
    { id: 'deployment', label: 'Level 4: Deployment', icon: Cloud }
  ]

  const users = [
    {
      name: 'Clinical Researcher',
      role: 'End-user conducting clinical research',
      interactions: [
        'Access patient datasets',
        'Run analyses',
        'Submit data access requests'
      ],
      color: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      name: 'Biostatistician',
      role: 'Statistical analyst',
      interactions: [
        'Access analytical tools',
        'Perform statistical analyses',
        'Generate reports'
      ],
      color: 'bg-purple-100 text-purple-800 border-purple-300'
    },
    {
      name: 'Principal Investigator',
      role: 'Research project leader',
      interactions: [
        'Oversee projects',
        'Manage team access',
        'Monitor compliance'
      ],
      color: 'bg-green-100 text-green-800 border-green-300'
    },
    {
      name: 'Data Engineer',
      role: 'Data provisioning and platform admin',
      interactions: [
        'Provision datasets',
        'Manage data pipelines',
        'Monitor system health'
      ],
      color: 'bg-orange-100 text-orange-800 border-orange-300'
    },
    {
      name: 'Data Protection Officer',
      role: 'Compliance and governance oversight',
      interactions: [
        'Review audit logs',
        'Approve data access',
        'Monitor compliance'
      ],
      color: 'bg-red-100 text-red-800 border-red-300'
    }
  ]

  const externalSystems = [
    {
      name: 'Keycloak Identity Provider',
      type: 'Authentication',
      protocol: 'OAuth2/OIDC',
      purpose: 'Centralized identity management and SSO'
    },
    {
      name: 'Hospital Data Sources',
      type: 'Data System',
      protocol: 'Secure data transfer',
      purpose: 'Provide research datasets'
    },
    {
      name: 'Swiss Ethics (BASEC)',
      type: 'Regulatory System',
      protocol: 'API (planned)',
      purpose: 'Verify ethical approval status'
    },
    {
      name: 'Container Registry (Harbor)',
      type: 'Infrastructure',
      protocol: 'Docker Registry API',
      purpose: 'Secure container image storage'
    },
    {
      name: 'Monitoring (Prometheus/Grafana)',
      type: 'Infrastructure',
      protocol: 'Metrics/Alerts',
      purpose: 'Platform health monitoring'
    }
  ]

  const containers = [
    {
      name: 'CHORUS Web UI',
      tech: 'Next.js 14, TypeScript',
      responsibilities: [
        'User dashboard',
        'Workspace launcher',
        'Data access requests',
        'Team collaboration'
      ],
      ports: ['443 (HTTPS)'],
      color: 'border-blue-500'
    },
    {
      name: 'CHORUS Backend',
      tech: 'Go, gRPC',
      responsibilities: [
        'User management',
        'Workspace management',
        'Data access workflows',
        'RBAC enforcement'
      ],
      ports: ['9090 (gRPC)', '8080 (REST)'],
      color: 'border-green-500'
    },
    {
      name: 'Workbench Operator',
      tech: 'Go, Kubebuilder',
      responsibilities: [
        'CRD management',
        'Xpra orchestration',
        'Application lifecycle',
        'Resource allocation'
      ],
      ports: ['Kubernetes API'],
      color: 'border-purple-500'
    },
    {
      name: 'PostgreSQL Database',
      tech: 'PostgreSQL 15',
      responsibilities: [
        'User profiles',
        'Project metadata',
        'Data access requests',
        'Audit logs'
      ],
      ports: ['5432'],
      color: 'border-orange-500'
    },
    {
      name: 'Keycloak',
      tech: 'Keycloak/Red Hat SSO',
      responsibilities: [
        'User authentication',
        'OAuth2/OIDC provider',
        'User federation',
        'MFA'
      ],
      ports: ['8080'],
      color: 'border-red-500'
    },
    {
      name: 'Research Applications',
      tech: 'Docker containers',
      responsibilities: [
        'RStudio',
        'Jupyter Lab',
        'VS Code',
        '3D Slicer',
        'FreeSurfer'
      ],
      ports: ['Xpra protocol'],
      color: 'border-cyan-500'
    }
  ]

  const backendComponents = [
    {
      layer: 'API Layer',
      components: [
        { name: 'gRPC Server', desc: 'Primary API endpoint with interceptors' },
        { name: 'gRPC Gateway', desc: 'REST to gRPC translation' },
        {
          name: 'API Controllers',
          desc: 'User, Workspace, Workbench, Auth, Data Request'
        }
      ]
    },
    {
      layer: 'Service Layer',
      components: [
        {
          name: 'User Service',
          desc: 'Profile management and role assignment'
        },
        { name: 'Workspace Service', desc: 'Lifecycle and quota enforcement' },
        {
          name: 'Workbench Service',
          desc: 'Application deployment orchestration'
        },
        { name: 'Auth Service', desc: 'Token validation and RBAC' },
        { name: 'Data Request Service', desc: 'Approval workflows' }
      ]
    },
    {
      layer: 'Data Access Layer',
      components: [
        {
          name: 'Repository Pattern',
          desc: 'User, Workspace, Workbench, Data Request, Audit Stores'
        }
      ]
    },
    {
      layer: 'Infrastructure',
      components: [
        { name: 'Provider System', desc: 'Dependency injection' },
        { name: 'Middleware', desc: 'Auth, logging, validation, caching' },
        { name: 'External Clients', desc: 'Keycloak, Kubernetes, PostgreSQL' }
      ]
    }
  ]

  const deploymentInfo = {
    namespaces: [
      { name: 'chorus-system', purpose: 'Core platform services' },
      { name: 'chorus-workspaces', purpose: 'User research workspaces' },
      { name: 'keycloak', purpose: 'Identity management' },
      { name: 'monitoring', purpose: 'Observability stack' },
      { name: 'harbor', purpose: 'Container registry' }
    ],
    stages: [
      {
        stage: 0,
        name: 'Prerequisites',
        items: ['Certificate authorities', 'Ingress controller', 'Cert-manager']
      },
      {
        stage: 1,
        name: 'Core Infrastructure',
        items: ['PostgreSQL', 'Keycloak', 'Harbor']
      },
      {
        stage: 2,
        name: 'Platform Services',
        items: ['CHORUS Backend', 'Workbench Operator CRDs', 'Monitoring']
      },
      {
        stage: 3,
        name: 'User-Facing Services',
        items: ['CHORUS Web UI', 'Workbench Operator', 'OAuth2 Proxy']
      },
      { stage: 4, name: 'CI/CD', items: ['ArgoCD', 'Argo Workflows'] }
    ]
  }

  const securityFeatures = [
    {
      category: 'Authentication',
      features: [
        'Keycloak OIDC/OAuth2',
        'Authorization Code Flow with PKCE',
        'Optional MFA',
        'Secure cookie sessions'
      ]
    },
    {
      category: 'Authorization',
      features: [
        'Role-Based Access Control (RBAC)',
        'Multi-layer enforcement',
        'Kubernetes RBAC',
        'Network policies'
      ]
    },
    {
      category: 'Network Security',
      features: [
        'Workspace isolation',
        'End-to-end TLS',
        'No egress internet',
        'Service mesh option'
      ]
    },
    {
      category: 'Data Protection',
      features: [
        'Encryption at rest',
        'Encryption in transit (TLS 1.3)',
        'Secrets management',
        'PII pseudonymization'
      ]
    },
    {
      category: 'Compliance',
      features: [
        'GDPR compliance',
        'ISO 27001',
        'SATRE specification',
        'Comprehensive audit logging'
      ]
    }
  ]

  const techStack = [
    {
      layer: 'Frontend',
      items: [
        { tech: 'Next.js', version: '14.x' },
        { tech: 'React', version: '18.x' },
        { tech: 'TypeScript', version: '5.x' },
        { tech: 'Zod', version: 'Latest' }
      ]
    },
    {
      layer: 'Backend',
      items: [
        { tech: 'Go', version: '1.21+' },
        { tech: 'gRPC', version: 'Latest' },
        { tech: 'Protocol Buffers', version: '3.x' }
      ]
    },
    {
      layer: 'Infrastructure',
      items: [
        { tech: 'Kubernetes', version: '1.26+' },
        { tech: 'PostgreSQL', version: '15.x' },
        { tech: 'Keycloak', version: 'Latest' },
        { tech: 'ArgoCD', version: 'Latest' }
      ]
    }
  ]

  return (
    <div className="glass min-h-screen p-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="glass-elevated mb-8 rounded-lg p-6 shadow-lg">
          <div className="text-muted-background mb-2 flex items-center gap-3">
            <Layers className="h-10 w-10" />
            <h1 className="text-4xl font-bold">CHORUS-TRE Architecture</h1>
          </div>
          <p className="text-lg text-slate-600">
            Model Architecture Documentation
          </p>
          <div className="mt-4 flex gap-2">
            <Badge variant="secondary" className="bg-green-50">
              <span className="text-muted-background">Version 1.0</span>
            </Badge>
            <Badge variant="secondary" className="bg-blue-50">
              <span className="text-muted-background">2025-10-27</span>
            </Badge>
            <Badge variant="secondary" className="bg-purple-50">
              <span className="text-muted-background">Kubernetes-Native</span>
            </Badge>
            <Badge variant="secondary" className="bg-orange-50">
              <span className="text-muted-background">SATRE Compliant</span>
            </Badge>
          </div>
        </header>

        {/* Overview Alert */}
        <Alert className="glass-surface mb-6 border-muted/40 bg-blue-50">
          <AlertCircle className="text-muted-background h-4 w-4" />
          <AlertTitle className="text-muted-background">
            System Overview
          </AlertTitle>
          <AlertDescription className="text-muted-background">
            CHORUS-TRE is a secure, cloud-native platform enabling clinical
            researchers to conduct sensitive health research in a compliant and
            controlled Kubernetes environment.
          </AlertDescription>
        </Alert>

        {/* Main Navigation Tabs */}
        <Tabs
          defaultValue="context"
          className="space-y-6"
          onValueChange={setSelectedLevel}
        >
          <TabsList className="grid h-auto w-full grid-cols-4 bg-white p-2 shadow-md">
            {architectureLevels.map((level) => {
              const Icon = level.icon
              return (
                <TabsTrigger
                  key={level.id}
                  value={level.id}
                  className="data-[state=active]:bg-muted-background flex flex-col items-center gap-2 py-3"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{level.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Level 1: System Context */}
          <TabsContent value="context" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Level 1: System Context
                </CardTitle>
                <CardDescription className="text-blue-50">
                  High-level view of users, external systems, and the CHORUS-TRE
                  platform
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Users Section */}
                <div className="mb-8">
                  <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                    <Users className="h-5 w-5 text-blue-600" />
                    Primary Users (Actors)
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {users.map((user, idx) => (
                      <Card key={idx} className={`border-2 ${user.color}`}>
                        <CardHeader>
                          <CardTitle className="text-base">
                            {user.name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {user.role}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-2 text-sm font-medium">
                            Key Interactions:
                          </p>
                          <ul className="space-y-1 text-sm">
                            {user.interactions.map((interaction, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="mt-1 h-3 w-3 flex-shrink-0" />
                                <span>{interaction}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* External Systems */}
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                    <Network className="h-5 w-5 text-green-600" />
                    External Systems
                  </h3>
                  <div className="grid gap-4">
                    {externalSystems.map((system, idx) => (
                      <Card key={idx} className="border-l-4 border-green-500">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-lg font-semibold">
                                {system.name}
                              </h4>
                              <p className="mt-1 text-sm text-slate-600">
                                {system.purpose}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="mb-2">
                                {system.type}
                              </Badge>
                              <p className="text-xs text-slate-500">
                                {system.protocol}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Cross-Cutting Concerns Section */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Security */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    Security Architecture
                  </CardTitle>
                  <CardDescription className="text-red-50">
                    Multi-layered security controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible>
                    {securityFeatures.map((category, idx) => (
                      <AccordionItem key={idx} value={`sec-${idx}`}>
                        <AccordionTrigger className="text-sm font-semibold">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-red-600" />
                            {category.category}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-1">
                            {category.features.map((feature, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm"
                              >
                                <CheckCircle className="mt-1 h-3 w-3 flex-shrink-0 text-green-600" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              {/* Technology Stack */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-6 w-6" />
                    Technology Stack
                  </CardTitle>
                  <CardDescription className="text-cyan-50">
                    Core technologies and versions
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {techStack.map((layer, idx) => (
                    <div key={idx} className="mb-4 last:mb-0">
                      <h4 className="mb-2 text-sm font-semibold text-cyan-700">
                        {layer.layer}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {layer.items.map((item, i) => (
                          <div
                            key={i}
                            className="rounded border border-cyan-200 bg-cyan-50 p-2"
                          >
                            <p className="font-mono text-xs font-semibold">
                              {item.tech}
                            </p>
                            <p className="text-xs text-slate-600">
                              {item.version}
                            </p>
                          </div>
                        ))}
                      </div>
                      {idx < techStack.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Compliance Footer */}
            <Card className="mt-6 border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <FileText className="h-8 w-8 flex-shrink-0 text-green-600" />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-green-900">
                      Compliance & Standards
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-green-600">
                        SATRE Specification
                      </Badge>
                      <Badge className="bg-blue-600">GDPR Compliant</Badge>
                      <Badge className="bg-purple-600">ISO 27001</Badge>
                      <Badge className="bg-orange-600">Kubernetes-Native</Badge>
                      <Badge className="bg-cyan-600">Cloud-Agnostic</Badge>
                    </div>
                    <p className="mt-3 text-sm text-slate-700">
                      CHORUS-TRE implements comprehensive security controls
                      aligned with healthcare data protection standards,
                      providing a trusted environment for sensitive research.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Level 2: Containers */}
          <TabsContent value="container" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Box className="h-6 w-6" />
                  Level 2: Container Architecture
                </CardTitle>
                <CardDescription className="text-green-50">
                  Containerized applications and their responsibilities
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {containers.map((container, idx) => (
                    <Card
                      key={idx}
                      className={`border-t-4 ${container.color} shadow-md transition-shadow hover:shadow-lg`}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Container className="h-5 w-5" />
                          {container.name}
                        </CardTitle>
                        <CardDescription className="font-mono text-xs">
                          {container.tech}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <p className="mb-2 text-sm font-semibold">
                            Responsibilities:
                          </p>
                          <ul className="space-y-1 text-sm">
                            {container.responsibilities.map((resp, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="mb-2 text-sm font-semibold">
                            Ports/Interfaces:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {container.ports.map((port, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs"
                              >
                                {port}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Level 3: Components */}
          <TabsContent value="component" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-6 w-6" />
                  Level 3: Component Architecture
                </CardTitle>
                <CardDescription className="text-purple-50">
                  Internal components and their interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="backend" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="backend">
                      Backend Components
                    </TabsTrigger>
                    <TabsTrigger value="frontend">
                      Web UI Components
                    </TabsTrigger>
                    <TabsTrigger value="xpra-server" disabled>
                      Xpra ServerComponent
                    </TabsTrigger>
                    <TabsTrigger value="operator" disabled>
                      Operator Component
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="backend">
                    <Accordion type="single" collapsible className="space-y-2">
                      {backendComponents.map((layer, idx) => (
                        <AccordionItem
                          key={idx}
                          value={`layer-${idx}`}
                          className="rounded-lg border px-4"
                        >
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-3">
                              <Server className="h-5 w-5 text-purple-600" />
                              <span className="font-semibold">
                                {layer.layer}
                              </span>
                              <Badge variant="secondary">
                                {layer.components.length} components
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 pt-2">
                              {layer.components.map((component, i) => (
                                <div
                                  key={i}
                                  className="rounded border-l-4 border-purple-400 bg-slate-50 p-3"
                                >
                                  <p className="text-sm font-medium">
                                    {component.name}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-600">
                                    {component.desc}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>

                  <TabsContent value="frontend">
                    <div className="space-y-4">
                      <Card className="border-l-4 border-blue-500">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Presentation Layer
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="rounded bg-slate-50 p-3">
                            <p className="text-sm font-medium">
                              Page Components
                            </p>
                            <p className="text-xs text-slate-600">
                              Next.js App Router - Dashboard, Workspaces,
                              Projects, Data Requests
                            </p>
                          </div>
                          <div className="rounded bg-slate-50 p-3">
                            <p className="text-sm font-medium">
                              Feature Components
                            </p>
                            <p className="text-xs text-slate-600">
                              Reusable UI - WorkspaceCard, ProjectCard,
                              DataRequestTable
                            </p>
                          </div>
                          <div className="rounded bg-slate-50 p-3">
                            <p className="text-sm font-medium">
                              View-Model Layer
                            </p>
                            <p className="text-xs text-slate-600">
                              Next.js Server Actions - Data fetching and form
                              handling
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-green-500">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Application Layer
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="rounded bg-slate-50 p-3">
                            <p className="text-sm font-medium">Use Cases</p>
                            <p className="text-xs text-slate-600">
                              CreateWorkspace, ListProjects, SubmitDataRequest,
                              LaunchApplication
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-orange-500">
                        <CardHeader>
                          <CardTitle className="text-base">
                            Domain & Infrastructure Layers
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="rounded bg-slate-50 p-3">
                            <p className="text-sm font-medium">Domain Models</p>
                            <p className="text-xs text-slate-600">
                              Zod schema validation - User, Workspace, Project,
                              DataRequest
                            </p>
                          </div>
                          <div className="rounded bg-slate-50 p-3">
                            <p className="text-sm font-medium">
                              Repository Pattern
                            </p>
                            <p className="text-xs text-slate-600">
                              Interface definitions and implementations with API
                              client
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Level 4: Deployment */}
          <TabsContent value="deployment" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-6 w-6" />
                  Level 4: Deployment Architecture
                </CardTitle>
                <CardDescription className="text-orange-50">
                  Kubernetes deployment and infrastructure configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Namespaces */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                    <Box className="h-5 w-5 text-orange-600" />
                    Kubernetes Namespaces
                  </h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {deploymentInfo.namespaces.map((ns, idx) => (
                      <Card
                        key={idx}
                        className="bg-gradient-to-br from-orange-50 to-white"
                      >
                        <CardContent className="pt-4">
                          <p className="font-mono text-sm font-semibold text-orange-700">
                            {ns.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-600">
                            {ns.purpose}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Installation Stages */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                    <Settings className="h-5 w-5 text-orange-600" />
                    Installation Stages
                  </h3>
                  <Accordion type="single" collapsible className="space-y-2">
                    {deploymentInfo.stages.map((stage, idx) => (
                      <AccordionItem
                        key={idx}
                        value={`stage-${idx}`}
                        className="rounded-lg border px-4"
                      >
                        <AccordionTrigger>
                          <div className="flex items-center gap-3">
                            <Badge className="bg-orange-600">
                              Stage {stage.stage}
                            </Badge>
                            <span className="font-semibold">{stage.name}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 pt-2">
                            {stage.items.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-center gap-2 text-sm"
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
