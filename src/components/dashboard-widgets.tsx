'use client'

import { Bar, BarChart, Rectangle, XAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import { ChartContainer } from '~/components/ui/chart'

export default async function DashboardWidgets() {
  return (
    <>
      <Card className="blur-soft max-w-xs">
        <CardHeader className="p-4 pb-0">
          <CardTitle>Carbon Footprint</CardTitle>
          <CardDescription>
            You're burning an average of 0.2g carbon per day. Good job!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-2">
          <div className="flex items-baseline gap-2 text-3xl font-bold tabular-nums leading-none">
            1,254
            <span className="text-sm font-normal text-muted-foreground">
              gc/day
            </span>
          </div>
          <ChartContainer
            config={{
              calories: { label: 'Calories', color: 'hsl(var(--chart-1))' }
            }}
            className="ml-auto w-[64px]"
          >
            <BarChart
              accessibilityLayer
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
              data={[
                { date: '2024-01-01', calories: 354 },
                { date: '2024-01-02', calories: 514 },
                { date: '2024-01-03', calories: 345 },
                { date: '2024-01-04', calories: 734 },
                { date: '2024-01-05', calories: 645 },
                { date: '2024-01-06', calories: 456 },
                { date: '2024-01-07', calories: 345 }
              ]}
            >
              <Bar
                dataKey="calories"
                fill="var(--color-calories)"
                radius={2}
                fillOpacity={0.2}
                activeIndex={6}
                activeBar={<Rectangle fillOpacity={0.8} />}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                hide
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="blur-soft max-w-xs">
        <CardHeader className="p-4 pb-0">
          <CardTitle>Storage</CardTitle>
          <CardDescription>
            You're using 1.2GB of your 5GB storage limit.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
          <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
            12.5
            <span className="text-sm font-normal text-muted-foreground">
              Mo/day
            </span>
          </div>
          <ChartContainer
            config={{
              steps: { label: 'Steps', color: 'hsl(var(--chart-1))' }
            }}
            className="ml-auto w-[72px]"
          >
            <BarChart
              accessibilityLayer
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
              data={[
                { date: '2024-01-01', steps: 2000 },
                { date: '2024-01-02', steps: 2100 },
                { date: '2024-01-03', steps: 2200 },
                { date: '2024-01-04', steps: 1300 },
                { date: '2024-01-05', steps: 1400 },
                { date: '2024-01-06', steps: 2500 },
                { date: '2024-01-07', steps: 1600 }
              ]}
            >
              <Bar
                dataKey="steps"
                fill="var(--color-steps)"
                radius={2}
                fillOpacity={0.2}
                activeIndex={6}
                activeBar={<Rectangle fillOpacity={0.8} />}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                hide
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  )
}
