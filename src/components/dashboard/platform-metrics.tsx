import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PlatformMetricsProps {
  platform: string;
  Icon: LucideIcon;
}

export function PlatformMetricsCard({ platform, Icon }: PlatformMetricsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{platform}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor={`${platform}-followers`} className="text-xs">Followers</Label>
          <Input id={`${platform}-followers`} type="number" placeholder="0" />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${platform}-engagement`} className="text-xs">Engagement %</Label>
          <Input id={`${platform}-engagement`} type="number" placeholder="0.0" step="0.1" />
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${platform}-posts`} className="text-xs">Posts Today</Label>
          <Input id={`${platform}-posts`} type="number" placeholder="0" />
        </div>
      </CardContent>
    </Card>
  );
}
