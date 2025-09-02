import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Medal, Star, Trophy } from "lucide-react";

export function MotivationTools() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Motivation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center space-x-3">
            <Flame className="h-8 w-8 text-orange-500" />
            <div>
              <p className="font-semibold">Daily Streak</p>
              <p className="text-sm text-muted-foreground">Keep the fire burning!</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">12</p>
        </div>
        <div>
          <h3 className="mb-3 text-base font-medium">Achievements</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              <Trophy className="mr-1.5 h-4 w-4 text-yellow-500" />
              First Week
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              <Star className="mr-1.5 h-4 w-4 text-blue-500" />
              10 Posts
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              <Medal className="mr-1.5 h-4 w-4 text-green-500" />
              100 Followers
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
