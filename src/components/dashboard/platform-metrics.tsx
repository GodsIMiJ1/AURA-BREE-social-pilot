"use client";

import * as React from "react";
import { LucideIcon, HeartPulse, Library, Landmark, FileCheck, Users, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const iconMap: { [key: string]: LucideIcon } = {
  HeartPulse,
  Library,
  Landmark,
  FileCheck,
  Users,
};

interface PlatformMetricsProps {
  platform: string;
  iconName: string;
}

export function PlatformMetricsCard({ platform, iconName }: PlatformMetricsProps) {
  const [metric1, setMetric1] = React.useState("");
  const [metric2, setMetric2] = React.useState("");
  const [metric3, setMetric3] = React.useState("");
  const [dataSource, setDataSource] = React.useState<"manual" | "auto">("manual");
  const isAuto = dataSource === "auto";

  const Icon = iconMap[iconName];

  const getLabels = () => {
    switch (platform) {
      case "Clinical Pilots":
        return { label1: "Pilots Active", label2: "Dignity Score", label3: "Emergence Events" };
      case "Research Partners":
        return { label1: "Partners", label2: "Publications", label3: "Citations" };
      case "Investor Relations":
        return { label1: "Funds Raised (k)", label2: "Active Leads", label3: "Meetings" };
      case "Regulatory Progress":
        return { label1: "Health Canada Stage", label2: "FDA Stage", label3: "Submissions" };
      case "Public Awareness":
        return { label1: "Followers", label2: "Engagement %", label3: "Media Mentions" };
      default:
        return { label1: "Metric 1", label2: "Metric 2", label3: "Metric 3" };
    }
  };

  const { label1, label2, label3 } = getLabels();

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
            <div>
                 <CardTitle className="text-base font-medium flex items-center gap-2">
                    {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
                    {platform}
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                    {isAuto ? "Data from API" : "Manual Input"}
                </CardDescription>
            </div>
             <div className="flex items-center space-x-2">
                <Wand2 className={cn("h-4 w-4 transition-colors", isAuto ? "text-primary" : "text-muted-foreground")} />
                <Switch
                    checked={isAuto}
                    onCheckedChange={(checked) => setDataSource(checked ? "auto" : "manual")}
                    aria-label="Toggle data source"
                    disabled // Disabled for now, until APIs are connected
                />
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow flex flex-col justify-end">
        <div className="space-y-1">
          <Label htmlFor={`${platform}-metric1`} className="text-xs">{label1}</Label>
          <Input 
            id={`${platform}-metric1`}
            type="text" 
            placeholder="0" 
            value={metric1}
            onChange={(e) => setMetric1(e.target.value)}
            disabled={isAuto}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${platform}-metric2`} className="text-xs">{label2}</Label>
          <Input 
            id={`${platform}-metric2`} 
            type="text"
            placeholder="0" 
            value={metric2}
            onChange={(e) => setMetric2(e.target.value)}
            disabled={isAuto}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${platform}-metric3`} className="text-xs">{label3}</Label>
          <Input 
            id={`${platform}-metric3`}
            type="text"
            placeholder="0"
            value={metric3}
            onChange={(e) => setMetric3(e.target.value)}
            disabled={isAuto}
          />
        </div>
      </CardContent>
    </Card>
  );
}
