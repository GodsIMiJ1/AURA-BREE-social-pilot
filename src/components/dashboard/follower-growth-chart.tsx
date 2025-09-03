
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { week: "Week 1", linkedin: 50, twitter: 80, facebook: 30, instagram: 60, discord: 20 },
  { week: "Week 2", linkedin: 150, twitter: 200, facebook: 80, instagram: 120, discord: 50 },
  { week: "Week 3", linkedin: 275, twitter: 350, facebook: 150, instagram: 240, discord: 100 },
  { week: "Week 4", linkedin: 450, twitter: 550, facebook: 250, instagram: 400, discord: 150 },
  { week: "Week 5", linkedin: 600, twitter: 750, facebook: 350, instagram: 580, discord: 200 },
]

const chartConfig = {
  followers: {
    label: "Followers",
  },
  linkedin: {
    label: "LinkedIn",
    color: "hsl(var(--chart-1))",
  },
  twitter: {
    label: "Twitter",
    color: "hsl(var(--chart-2))",
  },
  facebook: {
    label: "Facebook",
    color: "hsl(var(--chart-3))",
  },
  instagram: {
    label: "Instagram",
    color: "hsl(var(--chart-4))",
  },
  discord: {
    label: "Discord",
    color: "hsl(var(--chart-5))",
  },
}

export function FollowerGrowthChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Follower Growth</CardTitle>
        <CardDescription>Weekly follower growth across all platforms</CardDescription>
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
                <Line dataKey="linkedin" type="monotone" stroke="var(--color-linkedin)" strokeWidth={2} dot={false} />
                <Line dataKey="twitter" type="monotone" stroke="var(--color-twitter)" strokeWidth={2} dot={false} />
                <Line dataKey="facebook" type="monotone" stroke="var(--color-facebook)" strokeWidth={2} dot={false} />
                <Line dataKey="instagram" type="monotone" stroke="var(--color-instagram)" strokeWidth={2} dot={false} />
                <Line dataKey="discord" type="monotone" stroke="var(--color-discord)" strokeWidth={2} dot={false} />
            </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total followers for the last 5 weeks
        </div>
      </CardFooter>
    </Card>
  )
}
