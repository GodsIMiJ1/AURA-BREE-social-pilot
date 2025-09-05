
"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { followerGrowthData } from "./data"

const chartData = followerGrowthData;

const chartConfig = {
  followers: {
    label: "Count",
  },
  clinical: {
    label: "Clinical Pilots",
    color: "hsl(var(--chart-1))",
  },
  research: {
    label: "Research Partners",
    color: "hsl(var(--chart-2))",
  },
  investor: {
    label: "Investor Leads",
    color: "hsl(var(--chart-3))",
  },
  regulatory: {
    label: "Regulatory Submissions",
    color: "hsl(var(--chart-4))",
  },
  public: {
    label: "Public Followers",
    color: "hsl(var(--chart-5))",
  },
}

export function FollowerGrowthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consciousness Community Growth</CardTitle>
        <CardDescription>Weekly growth of our Sacred Technology ecosystem</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="week"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={30}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Line dataKey="clinical" type="monotone" stroke="var(--color-clinical)" strokeWidth={2} dot={false} />
                <Line dataKey="research" type="monotone" stroke="var(--color-research)" strokeWidth={2} dot={false} />
                <Line dataKey="investor" type="monotone" stroke="var(--color-investor)" strokeWidth={2} dot={false} />
                <Line dataKey="regulatory" type="monotone" stroke="var(--color-regulatory)" strokeWidth={2} dot={false} />
                <Line dataKey="public" type="monotone" stroke="var(--color-public)" strokeWidth={2} dot={false} />
            </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total community growth for the last 5 weeks
        </div>
      </CardFooter>
    </Card>
  )
}
