"use client";

import * as React from "react";
import { LucideIcon, Linkedin, Twitter, Facebook, Instagram, Bot, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const iconMap: { [key: string]: LucideIcon } = {
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Bot,
};

interface PlatformMetricsProps {
  platform: string;
  iconName: string;
}

export function PlatformMetricsCard({ platform, iconName }: PlatformMetricsProps) {
  const [followers, setFollowers] = React.useState("");
  const [engagement, setEngagement] = React.useState("");
  const [posts, setPosts] = React.useState("");
  const [dataSource, setDataSource] = React.useState<"manual" | "auto">("manual");
  const isAuto = dataSource === "auto";

  const Icon = iconMap[iconName];

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
          <Label htmlFor={`${platform}-followers`} className="text-xs">Followers</Label>
          <Input 
            id={`${platform}-followers`} 
            type="number" 
            placeholder="0" 
            value={followers}
            onChange={(e) => setFollowers(e.target.value)}
            disabled={isAuto}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${platform}-engagement`} className="text-xs">Engagement %</Label>
          <Input 
            id={`${platform}-engagement`} 
            type="number" 
            placeholder="0.0" 
            step="0.1"
            value={engagement}
            onChange={(e) => setEngagement(e.target.value)}
            disabled={isAuto}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${platform}-posts`} className="text-xs">Posts Today</Label>
          <Input 
            id={`${platform}-posts`} 
            type="number" 
            placeholder="0"
            value={posts}
            onChange={(e) => setPosts(e.target.value)}
            disabled={isAuto}
          />
        </div>
      </CardContent>
    </Card>
  );
}
