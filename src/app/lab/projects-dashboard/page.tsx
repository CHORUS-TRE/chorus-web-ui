'use client'

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  FileText,
  Filter,
  Plus,
  Search,
  Shield,
  TrendingUp,
  Users
} from 'lucide-react'
import React, { useState } from 'react'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

export default function ClinicalResearchDashboard() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  // Mock data for research projects
  const projects = [
    {
      id: 'CHUV-2024-001',
      title: 'Efficacy of Novel Immunotherapy in Stage III Melanoma',
      pi: 'Dr. Sarah Chen',
      department: 'Oncology',
      status: 'active',
      phase: 'Protocol Development',
      enrolled: 45,
      target: 120,
      startDate: '2024-01-15',
      riskLevel: 'medium',
      lastUpdate: '2 days ago'
    },
    {
      id: 'CHUV-2024-002',
      title: 'AI-Assisted Diagnosis in Cardiovascular Imaging',
      pi: 'Prof. Marc Dubois',
      department: 'Cardiology',
      status: 'active',
      phase: 'Patient Recruitment',
      enrolled: 230,
      target: 300,
      startDate: '2023-11-20',
      riskLevel: 'low',
      lastUpdate: '1 day ago'
    },
    {
      id: 'CHUV-2023-087',
      title: 'Pediatric Sleep Disorder Intervention Study',
      pi: 'Dr. Emma Laurent',
      department: 'Pediatrics',
      status: 'pending',
      phase: 'Ethics Review',
      enrolled: 0,
      target: 80,
      startDate: '2024-03-01',
      riskLevel: 'low',
      lastUpdate: '5 hours ago'
    },
    {
      id: 'CHUV-2023-065',
      title: 'Chronic Pain Management: Digital Therapeutics',
      pi: 'Dr. Jean-Paul Moreau',
      department: 'Pain Management',
      status: 'active',
      phase: 'Data Analysis',
      enrolled: 150,
      target: 150,
      startDate: '2023-06-10',
      riskLevel: 'low',
      lastUpdate: '3 days ago'
    },
    {
      id: 'CHUV-2023-042',
      title: 'Rare Disease Biomarker Discovery Platform',
      pi: 'Prof. Isabella Romano',
      department: 'Genetics',
      status: 'active',
      phase: 'Patient Recruitment',
      enrolled: 28,
      target: 60,
      startDate: '2023-08-15',
      riskLevel: 'high',
      lastUpdate: '1 day ago'
    },
    {
      id: 'CHUV-2022-123',
      title: 'Long-term Outcomes in Transplant Patients',
      pi: 'Dr. Antoine Rousseau',
      department: 'Transplantation',
      status: 'closing',
      phase: 'Study Closure',
      enrolled: 200,
      target: 200,
      startDate: '2022-03-01',
      riskLevel: 'low',
      lastUpdate: '1 week ago'
    }
  ]

  const stats = {
    totalProjects: 156,
    activeStudies: 89,
    pendingApproval: 12,
    totalPatients: 3450,
    completedStudies: 55
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'closing':
        return 'bg-blue-100 text-blue-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.pi.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === 'all' || project.status === activeTab
    return matchesSearch && matchesTab
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Clinical Research Dashboard
            </h1>
            <p className="mt-1 text-gray-600">
              CHUV Research Management Platform
            </p>
          </div>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            New Study
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900">
                {stats.totalProjects}
              </span>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Studies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-green-600">
                {stats.activeStudies}
              </span>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-yellow-600">
                {stats.pendingApproval}
              </span>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-purple-600">
                {stats.totalPatients}
              </span>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-600">
                {stats.completedStudies}
              </span>
              <CheckCircle className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by study title, ID, or PI name..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Projects Table with Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Research Projects</CardTitle>
          <CardDescription>
            Overview of all clinical research studies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="closing">Closing</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardContent className="pt-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {project.title}
                          </h3>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status.charAt(0).toUpperCase() +
                              project.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="mb-1 text-sm text-gray-600">
                          <span className="font-medium">Study ID:</span>{' '}
                          {project.id} |
                          <span className="ml-2 font-medium">PI:</span>{' '}
                          {project.pi} |
                          <span className="ml-2 font-medium">Department:</span>{' '}
                          {project.department}
                        </p>
                        <p className="text-sm text-gray-500">
                          Started: {project.startDate} • Last updated:{' '}
                          {project.lastUpdate}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-4">
                      <div>
                        <p className="mb-1 text-xs text-gray-500">
                          Current Phase
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {project.phase}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs text-gray-500">
                          Patient Enrollment
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-blue-600"
                              style={{
                                width: `${(project.enrolled / project.target) * 100}%`
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {project.enrolled}/{project.target}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="mb-1 text-xs text-gray-500">Risk Level</p>
                        <div className="flex items-center gap-1">
                          <AlertCircle
                            className={`h-4 w-4 ${getRiskColor(project.riskLevel)}`}
                          />
                          <span
                            className={`text-sm font-medium ${getRiskColor(project.riskLevel)}`}
                          >
                            {project.riskLevel.charAt(0).toUpperCase() +
                              project.riskLevel.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="flex-1">
                          <Database className="mr-1 h-4 w-4" />
                          Data
                        </Button>
                        <Button variant="ghost" size="sm" className="flex-1">
                          <Shield className="mr-1 h-4 w-4" />
                          Compliance
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredProjects.length === 0 && (
                <div className="py-12 text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    No projects found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
