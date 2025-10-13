// Enhanced Research Component Templates
// Inspired by AgenticGenUI by Vivek Shukla (MIT License)
// https://github.com/vivek100/AgenticGenUI

import {
  Activity,
  AlertCircle,
  Beaker,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Search,
  Users
} from 'lucide-react'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

// Enhanced Metrics Dashboard Component
export function GeneratedMetricsDashboard({
  title = 'Research Metrics',
  metrics = []
}: {
  title?: string
  metrics?: Array<{
    name: string
    value: number | string
    trend: 'up' | 'down' | 'stable'
    change: number
  }>
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>Key research performance indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.name}
                  </p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    metric.trend === 'up'
                      ? 'text-green-600'
                      : metric.trend === 'down'
                        ? 'text-red-600'
                        : 'text-gray-600'
                  }`}
                >
                  {metric.trend === 'up'
                    ? '↗'
                    : metric.trend === 'down'
                      ? '↘'
                      : '→'}
                  {metric.change}%
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Lab Equipment Tracker Component
export function GeneratedEquipmentTracker({
  title = 'Lab Equipment',
  equipment = []
}: {
  title?: string
  equipment?: Array<{
    id: string
    name: string
    status: 'available' | 'in-use' | 'maintenance'
    location: string
  }>
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'in-use':
        return 'bg-yellow-100 text-yellow-800'
      case 'maintenance':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Beaker className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          Monitor laboratory equipment status and location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {equipment.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">ID: {item.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {item.location}
                </span>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Protocol Builder Component
export function GeneratedProtocolBuilder({
  title = 'Protocol Builder',
  sections = [],
  collaborative = true
}: {
  title?: string
  sections?: string[]
  collaborative?: boolean
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          Create and manage research protocols
          {collaborative && (
            <span className="ml-2 inline-flex items-center gap-1">
              <Users className="h-3 w-3" />
              Collaborative
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="protocol-title">Protocol Title</Label>
            <Input id="protocol-title" placeholder="Enter protocol title..." />
          </div>

          <div>
            <Label htmlFor="protocol-description">Description</Label>
            <Textarea
              id="protocol-description"
              placeholder="Describe the protocol..."
            />
          </div>

          <div className="space-y-3">
            <Label>Protocol Sections</Label>
            {sections.map((section, index) => (
              <div key={index} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{section}</span>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">
              <FileText className="mr-2 h-4 w-4" />
              Save Protocol
            </Button>
            {collaborative && (
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Share
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Sample Tracker Component
export function GeneratedSampleTracker({
  title = 'Sample Tracker',
  samples = []
}: {
  title?: string
  samples?: Array<{
    id: string
    type: string
    status: string
    location: string
  }>
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Beaker className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          Track research samples and their locations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <Input placeholder="Search samples..." className="flex-1" />
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sample ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {samples.map((sample) => (
                <TableRow key={sample.id}>
                  <TableCell className="font-medium">{sample.id}</TableCell>
                  <TableCell>{sample.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        sample.status === 'stored' ? 'default' : 'secondary'
                      }
                    >
                      {sample.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{sample.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

// Kanban Board Component
export function GeneratedKanbanBoard({
  title = 'Collaboration Board',
  columns = []
}: {
  title?: string
  columns?: Array<{
    id: string
    title: string
    tasks: Array<{ id: string; title: string; assignee?: string }>
  }>
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          Collaborative task management for research teams
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {columns.map((column) => (
            <Card key={column.id} className="p-4">
              <div className="mb-3">
                <h4 className="font-medium">{column.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {column.tasks.length} tasks
                </p>
              </div>
              <div className="space-y-2">
                {column.tasks.map((task) => (
                  <div key={task.id} className="rounded-md bg-muted p-2">
                    <p className="text-sm font-medium">{task.title}</p>
                    {task.assignee && (
                      <p className="text-xs text-muted-foreground">
                        {task.assignee}
                      </p>
                    )}
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full">
                  + Add Task
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Data Collection Form Component
export function GeneratedDataForm({
  title = 'Data Collection',
  fields = []
}: {
  title?: string
  fields?: Array<{
    name: string
    type: string
    required: boolean
    label: string
    options?: string[]
  }>
}) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          Collect research data with structured forms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={index} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}{' '}
              {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.type === 'textarea' ? (
              <Textarea
                id={field.name}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.name}
                className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select {field.label.toLowerCase()}...</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id={field.name}
                type={field.type}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
              />
            )}
          </div>
        ))}

        <div className="flex gap-2 pt-4">
          <Button className="flex-1">
            <CheckCircle className="mr-2 h-4 w-4" />
            Submit Data
          </Button>
          <Button variant="outline">Save Draft</Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Timeline Component
export function GeneratedTimeline({
  title = 'Research Timeline',
  events = []
}: {
  title?: string
  events?: Array<{
    date: string
    title: string
    status: 'completed' | 'in-progress' | 'pending'
  }>
}) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-gray-400" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          Track research project milestones and progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                {getStatusIcon(event.status)}
                {index < events.length - 1 && (
                  <div className="h-8 w-px bg-border" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{event.title}</h4>
                  <span className="text-sm text-muted-foreground">
                    {event.date}
                  </span>
                </div>
                <Badge
                  variant={
                    event.status === 'completed'
                      ? 'default'
                      : event.status === 'in-progress'
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {event.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
