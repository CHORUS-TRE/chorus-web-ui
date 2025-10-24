'use client'

import {
  Activity,
  Droplet,
  Heart,
  Stethoscope,
  Thermometer,
  TrendingDown,
  Wind
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '~/components/ui/breadcrumb'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '~/components/ui/table'

// Mock patient data
const patientsData = {
  PATIENT_1: {
    id: 'PATIENT_1',
    name: 'Sven Bolt',
    metrics: {
      heartRate: 79.42,
      bloodPressure: 119.6,
      respirationRate: 15,
      bloodGlucose: 170,
      bodyTemperature: 31.55,
      bloodCholesterol: 210,
      stepsWalked: 3231,
      targetSteps: 11000,
      sleepingHrs: 4.87,
      maximumHrs: 11
    },
    healthData: {
      gender: 'Male',
      age: 49,
      bloodGroup: 'A+',
      weight: 70,
      bodyMass: 22,
      bmiWeight: 'Normal'
    }
  },
  PATIENT_2: {
    id: 'PATIENT_2',
    name: 'Carine Steel',
    metrics: {
      heartRate: 82.15,
      bloodPressure: 125.3,
      respirationRate: 16,
      bloodGlucose: 145,
      bodyTemperature: 36.8,
      bloodCholesterol: 195,
      stepsWalked: 5420,
      targetSteps: 11000,
      sleepingHrs: 7.2,
      maximumHrs: 11
    },
    healthData: {
      gender: 'Male',
      age: 55,
      bloodGroup: 'B+',
      weight: 64,
      bodyMass: 21,
      bmiWeight: 'Normal'
    }
  }
}

const allPatients = [
  {
    id: 'PATIENT_1',
    name: 'Sven Bolt',
    gender: 'Male',
    age: 49,
    bloodGroup: 'A+',
    weight: 70,
    bodyMass: 22,
    bmiWeight: 'Normal'
  },
  {
    id: 'PATIENT_2',
    name: 'Carine Steel',
    gender: 'Male',
    age: 55,
    bloodGroup: 'B+',
    weight: 64,
    bodyMass: 21,
    bmiWeight: 'Normal'
  },
  {
    id: 'PATIENT_3',
    name: 'Paula Moses',
    gender: 'Female',
    age: 52,
    bloodGroup: 'O+',
    weight: 70,
    bodyMass: 23,
    bmiWeight: 'Normal'
  },
  {
    id: 'PATIENT_4',
    name: 'Lio Wilson',
    gender: 'Male',
    age: 59,
    bloodGroup: 'AB+',
    weight: 55,
    bodyMass: 23,
    bmiWeight: 'Normal'
  },
  {
    id: 'PATIENT_5',
    name: 'Pedro Pipes',
    gender: 'Female',
    age: 59,
    bloodGroup: 'O+',
    weight: 49,
    bodyMass: 34,
    bmiWeight: 'Obese'
  },
  {
    id: 'PATIENT_6',
    name: 'Aria Bolt',
    gender: 'Female',
    age: 57,
    bloodGroup: 'A+',
    weight: 63,
    bodyMass: 31,
    bmiWeight: 'Obese'
  },
  {
    id: 'PATIENT_7',
    name: 'Philip Mentel',
    gender: 'Male',
    age: 56,
    bloodGroup: 'B+',
    weight: 68,
    bodyMass: 25,
    bmiWeight: 'Overweight'
  },
  {
    id: 'PATIENT_8',
    name: 'Paolo Mcken',
    gender: 'Male',
    age: 59,
    bloodGroup: 'AB+',
    weight: 76,
    bodyMass: 23,
    bmiWeight: 'Normal'
  },
  {
    id: 'PATIENT_9',
    name: 'Peter Latimer',
    gender: 'Female',
    age: 60,
    bloodGroup: 'O+',
    weight: 77,
    bodyMass: 26,
    bmiWeight: 'Overweight'
  },
  {
    id: 'PATIENT_10',
    name: 'Henriette Schiller',
    gender: 'Male',
    age: 57,
    bloodGroup: 'A+',
    weight: 64,
    bodyMass: 21,
    bmiWeight: 'Normal'
  }
]

export default function PatientDashboardPage() {
  const [selectedPatient, setSelectedPatient] = useState<string>('PATIENT_1')

  const currentPatient =
    patientsData[selectedPatient as keyof typeof patientsData] ||
    patientsData.PATIENT_1
  const metrics = currentPatient.metrics

  const stepsPercentage = (
    (metrics.stepsWalked / metrics.targetSteps) * 100 -
    100
  ).toFixed(0)
  const sleepPercentage = (
    (metrics.sleepingHrs / metrics.maximumHrs) * 100 -
    100
  ).toFixed(2)

  return (
    <div className="m-8">
      <div className="w-full">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">CHORUS</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/sandbox">Sandbox</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Patient Health Summary</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mb-8 text-3xl font-bold">
          Patient health Summary Dashboard
        </h1>
      </div>

      {/* Top Row: Patient Selector and Summary */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Patient Health Summary Card */}
        <Card className="card-glass">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-pink-500 p-3">
                <Heart className="h-6 w-6 fill-white text-white" />
              </div>
              <CardTitle>Patient health summary</CardTitle>
            </div>
          </CardHeader>
        </Card>

        {/* Patient ID Selector */}
        <Card className="card-glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Patient ID</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PATIENT_1">Patient 1</SelectItem>
                <SelectItem value="PATIENT_2">Patient 2</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Heart Rate */}
        <Card className="card-glass">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-pink-500 p-2">
                  <Heart className="h-5 w-5 fill-white text-white" />
                </div>
                <CardTitle className="text-sm">Heart Rate</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.heartRate} bph</p>
          </CardContent>
        </Card>
      </div>

      {/* Metrics Grid */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Blood Pressure */}
        <Card className="card-glass">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-pink-500 p-2">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-sm">Blood Pressure</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.bloodPressure} mmHg</p>
          </CardContent>
        </Card>

        {/* Respiration Rate */}
        <Card className="card-glass">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-pink-500 p-2">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-sm">Respiration Rate</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.respirationRate} bph</p>
          </CardContent>
        </Card>

        {/* Blood Glucose */}
        <Card className="card-glass">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-pink-500 p-2">
                <Droplet className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-sm">Blood Glucose</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.bloodGlucose} mg/dl</p>
          </CardContent>
        </Card>

        {/* Body Temperature */}
        <Card className="card-glass">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-pink-500 p-2">
                <Thermometer className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-sm">Body Temperature</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{metrics.bodyTemperature} C</p>
          </CardContent>
        </Card>

        {/* Blood Cholesterol */}
        <Card className="card-glass">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-pink-500 p-2">
                <Wind className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-sm">Blood Cholesterol</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {metrics.bloodCholesterol} mg/dl
            </p>
          </CardContent>
        </Card>

        {/* Step Counter */}
        <Card className="card-glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Step Counter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-pink-500" />
              <span className="text-xl font-bold text-pink-500">
                {stepsPercentage} %
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Steps Walked</p>
                <p className="font-semibold">
                  {metrics.stepsWalked.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Target Steps</p>
                <p className="font-semibold">
                  {metrics.targetSteps.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Hours */}
        <Card className="card-glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Step Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-pink-500" />
              <span className="text-xl font-bold text-pink-500">
                {sleepPercentage} %
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Sleeping Hrs</p>
                <p className="font-semibold">{metrics.sleepingHrs} hr</p>
              </div>
              <div>
                <p className="text-muted-foreground">Maximum Hrs</p>
                <p className="font-semibold">{metrics.maximumHrs} hr</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Health Summary Table */}
      <div className="mb-6">
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Patient health Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-100 dark:bg-blue-950">
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Body Mass</TableHead>
                    <TableHead>BMI Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        {patient.id}
                      </TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.bloodGroup}</TableCell>
                      <TableCell>{patient.weight} kg</TableCell>
                      <TableCell>{patient.bodyMass} kg/m2</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-2 w-2 rounded-full ${
                              patient.bmiWeight === 'Normal'
                                ? 'bg-blue-500'
                                : 'bg-pink-500'
                            }`}
                          />
                          {patient.bmiWeight}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sleep Hours Chart Placeholder */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle>
            Sleep Hours vs Deep Sleep Hours Summary - {selectedPatient}
          </CardTitle>
          <CardDescription>Last 30 Days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-muted-foreground">
              Chart visualization would be implemented here with a charting
              library (e.g., Recharts)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
