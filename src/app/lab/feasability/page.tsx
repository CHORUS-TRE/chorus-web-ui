'use client'

import {
  BarChart3,
  Calendar,
  CheckCircle,
  Database,
  Download,
  FileText,
  Filter,
  Info,
  Lock,
  Search,
  Settings,
  Users
} from 'lucide-react'
import React, { useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
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
import { Label } from '~/components/ui/label'
import { Progress } from '~/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

export default function FeasibilityAssessment() {
  const [activeTab, setActiveTab] = useState('define')
  const [studyName, setStudyName] = useState('')
  const [dataSource, setDataSource] = useState('synthetic')
  const [cohortSize, setCohortSize] = useState(0)
  const [feasibilityScore, setFeasibilityScore] = useState(0)

  const handleGenerateReport = () => {
    setCohortSize(1247)
    setFeasibilityScore(82)
    setActiveTab('results')
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Feasibility Assessment
              </h1>
              <p className="mt-1 text-slate-600">
                Pre-protocol Data Exploration & Cohort Analysis
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Privacy Protected
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="define" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Define Study
            </TabsTrigger>
            <TabsTrigger value="cohort" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Build Cohort
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Results
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Define Study */}
          <TabsContent value="define" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Study Information</CardTitle>
                <CardDescription>
                  Define your research study parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="study-name">Study Name</Label>
                    <Input
                      id="study-name"
                      placeholder="e.g., Cardiovascular Risk Factor Analysis"
                      value={studyName}
                      onChange={(e) => setStudyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="study-type">Study Type</Label>
                    <Select>
                      <SelectTrigger id="study-type">
                        <SelectValue placeholder="Select study type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="observational">
                          Observational
                        </SelectItem>
                        <SelectItem value="interventional">
                          Interventional
                        </SelectItem>
                        <SelectItem value="retrospective">
                          Retrospective
                        </SelectItem>
                        <SelectItem value="prospective">Prospective</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="therapeutic-area">Therapeutic Area</Label>
                    <Select>
                      <SelectTrigger id="therapeutic-area">
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="oncology">Oncology</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                        <SelectItem value="endocrinology">
                          Endocrinology
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time-frame">Time Frame</Label>
                    <Select>
                      <SelectTrigger id="time-frame">
                        <SelectValue placeholder="Select time frame" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1year">Last 1 Year</SelectItem>
                        <SelectItem value="3years">Last 3 Years</SelectItem>
                        <SelectItem value="5years">Last 5 Years</SelectItem>
                        <SelectItem value="10years">Last 10 Years</SelectItem>
                        <SelectItem value="all">All Available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Study Description</Label>
                  <textarea
                    id="description"
                    className="min-h-24 w-full rounded-md border p-3 text-sm"
                    placeholder="Describe your research question and objectives..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Source Selection
                </CardTitle>
                <CardDescription>
                  Choose between real and synthetic data for exploration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Data Privacy Notice</AlertTitle>
                  <AlertDescription>
                    Synthetic data provides similar statistical properties
                    without exposing real patient information. Real data access
                    requires additional approval.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-2 gap-4">
                  <Card
                    className={`cursor-pointer transition-all ${dataSource === 'synthetic' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setDataSource('synthetic')}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 h-4 w-4 rounded-full border-2 ${dataSource === 'synthetic' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                        />
                        <div>
                          <h3 className="mb-1 font-semibold">Synthetic Data</h3>
                          <p className="text-sm text-slate-600">
                            Anonymized, generated data for initial exploration
                          </p>
                          <Badge className="mt-2" variant="secondary">
                            Instant Access
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`cursor-pointer transition-all ${dataSource === 'real' ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setDataSource('real')}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 h-4 w-4 rounded-full border-2 ${dataSource === 'real' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                        />
                        <div>
                          <h3 className="mb-1 font-semibold">
                            Real Data (Anonymized)
                          </h3>
                          <p className="text-sm text-slate-600">
                            Actual clinical data with privacy protection
                          </p>
                          <Badge className="mt-2" variant="outline">
                            Approval Required
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={() => setActiveTab('cohort')}>
                    Continue to Cohort Builder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Build Cohort */}
          <TabsContent value="cohort" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Cohort Criteria
                  </CardTitle>
                  <CardDescription>
                    Define inclusion and exclusion criteria
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Demographics</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-sm">Age Range</Label>
                        <div className="flex gap-2">
                          <Input placeholder="Min" className="w-20" />
                          <span className="self-center">to</span>
                          <Input placeholder="Max" className="w-20" />
                          <span className="self-center text-sm text-slate-600">
                            years
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Gender</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">
                      Clinical Conditions
                    </h4>
                    <div className="space-y-2">
                      <Input placeholder="Search diagnosis codes or conditions..." />
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          Hypertension{' '}
                          <span className="ml-1 cursor-pointer">×</span>
                        </Badge>
                        <Badge variant="secondary">
                          Type 2 Diabetes{' '}
                          <span className="ml-1 cursor-pointer">×</span>
                        </Badge>
                        <Badge variant="secondary">
                          Hyperlipidemia{' '}
                          <span className="ml-1 cursor-pointer">×</span>
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Medications</h4>
                    <div className="space-y-2">
                      <Input placeholder="Search medications..." />
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          Statins <span className="ml-1 cursor-pointer">×</span>
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Lab Values</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-sm">HbA1c</Label>
                        <div className="flex gap-2">
                          <Input placeholder="Min" className="w-20" />
                          <span className="self-center">to</span>
                          <Input placeholder="Max" className="w-20" />
                          <span className="self-center text-sm text-slate-600">
                            %
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">LDL Cholesterol</Label>
                        <div className="flex gap-2">
                          <Input placeholder="Min" className="w-20" />
                          <span className="self-center">to</span>
                          <Input placeholder="Max" className="w-20" />
                          <span className="self-center text-sm text-slate-600">
                            mg/dL
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1">
                      <Search className="mr-2 h-4 w-4" />
                      Preview Cohort
                    </Button>
                    <Button className="flex-1" onClick={handleGenerateReport}>
                      Generate Feasibility Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        Estimated Cohort Size
                      </span>
                      <span className="font-semibold">~1,200</span>
                    </div>
                    <Progress value={65} />
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Data Completeness</span>
                      <span className="font-semibold">87%</span>
                    </div>
                    <Progress value={87} />
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Feasibility Score</span>
                      <span className="font-semibold text-green-600">High</span>
                    </div>
                    <Progress value={85} className="bg-green-200" />
                  </div>

                  <Alert className="mt-4">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle className="text-sm">Good Coverage</AlertTitle>
                    <AlertDescription className="text-xs">
                      Sufficient data available for your criteria
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 3: Results */}
          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Feasibility Assessment Results</span>
                  <Badge className="bg-green-500">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Study is Feasible
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Analysis based on{' '}
                  {dataSource === 'synthetic' ? 'synthetic' : 'anonymized real'}{' '}
                  data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Users className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                        <div className="text-3xl font-bold">
                          {cohortSize.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-600">
                          Eligible Patients
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <BarChart3 className="mx-auto mb-2 h-8 w-8 text-green-500" />
                        <div className="text-3xl font-bold">
                          {feasibilityScore}%
                        </div>
                        <div className="text-sm text-slate-600">
                          Feasibility Score
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Database className="mx-auto mb-2 h-8 w-8 text-purple-500" />
                        <div className="text-3xl font-bold">92%</div>
                        <div className="text-sm text-slate-600">
                          Data Quality
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Calendar className="mx-auto mb-2 h-8 w-8 text-orange-500" />
                        <div className="text-3xl font-bold">4.2</div>
                        <div className="text-sm text-slate-600">
                          Avg Years Data
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Demographics Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="mb-1 flex justify-between text-sm">
                            <span>Age 40-50</span>
                            <span className="font-semibold">23%</span>
                          </div>
                          <Progress value={23} />
                        </div>
                        <div>
                          <div className="mb-1 flex justify-between text-sm">
                            <span>Age 51-60</span>
                            <span className="font-semibold">35%</span>
                          </div>
                          <Progress value={35} />
                        </div>
                        <div>
                          <div className="mb-1 flex justify-between text-sm">
                            <span>Age 61-70</span>
                            <span className="font-semibold">28%</span>
                          </div>
                          <Progress value={28} />
                        </div>
                        <div>
                          <div className="mb-1 flex justify-between text-sm">
                            <span>Age 71+</span>
                            <span className="font-semibold">14%</span>
                          </div>
                          <Progress value={14} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Data Availability
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Diagnosis Codes</span>
                          <Badge variant="secondary">98%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Lab Results</span>
                          <Badge variant="secondary">94%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Medications</span>
                          <Badge variant="secondary">91%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Procedures</span>
                          <Badge variant="secondary">89%</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Vital Signs</span>
                          <Badge variant="secondary">86%</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Recommendation</AlertTitle>
                  <AlertDescription>
                    Based on the analysis, your study has sufficient data
                    availability and cohort size. You may proceed with protocol
                    submission. Consider refining age criteria to increase
                    cohort size by 15-20%.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('cohort')}
                  >
                    Refine Criteria
                  </Button>
                  <Button onClick={() => setActiveTab('report')}>
                    Generate Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Export Report */}
          <TabsContent value="report" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Export Feasibility Report</CardTitle>
                <CardDescription>
                  Download your assessment results for protocol submission
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Report Contents</AlertTitle>
                  <AlertDescription>
                    Your report includes cohort statistics, data quality
                    metrics, demographics, and feasibility recommendations. No
                    individual patient data is included.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <h4 className="font-semibold">
                          Full Feasibility Report (PDF)
                        </h4>
                        <p className="text-sm text-slate-600">
                          Complete analysis with visualizations
                        </p>
                      </div>
                    </div>
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <Database className="h-8 w-8 text-green-500" />
                      <div>
                        <h4 className="font-semibold">Data Summary (CSV)</h4>
                        <p className="text-sm text-slate-600">
                          Aggregated statistics for further analysis
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-8 w-8 text-purple-500" />
                      <div>
                        <h4 className="font-semibold">
                          Executive Summary (DOCX)
                        </h4>
                        <p className="text-sm text-slate-600">
                          Brief overview for protocol documents
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="mb-3 font-semibold">Next Steps</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">
                          Prepare Protocol Submission
                        </p>
                        <p className="text-sm text-slate-600">
                          Use feasibility report to support your protocol
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Request Data Access</p>
                        <p className="text-sm text-slate-600">
                          Submit formal data access request for approved
                          protocol
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Schedule Consultation</p>
                        <p className="text-sm text-slate-600">
                          Discuss findings with data steward if needed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('define')}
                  >
                    Start New Assessment
                  </Button>
                  <Button>Proceed to Protocol Submission</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
