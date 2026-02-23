'use client'

import {
  AlertTriangle,
  Car,
  Droplets,
  FlaskConical,
  Footprints,
  Leaf,
  Mountain,
  TreePine,
  Wind,
  Zap
} from 'lucide-react'
import React from 'react'

import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Badge } from '~/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

export default function EnvironmentalDashboard() {
  // Environmental data from the file
  const envData = {
    climateChange: { value: 0.31640024811078554, unit: 'kg CO2-Eq' },
    waterUse: { value: 0.019779633667249115, unit: 'm³' },
    mineralResources: { value: 8.426445481488897e-7, unit: 'kg Sb-Eq' },
    fossilResources: { value: 3.971024917839181, unit: 'MJ' },
    ozoneDepletion: { value: 0.000791817178649855, unit: 'kg CFC-11-Eq' },
    ionisingRadiation: { value: 0.015167252731023576, unit: 'kBq U235-Eq' }
  }

  // Calculate meaningful analogies
  const analogies = {
    treesNeeded: (envData.climateChange.value / 0.021).toFixed(1), // 1 tree absorbs ~21kg CO2/year, so per day
    kmDriven: (envData.climateChange.value / 0.192).toFixed(2), // avg car emits 192g/km
    hoursOfLED: (envData.fossilResources.value / 0.036).toFixed(0), // LED bulb ~36kJ/hour
    bottlesOfWater: ((envData.waterUse.value * 1000) / 0.5).toFixed(0), // 500ml bottles
    phonesCharged: (envData.fossilResources.value / 0.0432).toFixed(0), // smartphone ~15.55Wh = 0.0432 MJ
    showerMinutes: (envData.waterUse.value / 0.01).toFixed(1) // 10L/min avg shower
  }

  const impactScore = Math.min(envData.climateChange.value * 100, 100)

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="mb-8 mt-5 flex w-full flex-row items-center gap-3 text-start">
          <Footprints className="h-9 w-9 text-accent" />
          Sustainability Footprint
        </h2>
      </div>

      <div className="w-full space-y-6">
        <div className="mb-6">
          <h3 className="mb-0 text-lg font-semibold text-foreground">
            Environmental Impact Dashboard
          </h3>
          <p className="text-sm text-muted">
            Understanding your cloud platform&apos;s direct environmental
            footprint
          </p>
        </div>

        {/* Alert Banner */}
        <Alert className="border-accent/20 bg-accent/5">
          <Leaf className="h-5 w-5 text-accent" />
          <AlertTitle className="text-foreground">
            Current Month (Partial Data)
          </AlertTitle>
          <AlertDescription className="text-muted-foreground/80">
            This data reflects your running instances and volumes for the
            current period. Full month data will provide more complete insights.
          </AlertDescription>
        </Alert>

        {/* Impact Score Card */}
        <Card className="card-glass border-accent/20 bg-gradient-to-br from-accent/10 via-background/40 to-background/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TreePine className="h-6 w-6 text-accent" />
              Impact Score
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              A composite metric of your environmental efficiency. Lower is
              better.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Monthly Goal Integration
                  </span>
                  <span className="font-semibold text-foreground">
                    {Math.round(impactScore)}/100
                  </span>
                </div>
                <Progress value={impactScore} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  {
                    label: 'Offset Trees',
                    value: analogies.treesNeeded,
                    icon: TreePine,
                    color: 'text-green-500'
                  },
                  {
                    label: 'Driving km',
                    value: analogies.kmDriven,
                    icon: Car,
                    color: 'text-blue-500'
                  },
                  {
                    label: 'Device charges',
                    value: analogies.phonesCharged,
                    icon: Zap,
                    color: 'text-yellow-500'
                  },
                  {
                    label: 'Water units',
                    value: analogies.bottlesOfWater,
                    icon: Droplets,
                    color: 'text-cyan-500'
                  }
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-muted/20 bg-background/40 p-4 shadow-sm backdrop-blur-sm"
                  >
                    <stat.icon
                      className={`mb-2 h-5 w-5 ${stat.color} opacity-80`}
                    />
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Metrics Tabs */}
        <Tabs defaultValue="climate" className="w-full">
          <TabsList className="glass-surface mb-6 grid h-auto w-full grid-cols-3 gap-2 p-1 lg:grid-cols-6">
            <TabsTrigger value="climate" className="py-2">
              Climate
            </TabsTrigger>
            <TabsTrigger value="water" className="py-2">
              Water
            </TabsTrigger>
            <TabsTrigger value="energy" className="py-2">
              Energy
            </TabsTrigger>
            <TabsTrigger value="resources" className="py-2">
              Resources
            </TabsTrigger>
            <TabsTrigger value="ozone" className="py-2">
              Ozone
            </TabsTrigger>
            <TabsTrigger value="radiation" className="py-2">
              Radiation
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents styling */}
          {[
            {
              id: 'climate',
              title: 'Climate Impact',
              desc: 'Global Warming Potential (GWP)',
              icon: Wind,
              value: envData.climateChange.value,
              unit: envData.climateChange.unit,
              color: 'text-orange-500',
              analogy1: `Equivalent to driving ${analogies.kmDriven} km in an average car`,
              analogy2: `${analogies.treesNeeded} trees needed daily to absorb this CO₂`,
              details: [
                'Contributes to global temperature rise',
                'Affects extreme weather patterns',
                'Impacts sea level rise',
                'Alters ecosystems globally'
              ]
            },
            {
              id: 'water',
              title: 'Water Usage',
              desc: 'Freshwater Consumption (WU)',
              icon: Droplets,
              value: envData.waterUse.value,
              unit: envData.waterUse.unit,
              color: 'text-blue-500',
              analogy1: `Equivalent to ${analogies.bottlesOfWater} standard 500ml bottles`,
              analogy2: `About ${analogies.showerMinutes} minutes of shower water usage`,
              details: [
                'Server cooling systems requirements',
                'Humidification controls in DC',
                'Indirect power generation needs',
                'Hardware manufacturing costs'
              ]
            },
            {
              id: 'energy',
              title: 'Energy Resource',
              desc: 'Fossil Fuel Consumption (ADPf)',
              icon: Zap,
              value: envData.fossilResources.value,
              unit: envData.fossilResources.unit,
              color: 'text-yellow-500',
              analogy1: `Could power an LED bulb for ${analogies.hoursOfLED} hours`,
              analogy2: `Energy to charge ${analogies.phonesCharged} smartphones`,
              details: [
                'Coal-fired power generation mix',
                'Natural gas facility utilization',
                'Non-renewable grid energy fraction',
                'Embedded production energy'
              ]
            },
            {
              id: 'resources',
              title: 'Mineral Scarcity',
              desc: 'Elements and Metal Depletion (ADPe)',
              icon: Mountain,
              value: envData.mineralResources.value,
              unit: envData.mineralResources.unit,
              color: 'text-purple-500',
              isExp: true,
              analogy1: 'Includes Rare earth elements for servers',
              analogy2: 'Copper, Gold & Antimony for circuits',
              details: [
                'Minerals take millions of years to form',
                'Some reserves depleting this century',
                'Mining causes biodiversity loss',
                'Supply chain sustainability risks'
              ]
            },
            {
              id: 'ozone',
              title: 'Ozone Layer',
              desc: 'Ozone Depletion Potential (ODP)',
              icon: AlertTriangle,
              value: envData.ozoneDepletion.value,
              unit: envData.ozoneDepletion.unit,
              color: 'text-indigo-500',
              analogy1: 'Impact of legacy cooling systems',
              analogy2: 'Fire suppression chemical residue',
              details: [
                'Increased UV radiation exposure',
                'Higher terrestrial ecosystem risk',
                'Damage to marine photosynthesis',
                'Global atmospheric chemistry shift'
              ]
            },
            {
              id: 'radiation',
              title: 'Ionizing Radiation',
              desc: 'Human Health Impacts (IR)',
              icon: Zap,
              value: envData.ionisingRadiation.value,
              unit: envData.ionisingRadiation.unit,
              color: 'text-pink-500',
              analogy1: 'Reflects nuclear share in energy grid',
              analogy2: 'Controlled byproduct of low-CO₂ power',
              details: [
                'Measured under normal operations',
                'Long-lived radioactive waste context',
                'Grid energy mix dependency',
                'Health impact is statistically minimal'
              ]
            }
          ].map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="card-glass overflow-hidden border-muted/20">
                  <div className="h-1 w-full bg-gradient-to-r from-accent/60 to-accent/20" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <tab.icon className={`h-5 w-5 ${tab.color}`} />
                      {tab.title}
                    </CardTitle>
                    <CardDescription>{tab.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-2xl bg-muted/20 py-8 text-center ring-1 ring-white/5">
                      <p className="text-5xl font-bold tracking-tight text-foreground">
                        {tab.isExp
                          ? tab.value.toExponential(3)
                          : tab.value.toFixed(4)}
                      </p>
                      <p className="mt-2 text-lg font-medium text-muted-foreground">
                        {tab.unit}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 rounded-xl bg-accent/5 p-4 ring-1 ring-accent/10">
                        <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent/20">
                          <Leaf className="h-3 w-3 text-accent" />
                        </div>
                        <p className="text-sm font-medium text-foreground/90">
                          {tab.analogy1}
                        </p>
                      </div>
                      <div className="flex items-start gap-3 rounded-xl bg-muted/20 p-4">
                        <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-muted-foreground/20">
                          <Footprints className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground/90">
                          {tab.analogy2}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-glass border-muted/20">
                  <CardHeader>
                    <CardTitle>Impact Summary</CardTitle>
                    <CardDescription>
                      Scientific context and risk factors
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Environmental metrics are calculated using Life Cycle
                        Assessment (LCA) methodologies, considering both direct
                        operations and upstream resource extraction.
                      </p>
                      <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
                        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-accent">
                          Key Consequences:
                        </h4>
                        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {tab.details.map((detail, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-xs text-foreground/80"
                            >
                              <div className="h-1 w-1 rounded-full bg-accent" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Optimization Pathways:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Scale correctly',
                          'Efficient regions',
                          'Resource tagging',
                          'Zero-waste code'
                        ].map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="border-muted/30 bg-background/40 hover:border-accent/40 hover:bg-accent/10"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Action Strategy Card */}
        <Card className="glass-surface mt-6 border-muted/20 shadow-xl ring-1 ring-white/5">
          <CardHeader>
            <CardTitle>Strategy for Improvement</CardTitle>
            <CardDescription>
              Actionable steps to minimize your infrastructure&apos;s
              environmental load
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Quick Efficiency',
                  items: [
                    'Right-size compute instances',
                    'Enable automated hibernation',
                    'Storage volume cleanup',
                    'Spot instances deployment'
                  ],
                  icon: Zap,
                  color: 'text-yellow-500'
                },
                {
                  title: 'Architecture & Monitoring',
                  items: [
                    'Regional footprint analysis',
                    'Serverless migration paths',
                    'Caching layer optimization',
                    'Data lifecycle policies'
                  ],
                  icon: FlaskConical,
                  color: 'text-accent'
                },
                {
                  title: 'Long-term Goals',
                  items: [
                    'Carbon-neutral region selection',
                    'Renewable offset integration',
                    'Infrastructure as Code audits',
                    'Sustainability reporting'
                  ],
                  icon: Leaf,
                  color: 'text-green-500'
                }
              ].map((column, idx) => (
                <div
                  key={idx}
                  className="space-y-4 rounded-2xl bg-muted/5 p-5 ring-1 ring-white/5"
                >
                  <div className="flex items-center gap-3">
                    <column.icon className={`h-5 w-5 ${column.color}`} />
                    <h3 className="font-bold text-foreground">
                      {column.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {column.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-sm text-muted-foreground"
                      >
                        <div className="h-1 w-1 rounded-full bg-accent opacity-50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="py-8 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
            Data approximations based on CHORUS infrastructure utilization
            heuristics
          </p>
        </div>
      </div>
    </div>
  )
}
